import { FormEvent, useState } from "react";
import SectionReveal from "@/components/SectionReveal";
import { useToast } from "@/hooks/use-toast";

const InvestorAccess = () => {
  const [email, setEmail] = useState("");
  const [companyOrRepresentative, setCompanyOrRepresentative] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

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
        throw new Error(data.error || "Unable to submit request.");
      }

      toast({
        title: "Submitted",
        description: "Verification takes 0-60 minutes.",
      });
      setEmail("");
      setCompanyOrRepresentative("");
    } catch (error) {
      toast({
        title: "Request Failed",
        description: error instanceof Error ? error.message : "Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Company / Representative</label>
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
                disabled={isSubmitting}
                className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit for Verification"}
              </button>
            </form>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
};

export default InvestorAccess;
