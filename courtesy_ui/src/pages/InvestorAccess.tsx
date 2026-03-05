import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, MailCheck, ShieldCheck } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import { useToast } from "@/hooks/use-toast";

const INVESTOR_EMAIL_KEY = "cc_investor_email";

const InvestorAccess = () => {
  const [email, setEmail] = useState("");
  const [companyOrRepresentative, setCompanyOrRepresentative] = useState("");
  const [token, setToken] = useState("");
  const [flowStep, setFlowStep] = useState<"submit" | "pending" | "verified">("submit");
  const [tokenRequested, setTokenRequested] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [isRequestingToken, setIsRequestingToken] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  useEffect(() => {
    const rememberedEmail = window.localStorage.getItem(INVESTOR_EMAIL_KEY);
    if (!rememberedEmail) return;

    const loadStatus = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/investors/status/?email=${encodeURIComponent(rememberedEmail)}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.exists) {
          window.localStorage.removeItem(INVESTOR_EMAIL_KEY);
          return;
        }
        setEmail(rememberedEmail);
        setFlowStep(data.is_verified ? "verified" : "pending");
      } catch {
        // no-op for initial restore failures
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
          setFlowStep("verified");
          toast({
            title: "Investor Verified",
            description: "Your profile is approved. You can now request an access token.",
          });
        }
      } catch {
        // no-op while polling
      }
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [apiBaseUrl, flowStep, normalizedEmail, toast]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmittingRequest(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/investors/request/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          company_or_representative: companyOrRepresentative.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 409) {
          setFlowStep(data.is_verified ? "verified" : "pending");
          window.localStorage.setItem(INVESTOR_EMAIL_KEY, normalizedEmail);
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

  const onRequestToken = async () => {
    setIsRequestingToken(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/investors/request-token/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to request access token.");
      }
      setTokenRequested(true);
      toast({
        title: "Token Sent",
        description: "A 6-digit token was sent to your email. It expires in 10 minutes.",
      });
    } catch (error) {
      toast({
        title: "Token Request Failed",
        description: error instanceof Error ? error.message : "Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setIsRequestingToken(false);
    }
  };

  const onVerifyToken = async (event: FormEvent) => {
    event.preventDefault();
    setIsVerifyingToken(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/investors/verify-token/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, access_token: token.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to verify token.");
      }
      toast({
        title: "Access Granted",
        description: "Investor portal unlocked.",
      });
      navigate("/investors");
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingToken(false);
    }
  };

  return (
    <div className="section-padding pt-28 md:pt-36">
      <div className="container-narrow mx-auto px-4 md:px-6 max-w-xl">
        <SectionReveal>
          <div className="glass-card p-8 md:p-10">
            <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">Investor Access</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your investor email and company/representative details.
            </p>

            {flowStep === "submit" && (
              <form onSubmit={onSubmit} className="space-y-4">
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

            {flowStep === "verified" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 flex items-start gap-3">
                  <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Investor Verified</p>
                    <p className="text-sm text-muted-foreground">
                      Email: <span className="font-medium text-foreground">{normalizedEmail}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onRequestToken}
                  disabled={isRequestingToken}
                  className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {isRequestingToken ? "Sending Token..." : "Request Access Token"}
                </button>

                {tokenRequested && (
                  <form onSubmit={onVerifyToken} className="space-y-3 pt-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Access Token</label>
                    <div className="relative">
                      <MailCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        required
                        value={token}
                        maxLength={6}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm tracking-[0.35em] text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        placeholder="123456"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Token expires in 10 minutes.</p>
                    <button
                      type="submit"
                      disabled={isVerifyingToken}
                      className="w-full px-6 py-3 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-muted/50 transition-colors disabled:opacity-60"
                    >
                      {isVerifyingToken ? "Verifying..." : "Verify Token and Continue"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </SectionReveal>
      </div>
    </div>
  );
};

export default InvestorAccess;
