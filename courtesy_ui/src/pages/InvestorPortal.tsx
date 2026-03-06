import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionReveal from "@/components/SectionReveal";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const PITCH_SLIDES = [
  {
    title: "The Vision",
    hook: "A behavioral data protocol purpose-built for high-consequence mobility systems.",
    content:
      "CourtesyChain operates as a Behavioral Oracle that tokenizes low-risk telematics data for insurance and logistics markets, converting safe conduct into verifiable digital value.",
  },
  {
    title: "The Problem ($518B Gap)",
    hook: "Risk models detect harm, but they rarely price courtesy.",
    content:
      "Global losses from preventable road incidents remain enormous. Existing infrastructure penalizes adverse behavior after the fact while failing to reward consistently safe behavior. Meanwhile, mobility data stays fragmented, weakly validated, and commercially underleveraged.",
  },
  {
    title: "The Solution (PoSD)",
    hook: "Proof-of-Safe-Driving transforms conduct into consensus.",
    content:
      "CourtesyChain introduces the Proof-of-Safe-Driving model, where verified courtesy events become measurable units of trust. This establishes the first road-native Reputation Asset with on-chain integrity.",
  },
  {
    title: "Technical Edge (AIVL)",
    hook: "Raw signals only matter when they survive adversarial validation.",
    content:
      "The AI Verification Layer (AIVL) processes telemetry through AI sanitization before on-chain validation. The pipeline addresses garbage-in-garbage-out risk and forms a defensible proprietary moat for institutional deployment.",
  },
  {
    title: "The Product (Phase 2 Interface Prototypes)",
    hook: "A user experience that makes safety economically visible.",
    content:
      "The mobile product enables participants to track driving reputation, earn $CCB incentives, and observe real-time Community Impact metrics. Safety behavior becomes measurable, intelligible, and rewarding.",
  },
  {
    title: "Market Opportunity (RWA & DePIN)",
    hook: "Positioned where physical-world data and tokenized infrastructure converge.",
    content:
      "CourtesyChain sits at the intersection of Real World Assets and DePIN, two rapidly scaling Web3 sectors. The opportunity spans insurance underwriting, logistics optimization, and smart-city data rails with a $100B+ addressable outlook.",
  },
  {
    title: "Tokenomics ($CCB)",
    hook: "From community launch to utility-backed demand.",
    content:
      "$CCB is designed as the utility layer of the protocol. The pump.fun phase established community-led distribution, while future utility is driven by data-access fees, enterprise integrations, and insurance-aligned demand mechanisms.",
  },
  {
    title: "Roadmap",
    hook: "Execution cadence is aligned to technical depth and institutional readiness.",
    content:
      "Q4 2025: Community Launch (Complete). Q1 2026: AIVL Technical Specs & Seed Funding (Current). Q2 2026: MVP Beta Testing & Telematics Integration. Q3 2026: Institutional Pilot Programs & Insurance Partnerships.",
  },
  {
    title: "Impact (Faith & Sustainability)",
    hook: "Protocol economics in service of human outcomes.",
    content:
      "CourtesyChain is built on purpose and resilience. The mission is not merely software deployment, but measurable reduction of road harm through civil behavior reinforcement. One good driver affects everyone on the road.",
  },
  {
    title: "The Ask",
    hook: "Capital to accelerate proof into infrastructure.",
    content:
      "Seed funding is allocated to AIVL mainnet engineering, application development, and strategic partnership execution. The objective is to convert validated prototypes into institutional-grade operating rails.",
  },
];

const VALUE_CARDS = [
  {
    title: "AIVL",
    body:
      "CourtesyChain does not reward raw GPS traces. AIVL sanitizes mobility signals so only genuine acts of courtesy are recognized, creating a differentiated data-quality layer for institutional confidence.",
  },
  {
    title: "$CCB Flywheel",
    body:
      "Safe driving behavior generates rewards, strengthens retention, improves data quality, and compounds into partner-ready intelligence for insurance integrations and Phase 4 revenue channels.",
  },
  {
    title: "Scalability",
    body:
      "The protocol launched on Solana for speed and ecosystem traction. The architecture progresses toward proprietary PoSD logic to support enterprise-grade throughput and control requirements.",
  },
];

const InvestorPortal = () => {
  const [email, setEmail] = useState("");
  const [companyOrRepresentative, setCompanyOrRepresentative] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/investors/session/`, { credentials: "include" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.authenticated) {
          if (data?.email) {
            window.localStorage.setItem("cc_investor_email", data.email);
          }
          navigate("/investors/access");
          return;
        }
        setEmail(data.email || "");
        setCompanyOrRepresentative(data.company_or_representative || "");
        window.localStorage.setItem("cc_investor_email", data.email || "");
      } catch {
        navigate("/investors/access");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [apiBaseUrl, navigate]);

  const particles = useMemo(
    () => Array.from({ length: 18 }).map((_, i) => ({ id: i, left: `${(i + 1) * 5}%`, delay: `${(i % 6) * 1.2}s` })),
    [],
  );

  if (loading) {
    return <div className="section-padding pt-28 md:pt-36 text-center text-muted-foreground">Loading investor portal...</div>;
  }

  return (
    <div className={`min-h-screen transition-colors ${isDark ? "bg-[#040a0f] text-[#ecfff5]" : "bg-[#f5faf7] text-[#0b1e18]"}`}>
      <section className={`relative overflow-hidden border-b ${isDark ? "border-[#00ff88]/20" : "border-[#00a866]/25"}`}>
        <div
          className={`absolute inset-0 animate-investor-grid ${isDark ? "opacity-30" : "opacity-20"}`}
          style={{
            backgroundImage: isDark
              ? "linear-gradient(to right, rgba(0,255,136,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,166,35,0.09) 1px, transparent 1px)"
              : "linear-gradient(to right, rgba(0,168,102,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,166,35,0.10) 1px, transparent 1px)",
            backgroundSize: "40px 40px, 40px 40px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "radial-gradient(circle at 15% 20%, rgba(0,255,136,0.18), transparent 35%), radial-gradient(circle at 85% 70%, rgba(245,166,35,0.14), transparent 35%)"
              : "radial-gradient(circle at 15% 20%, rgba(0,168,102,0.16), transparent 36%), radial-gradient(circle at 85% 70%, rgba(245,166,35,0.18), transparent 36%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className={`absolute bottom-[-10%] h-1.5 w-1.5 rounded-full animate-[particle-float_12s_linear_infinite] ${
                isDark ? "bg-[#00ff88]/45" : "bg-[#00a866]/35"
              }`}
              style={{ left: particle.left, animationDelay: particle.delay }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6 pt-28 pb-24 md:pt-36 md:pb-32">
          <SectionReveal>
            <p className="text-xs tracking-[0.22em] uppercase text-[#f5a623] mb-5">Investor Intelligence Deck</p>
            <h1
              className={`text-4xl md:text-6xl leading-tight font-black [font-family:'Orbitron',sans-serif] max-w-4xl ${
                isDark ? "text-[#ecfff5]" : "text-[#0b1e18]"
              }`}
            >
              Courtesy Chain ($CCB): The Protocol of Politeness
            </h1>
            <p className={`mt-6 text-lg md:text-2xl max-w-3xl ${isDark ? "text-[#b3d9c6]" : "text-[#2f6050]"}`}>
              Tokenizing Road Safety through Behavioral Infrastructure
            </p>
            <div
              className={`mt-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs ${
                isDark
                  ? "border border-[#00ff88]/40 bg-[#00ff88]/10 text-[#d7ffe9]"
                  : "border border-[#00a866]/40 bg-[#00a866]/10 text-[#16503f]"
              }`}
            >
              Session active for: {email}
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 md:px-6 py-16 md:py-20">
        <div className="space-y-6">
          {PITCH_SLIDES.map((slide, index) => (
            <SectionReveal key={slide.title}>
              <article
                className={`rounded-2xl border p-6 md:p-9 ${
                  isDark
                    ? "border-[#00ff88]/20 bg-[#071118]/90 shadow-[0_0_40px_rgba(0,255,136,0.08)]"
                    : "border-[#00a866]/20 bg-[#ffffff]/90 shadow-[0_0_26px_rgba(0,168,102,0.08)]"
                }`}
              >
                <h2 className={`mt-3 text-2xl md:text-3xl [font-family:'Orbitron',sans-serif] ${isDark ? "text-[#ecfff5]" : "text-[#0f2a1f]"}`}>
                  {slide.title}
                </h2>
                <p className="mt-4 text-[#f5a623] text-sm md:text-base">{slide.hook}</p>
                <p className={`mt-4 leading-relaxed text-sm md:text-base ${isDark ? "text-[#c8e6d7]" : "text-[#365c4f]"}`}>{slide.content}</p>

                {index === 4 && (
                  <div className="mt-7">
                    <Link
                      to="/investors/simulation"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#00ff88] text-[#042014] px-5 py-3 font-semibold hover:bg-[#22ff99] transition-colors"
                    >
                      View Live AIVL Simulation
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                )}

                {index === 9 && (
                  <div className="mt-7">
                    <Link
                      to="/contact"
                      className={`inline-flex items-center gap-2 rounded-lg border px-5 py-3 font-semibold transition-colors ${
                        isDark
                          ? "border-[#f5a623]/60 text-[#f6c46a] hover:bg-[#f5a623]/10"
                          : "border-[#d88d14]/70 text-[#b87308] hover:bg-[#f5a623]/12"
                      }`}
                    >
                      Join the Movement — Contact Us
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </article>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 md:px-6 pb-20 md:pb-28">
        <SectionReveal>
          <div className={`rounded-2xl border p-6 md:p-9 ${isDark ? "border-[#f5a623]/25 bg-[#09131a]" : "border-[#d88d14]/30 bg-[#ffffff]"}`}>
            <h3 className={`text-2xl md:text-4xl [font-family:'Orbitron',sans-serif] ${isDark ? "text-[#ecfff5]" : "text-[#0f2a1f]"}`}>
              Transforming Behavior into a Real-World Asset (RWA)
            </h3>
            <div className="mt-8 grid md:grid-cols-3 gap-5">
              {VALUE_CARDS.map((card) => (
                <article
                  key={card.title}
                  className={`rounded-xl border p-5 ${isDark ? "border-[#00ff88]/20 bg-[#0c1821]" : "border-[#00a866]/20 bg-[#f6fffb]"}`}
                >
                  <h4 className="text-lg [font-family:'Orbitron',sans-serif] text-[#00ff88]">{card.title}</h4>
                  <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-[#c8e6d7]" : "text-[#365c4f]"}`}>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </SectionReveal>
      </section>

      <div className="mx-auto max-w-6xl px-4 md:px-6 pb-14">
        <div
          className={`rounded-lg border px-4 py-3 text-xs ${
            isDark ? "border-[#1d2e39] bg-[#061018] text-[#86a79b]" : "border-[#cfe8dc] bg-[#eef8f2] text-[#4e7365]"
          }`}
        >
          <p>Investor email: {email}</p>
          <p>Company/Rep: {companyOrRepresentative}</p>
        </div>
      </div>
    </div>
  );
};

export default InvestorPortal;
