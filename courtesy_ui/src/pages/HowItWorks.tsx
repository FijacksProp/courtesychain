import { ArrowRight, Download, Smartphone, Wallet, Car, Coins, ChevronRight, Shield, Zap, Lock, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import SectionReveal from "@/components/SectionReveal";
import appMockup from "@/assets/app-mockup.webp";
import blockchainImg from "@/assets/blockchain-network.webp";

const gettingStarted = [
  { icon: Download, title: "Download App", desc: "Get the Courtesy Chain app from iOS App Store or Google Play Store and create your account." },
  { icon: Wallet, title: "Connect Wallet", desc: "Link your Solana wallet to securely receive $COURTESY token rewards instantly." },
  { icon: Car, title: "Drive Safely", desc: "Practice courteous driving while our AI system verifies and scores your behavior." },
  { icon: Coins, title: "Earn Rewards", desc: "Receive $COURTESY tokens instantly to your wallet after each verified courteous trip." },
];

const rewardActions = [
  { action: "Yielding Safely", desc: "Allows merge or turn safely without forcing others to brake", points: "+10", multiplier: "1.2x", positive: true },
  { action: "Smooth Braking", desc: "Maintains safe distance and brakes gradually", points: "+8", multiplier: "1.1x", positive: true },
  { action: "Speed Compliance", desc: "Consistent, lawful driving within speed limits", points: "+5", multiplier: "1.0x", positive: true },
  { action: "Hard Braking / Cutoff", desc: "Unsafe driving behavior, no reward issued", points: "0", multiplier: "0x", positive: false },
  { action: "Repeated Aggression", desc: "Aggressive pattern reduces total score", points: "-10", multiplier: "Penalty", positive: false },
];

const techFeatures = [
  { icon: Shield, title: "Zero-Knowledge Proofs", desc: "Verify events without revealing personal data. Your privacy is protected at every step." },
  { icon: Zap, title: "Federated AI Learning", desc: "AI models improve collectively without exposing private user data." },
  { icon: Lock, title: "Encrypted & Anonymous", desc: "Each driver ID is hashed before on-chain recording. Raw data never touches the public ledger." },
  { icon: Leaf, title: "Eco-Friendly PoS", desc: "Low-energy Proof-of-Stake ensures sustainable blockchain operations." },
];

const rewardFlow = [
  "Trip ends — AI scores your driving behavior",
  "PoSD validators confirm data on-chain",
  "Smart contract calculates & issues tokens",
  "Wallet updates with $COURTESY in real time",
];

const HowItWorks = () => (
  <div className="relative">
    {/* Hero */}
    <section className="section-padding pt-28 md:pt-36">
      <div className="container-narrow mx-auto px-4 md:px-6 text-center">
        <SectionReveal>
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Complete Guide</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-6 text-balance">
            How <span className="gradient-text">Courtesy Chain</span> Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your complete guide to earning $COURTESY tokens through courteous driving and blockchain rewards.
          </p>
        </SectionReveal>
      </div>
    </section>

    {/* Getting Started */}
    <section className="section-padding pt-12">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Getting Started</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3">Start Earning in 4 Simple Steps</h2>
          </div>
        </SectionReveal>
        <div className="grid md:grid-cols-4 gap-6">
          {gettingStarted.map((s, i) => (
            <SectionReveal key={i} delay={i * 0.12}>
              <div className="glass-card-hover p-6 text-center h-full relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-heading font-bold text-sm flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <s.icon className="mx-auto text-primary mb-3" size={28} />
                <h3 className="font-heading font-semibold mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < gettingStarted.length - 1 && (
                  <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 hidden md:block" size={20} />
                )}
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>

    {/* App Mockup */}
    <section className="section-padding bg-card/30">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <SectionReveal>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
                <img src={appMockup} alt="Courtesy Chain App" className="relative w-64 rounded-2xl shadow-2xl" />
              </div>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">The App</span>
            <h2 className="text-3xl font-heading font-bold mt-3 mb-6">Your Driving Companion</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The Courtesy Chain mobile app uses your smartphone's GPS, accelerometer, and telematics to capture driving data in real-time. All data is privacy-protected and processed through our AI Verification Layer.
            </p>
            <div className="space-y-3">
              {["Real-time courtesy score tracking", "Integrated Solana wallet", "Trip history & analytics", "Community leaderboards"].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>

    {/* Reward System */}
    <section className="section-padding">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Reward System</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-4">How Actions Translate to Tokens</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Our AI-powered system evaluates driving behavior in real-time, rewarding courtesy and penalizing aggression.</p>
          </div>
        </SectionReveal>
        <SectionReveal>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
                    <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Points</th>
                    <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Multiplier</th>
                  </tr>
                </thead>
                <tbody>
                  {rewardActions.map((r, i) => (
                    <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-heading font-semibold text-sm">{r.action}</td>
                      <td className="p-4 text-sm text-muted-foreground">{r.desc}</td>
                      <td className={`p-4 text-center text-sm font-bold ${r.positive ? "text-primary" : "text-destructive"}`}>{r.points}</td>
                      <td className="p-4 text-center text-sm font-mono text-muted-foreground">{r.multiplier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>

    {/* Reward Flow */}
    <section className="section-padding bg-card/30">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Reward Flow</span>
            <h2 className="text-3xl font-heading font-bold mt-3">From Drive to Wallet</h2>
          </div>
        </SectionReveal>
        <div className="max-w-xl mx-auto">
          {rewardFlow.map((step, i) => (
            <SectionReveal key={i} delay={i * 0.12}>
              <div className="flex gap-4 items-start mb-6 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-heading font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  {i < rewardFlow.length - 1 && <div className="w-px h-8 bg-border/50 mt-2" />}
                </div>
                <p className="text-sm text-muted-foreground pt-1.5">{step}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Tech Architecture */}
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={blockchainImg} alt="" className="w-full h-full object-cover opacity-30 dark:opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      </div>
      <div className="container-narrow mx-auto px-4 md:px-6 relative z-10">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Technology</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3">Privacy & Security</h2>
          </div>
        </SectionReveal>
        <div className="grid md:grid-cols-2 gap-6">
          {techFeatures.map((t, i) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <div className="glass-card-hover p-6 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <t.icon className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-1">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
        <SectionReveal delay={0.3}>
          <div className="mt-12 text-center">
            <Link to="/whitepaper" className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:gap-3 transition-all">
              Read the Full Whitepaper <ArrowRight size={14} />
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  </div>
);

export default HowItWorks;
