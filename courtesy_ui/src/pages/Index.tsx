import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Link as LinkIcon, ChevronRight, Car, Brain, Blocks, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import SectionReveal from "@/components/SectionReveal";
import heroLight from "@/assets/hero_light.png";
import heroDark from "@/assets/hero_dark.png";
import blockchainImg from "@/assets/blockchain-network.webp";
import familyImg from "@/assets/family-driving.webp";

const stats = [
  { value: "90%", label: "Accidents from Human Error" },
  { value: "100M", label: "Total $COURTESY Supply" },
  { value: "Q1 2026", label: "MVP App Launch" },
  { value: "Solana", label: "Blockchain Network" },
];

const steps = [
  { icon: Car, title: "Drive with App", desc: "Your smartphone captures driving data using GPS and accelerometer—completely privacy-protected." },
  { icon: Brain, title: "AI Analyzes", desc: "Advanced AI verifies courteous acts: yielding, smooth braking, safe following distance." },
  { icon: Blocks, title: "Blockchain Validates", desc: "PoSD validators confirm AI signatures on-chain, creating an immutable record." },
  { icon: Coins, title: "Earn Rewards", desc: "Smart contracts mint and distribute $COURTESY tokens directly to your wallet." },
];

const features = [
  { icon: Shield, title: "Privacy-First", desc: "Zero-Knowledge Proofs verify your actions without exposing personal data." },
  { icon: Zap, title: "Instant Rewards", desc: "$COURTESY tokens earned in real-time after each verified courteous trip." },
  { icon: LinkIcon, title: "On-Chain Verified", desc: "Every reward is backed by immutable blockchain proof of your courtesy." },
];

const roadmap = [
  { phase: "Phase 1", title: "Token Launch", timeline: "Q4 2025", status: "complete", items: ["Launch $COURTESY on Pump.fun", "Migrate to Raydium DEX", "Build initial community"] },
  { phase: "Phase 2", title: "MVP Mobile App", timeline: "Q1 2026", status: "active", items: ["Mobile app with integrated wallet", "Basic AI telematics integration", "Real-time courtesy tracking"] },
  { phase: "Phase 3", title: "PoSD Engine", timeline: "Q2 2026", status: "upcoming", items: ["Full AI verification layer", "Blockchain integration & validation", "Smart contract reward distribution"] },
  { phase: "Phase 4-5", title: "Mainnet Launch", timeline: "Q3 2026–Q1 2027", status: "upcoming", items: ["Insurance partner integrations", "Full PoSD blockchain launch", "DAO governance transition"] },
];

const tokenomics = [
  { label: "Community Sale (Bonding Curve)", pct: 65, color: "bg-primary" },
  { label: "Liquidity Pool (AMM)", pct: 35, color: "bg-accent" },
];

const Index = () => (
  <div className="relative">
    {/* Hero */}
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroLight}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-100 dark:opacity-0"
        />
        <img
          src={heroDark}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-0 dark:opacity-100"
        />
        <div className="absolute inset-0 transition-opacity duration-700 ease-in-out bg-gradient-to-r from-background via-background/85 to-background/20 dark:from-background/95 dark:via-background/75 dark:to-background/30" />
        <div className="absolute inset-0 transition-opacity duration-700 ease-in-out bg-gradient-to-b from-background/40 via-transparent to-background/50 dark:from-background/30 dark:to-background/85" />
      </div>
      <div className="container-narrow mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live on Solana Blockchain
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-[1.1] mb-6 text-balance">
              Courtesy Pays.{" "}
              <span className="gradient-text">Drive Kind.</span>{" "}
              Get Rewarded.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              The world's first blockchain ecosystem that transforms safe and courteous driving into measurable digital value. Join the movement revolutionizing road safety through AI-verified rewards.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Learn How It Works <ArrowRight size={16} />
              </Link>
              <a
                href="https://dexscreener.com/solana/Ah3UfdotFeMgjYmWjVv7wtzRxu481qhgNWWsXgChpump"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card/50 backdrop-blur-sm text-foreground font-semibold text-sm hover:bg-card transition-colors"
              >
                Get $COURTESY
              </a>
            </div>
          </motion.div>
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 border-y border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-heading font-bold gradient-text mb-1">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="section-padding">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Why Courtesy Chain</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-4">Built for Trust, Speed & Privacy</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A revolutionary blend of AI verification, blockchain security, and real-world rewards.</p>
          </div>
        </SectionReveal>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <SectionReveal key={i} delay={i * 0.15}>
              <div className="glass-card-hover p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <f.icon className="text-primary" size={22} />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="section-padding bg-card/30">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">The Technology</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-4">How Courtesy Chain Works</h2>
          </div>
        </SectionReveal>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <SectionReveal key={i} delay={i * 0.12}>
              <div className="glass-card-hover p-6 text-center h-full relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-heading font-bold text-sm flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <s.icon className="mx-auto text-primary mb-3" size={28} />
                <h3 className="font-heading font-semibold mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 hidden md:block" size={20} />
                )}
              </div>
            </SectionReveal>
          ))}
        </div>
        <SectionReveal delay={0.3}>
          <div className="mt-12 text-center">
            <Link to="/how-it-works" className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:gap-3 transition-all">
              View Complete Guide <ArrowRight size={14} />
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>

    {/* About / Origin */}
    <section className="section-padding">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <SectionReveal>
            <div className="relative rounded-2xl overflow-hidden">
              <img src={familyImg} alt="Family driving safely" className="w-full h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-4">Born from Tragedy, Built for Safety</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Courtesy Chain began with a devastating car accident that changed everything. When both father and son were injured in a preventable collision, one truth became painfully clear: a single act of courtesy could have saved them.
            </p>
            <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground text-sm mb-6">
              "From tragedy came purpose. From recovery came innovation. From faith came a movement to make roads safer."
            </blockquote>
            <Link to="/about" className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:gap-3 transition-all">
              Read Our Full Story <ArrowRight size={14} />
            </Link>
          </SectionReveal>
        </div>
      </div>
    </section>

    {/* Tokenomics */}
    <section className="section-padding bg-card/30">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Tokenomics</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-4">$COURTESY Token Economics</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Transparent, fair, and designed to reward real-world courtesy.</p>
          </div>
        </SectionReveal>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <SectionReveal>
            <div className="glass-card p-8">
              <div className="text-center mb-6">
                <div className="text-4xl font-heading font-bold gradient-text">100M</div>
                <div className="text-sm text-muted-foreground">Total Supply</div>
              </div>
              <div className="space-y-4">
                {tokenomics.map((t, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{t.label}</span>
                      <span className="font-semibold">{t.pct}%</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${t.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.2 }}
                        className={`h-full rounded-full ${t.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-6 text-center">Zero vesting at launch. No team allocation. Fair opportunity for all.</p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <div className="space-y-4">
              {[
                { title: "Behavior Rewards", desc: "Earned through verified courteous and safe driving actions." },
                { title: "Staking Rewards", desc: "Stake tokens to support validators and earn passive APY." },
                { title: "Governance Rights", desc: "Vote on protocol changes and ecosystem development." },
                { title: "Partner Redemptions", desc: "Redeem for insurance discounts, fuel credits, and EV charging." },
              ].map((u, i) => (
                <div key={i} className="glass-card-hover p-5 flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Coins className="text-primary" size={16} />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-sm mb-1">{u.title}</h4>
                    <p className="text-xs text-muted-foreground">{u.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>

    {/* Roadmap */}
    <section className="section-padding">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Development Roadmap</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-4">The Path to Safer Roads</h2>
          </div>
        </SectionReveal>
        <div className="grid md:grid-cols-4 gap-6">
          {roadmap.map((r, i) => (
            <SectionReveal key={i} delay={i * 0.12}>
              <div className={`glass-card p-6 h-full ${r.status === "active" ? "glow-border" : ""}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${
                    r.status === "complete" ? "bg-primary" : r.status === "active" ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                  }`} />
                  <span className="text-xs font-semibold text-muted-foreground">{r.timeline}</span>
                </div>
                <h3 className="font-heading font-semibold text-sm mb-1">{r.phase}</h3>
                <h4 className="font-heading font-bold mb-3">{r.title}</h4>
                <ul className="space-y-1.5">
                  {r.items.map((item, j) => (
                    <li key={j} className="text-xs text-muted-foreground flex gap-2">
                      <ChevronRight size={12} className="text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Blockchain Image Section */}
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={blockchainImg} alt="" className="w-full h-full object-cover opacity-40 dark:opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      </div>
      <div className="container-narrow mx-auto px-4 md:px-6 relative z-10 text-center">
        <SectionReveal>
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Join the Movement</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-4">Ready to Make Roads Safer?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Join thousands of drivers already earning $COURTESY tokens for safe, courteous behavior. Be part of the blockchain revolution transforming road safety.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/how-it-works" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              Learn More <ArrowRight size={16} />
            </Link>
            <Link to="/whitepaper" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card/50 backdrop-blur-sm text-foreground font-semibold text-sm hover:bg-card transition-colors">
              Read Whitepaper
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  </div>
);

export default Index;
