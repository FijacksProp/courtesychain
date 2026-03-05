import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionReveal from "@/components/SectionReveal";
import { Building2 } from "lucide-react";

const InvestorPortal = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/investors/session/`, { credentials: "include" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.authenticated) {
          navigate("/investors/access");
          return;
        }
        setEmail(data.email || "");
      } catch {
        navigate("/investors/access");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [apiBaseUrl, navigate]);

  if (loading) {
    return <div className="section-padding pt-28 md:pt-36 text-center text-muted-foreground">Loading investor portal...</div>;
  }

  return (
    <div className="section-padding pt-28 md:pt-36">
      <div className="container-narrow mx-auto px-4 md:px-6 max-w-3xl">
        <SectionReveal>
          <div className="glass-card p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="text-primary" size={20} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold">Investor Portal</h1>
                <p className="text-sm text-muted-foreground">Restricted CourtesyChain investor access</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Access granted for <span className="font-medium text-foreground">{email}</span>. Your investor verification is active on this
              browser session.
            </p>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
};

export default InvestorPortal;
