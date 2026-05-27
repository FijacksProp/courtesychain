import { Link } from "react-router-dom";
import { ArrowRight, Fingerprint, ShieldCheck, Sparkles } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";

const InvestorAccess = () => {
  return (
    <div className="section-padding pt-28 md:pt-36">
      <div className="container-narrow mx-auto px-4 md:px-6 max-w-3xl">
        <SectionReveal>
          <div className="glass-card p-8 md:p-10 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Fingerprint size={28} />
            </div>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Public Investor Access</span>
            <h1 className="mt-3 text-3xl md:text-5xl font-heading font-bold text-balance">
              Courtesy Chain Investor Deck
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm md:text-base leading-relaxed text-muted-foreground">
              The investor portal is now open for public viewing. Explore the protocol narrative, market thesis,
              roadmap, and live AIVL simulation without verification or sign-in.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 text-left">
              {[
                { icon: ShieldCheck, title: "Open Deck", body: "Review the full investor intelligence overview." },
                { icon: Sparkles, title: "Live Simulation", body: "See the AIVL verification feed in motion." },
                { icon: Fingerprint, title: "No Login", body: "No backend session, password, or database required." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-muted/20 p-4">
                  <item.icon className="mb-3 text-primary" size={18} />
                  <p className="font-heading text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/investors"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                View Investor Portal
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/investors/simulation"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card/50 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-card"
              >
                Open Simulation
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
};

export default InvestorAccess;
