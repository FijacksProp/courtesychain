import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import { useToast } from "@/hooks/use-toast";

const INVESTOR_EMAIL_KEY = "cc_investor_email";

type FlowStep = "submit" | "pending" | "setPassword" | "login";

const InvestorAccess = () => {
  const [email, setEmail] = useState("");
  const [companyOrRepresentative, setCompanyOrRepresentative] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [flowStep, setFlowStep] = useState<FlowStep>("submit");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  useEffect(() => {
    const rememberedEmail = window.localStorage.getItem(INVESTOR_EMAIL_KEY);
    if (!rememberedEmail) return;
    setEmail(rememberedEmail);

    const loadStatus = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/investors/status/?email=${encodeURIComponent(rememberedEmail)}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.exists) {
          window.localStorage.removeItem(INVESTOR_EMAIL_KEY);
          return;
        }
        setCompanyOrRepresentative(data.company_or_representative || "");
        if (!data.is_verified) {
          setFlowStep("pending");
        } else {
          setFlowStep(data.has_password ? "login" : "setPassword");
        }
      } catch {
        // no-op
      }
    };

    loadStatus();
  }, [apiBaseUrl]);

  useEffect(() => {
    if (flowStep !== "pending" || !normalizedEmail) return;

    const intervalId = window.setInterval(async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/investors/status/?email=${encodeURIComponent(normalizedEmail)}`);
        const data = await response.json().catch(() => ({}));
        if (response.ok && data.exists && data.is_verified) {
          setCompanyOrRepresentative(data.company_or_representative || "");
          setFlowStep(data.has_password ? "login" : "setPassword");
          toast({
            title: "Investor Verified",
            description: data.has_password
              ? "Your account is verified. Enter your password to continue."
              : "Your account is verified. Set your secure password to continue.",
          });
        }
      } catch {
        // no-op while polling
      }
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [apiBaseUrl, flowStep, normalizedEmail, toast]);

  const onSubmitRequest = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmittingRequest(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/investors/request/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          company_or_representative: companyOrRepresentative.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 409) {
          window.localStorage.setItem(INVESTOR_EMAIL_KEY, normalizedEmail);
          setCompanyOrRepresentative(data.company_or_representative || companyOrRepresentative);
          if (!data.is_verified) {
            setFlowStep("pending");
          } else {
            setFlowStep(data.has_password ? "login" : "setPassword");
          }
        }
        throw new Error(data.error || "Unable to submit request.");
      }

      window.localStorage.setItem(INVESTOR_EMAIL_KEY, normalizedEmail);
      setFlowStep("pending");
      toast({
        title: "Submitted",
        description: "Verification takes 0-60 minutes.",
      });
    } catch (error) {
      toast({
        title: "Request Failed",
        description: error instanceof Error ? error.message : "Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const onSetPassword = async (event: FormEvent) => {
    event.preventDefault();
    setIsSettingPassword(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/investors/set-password/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
          confirm_password: confirmPassword,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to set password.");
      }

      toast({
        title: "Password Saved",
        description: "Investor access granted.",
      });
      navigate("/investors");
    } catch (error) {
      toast({
        title: "Password Setup Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSettingPassword(false);
    }
  };

  const onLogin = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoggingIn(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/investors/authenticate/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to authenticate.");
      }

      toast({
        title: "Access Granted",
        description: "Welcome back to the investor portal.",
      });
      navigate("/investors");
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="section-padding pt-28 md:pt-36">
      <div className="container-narrow mx-auto px-4 md:px-6 max-w-xl">
        <SectionReveal>
          <div className="glass-card p-8 md:p-10">
            <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">Investor Access</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Verified investors access the protected portal using their secure password.
            </p>

            {flowStep === "submit" && (
              <form onSubmit={onSubmitRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Investor Email</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Company / Representative
                  </label>
                  <input
                    required
                    value={companyOrRepresentative}
                    onChange={(e) => setCompanyOrRepresentative(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="Example Ventures / Portfolio Representative"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRequest}
                  className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {isSubmittingRequest ? "Submitting..." : "Submit for Verification"}
                </button>
              </form>
            )}

            {flowStep === "pending" && (
              <div className="rounded-xl border border-border bg-muted/30 p-6 text-center space-y-4">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="text-primary animate-spin" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Awaiting Verification</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We are reviewing <span className="font-medium text-foreground">{normalizedEmail}</span>. This usually takes 0-60
                    minutes.
                  </p>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-primary animate-pulse" />
                </div>
              </div>
            )}

            {flowStep === "setPassword" && (
              <form onSubmit={onSetPassword} className="space-y-4">
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 flex items-start gap-3">
                  <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Investor Verified</p>
                    <p className="text-xs text-muted-foreground mt-1">{normalizedEmail}</p>
                    <p className="text-xs text-muted-foreground">{companyOrRepresentative}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Create Secure Password</label>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="Use letters, numbers, symbols"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Confirm Password</label>
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="Re-enter password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSettingPassword}
                  className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {isSettingPassword ? "Saving..." : "Save Password and Continue"}
                </button>
              </form>
            )}

            {flowStep === "login" && (
              <form onSubmit={onLogin} className="space-y-4">
                <div className="rounded-xl border border-border bg-muted/30 p-4 flex items-start gap-3">
                  <LockKeyhole className="text-primary shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Investor Sign In</p>
                    <p className="text-xs text-muted-foreground mt-1">{normalizedEmail}</p>
                    <p className="text-xs text-muted-foreground">{companyOrRepresentative}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Password</label>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="Enter your secure password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {isLoggingIn ? "Checking..." : "Unlock Investor Portal"}
                </button>
              </form>
            )}
          </div>
        </SectionReveal>
      </div>
    </div>
  );
};

export default InvestorAccess;
