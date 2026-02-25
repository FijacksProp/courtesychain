import { Link } from "react-router-dom";
import SectionReveal from "@/components/SectionReveal";
import { ArrowRight, FileText } from "lucide-react";

const toc = [
  { id: "abstract", num: "1", title: "Abstract" },
  { id: "introduction", num: "2", title: "Introduction / Origin Story" },
  { id: "mission", num: "3", title: "Mission & Vision" },
  { id: "problem", num: "4", title: "Core Problem" },
  { id: "solution", num: "5", title: "Courtesy Chain Solution" },
  { id: "architecture", num: "6", title: "Technical Architecture" },
  { id: "aivl", num: "7", title: "AI Verification Layer (AIVL)" },
  { id: "token", num: "8", title: "Courtesy Token ($COURTESY)" },
  { id: "tokenomics", num: "9", title: "Tokenomics" },
  { id: "posd", num: "10", title: "Proof-of-Safe-Driving (PoSD)" },
  { id: "privacy", num: "11", title: "Data Privacy & Security" },
  { id: "governance", num: "12", title: "Governance Model / DAO" },
  { id: "impact", num: "13", title: "Economic & Social Impact" },
  { id: "faith", num: "14", title: "Faith & Sustainability" },
  { id: "roadmap", num: "15", title: "Roadmap" },
  { id: "conclusion", num: "16", title: "Conclusion" },
];

const Section = ({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) => (
  <SectionReveal>
    <section id={id} className="scroll-mt-24 mb-16">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-sm font-mono text-primary">{num}.</span>
        <h2 className="text-2xl md:text-3xl font-heading font-bold">{title}</h2>
      </div>
      <div className="text-muted-foreground leading-relaxed space-y-4 text-[15px]">{children}</div>
    </section>
  </SectionReveal>
);

const Whitepaper = () => (
  <div className="relative">
    {/* Hero */}
    <section className="section-padding pt-28 md:pt-36 pb-12">
      <div className="container-narrow mx-auto px-4 md:px-6 text-center">
        <SectionReveal>
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Technical Documentation</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-4">
            Courtesy Chain <span className="gradient-text">Whitepaper</span>
          </h1>
          <p className="text-muted-foreground mb-2">Version 1.5 — January 2026</p>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">Revolutionizing Road Safety Through Blockchain Rewards</p>
        </SectionReveal>
      </div>
    </section>

    {/* TOC + Content */}
    <section className="pb-20">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-[240px_1fr] gap-12">
          {/* Sidebar TOC */}
          <SectionReveal>
            <div className="hidden lg:block sticky top-24 self-start">
              <h3 className="font-heading font-semibold text-sm mb-4 flex items-center gap-2">
                <FileText size={14} className="text-primary" /> Contents
              </h3>
              <nav className="space-y-1">
                {toc.map(t => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className="block text-xs text-muted-foreground hover:text-primary transition-colors py-1 pl-3 border-l border-border hover:border-primary"
                  >
                    <span className="font-mono text-[10px] mr-1.5">{t.num}.</span>{t.title}
                  </a>
                ))}
              </nav>
            </div>
          </SectionReveal>

          {/* Content */}
          <div>
            <Section id="abstract" num="1" title="Abstract">
              <p>Courtesy Chain is a next-generation blockchain ecosystem that transforms courtesy behind the wheel into measurable digital value. By merging a new consensus model—Proof-of-Safe-Driving (PoSD)—with Proof-of-Stake (PoS) and an AI Verification Layer (AIVL), Courtesy Chain rewards verified acts of kindness and safety on the road.</p>
              <p>The network uses smartphone telematics, AI-based behavior analysis, and on-chain validation to create a transparent, low-energy system that honors responsibility and reduces preventable accidents.</p>
            </Section>

            <Section id="introduction" num="2" title="Introduction / Origin Story">
              <p>Courtesy Chain began with a family tragedy that became a mission. After a devastating car accident that injured both father and son, the founder realized that a few seconds of courtesy—a single act of patience—could have changed everything.</p>
              <p>From that day, the goal became clear: turn courtesy into a measurable, rewardable behavior. What started as a personal story of survival evolved into a global movement built on faith, recovery, and innovation—one that uses blockchain rewards to encourage safer roads, stronger families, and smarter communities.</p>
            </Section>

            <Section id="mission" num="3" title="Mission & Vision">
              <p><strong>Mission:</strong> To make courtesy measurable and rewarding—saving lives through kindness, technology, and accountability.</p>
              <p><strong>Vision:</strong> A world where every driver becomes a living node of kindness—connected, verified, and rewarded for contributing to safer shared roads. Courtesy Chain's motto encapsulates its philosophy: "Courtesy Pays. Drive Kind. Get Rewarded."</p>
            </Section>

            <Section id="problem" num="4" title="Core Problem">
              <p>Courtesy Chain addresses the human and systemic gaps that keep roads unsafe:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Approximately 90% of road accidents stem from human error—often impatience, aggression, or distraction.</li>
                <li>Current incentive programs are centralized and reactive, rewarding only after accidents or insurance claims.</li>
                <li>Drivers lack real-time feedback and motivation to drive courteously.</li>
                <li>Data privacy concerns prevent sharing behavioral data safely.</li>
              </ul>
            </Section>

            <Section id="solution" num="5" title="Courtesy Chain Solution">
              <p>Courtesy Chain merges telematics, AI, and blockchain into one trust network:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Smartphone or vehicle sensor data records driver behavior.</li>
                <li>AI Verification Engine analyzes the data for courtesy metrics (yielding, smooth braking, etc.).</li>
                <li>PoSD validator nodes confirm AI signatures on-chain.</li>
                <li>Smart contracts mint and distribute $COURTESY tokens instantly.</li>
              </ul>
              <p>This system builds a behavioral economy where doing the right thing literally pays.</p>
            </Section>

            <Section id="architecture" num="6" title="Technical Architecture">
              <p>Courtesy Chain is designed as a hybrid PoS + PoSD network with four layers:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Application Layer:</strong> Courtesy Chain mobile app (light client), wallet, and dashboard.</li>
                <li><strong>AI Verification Layer:</strong> Machine-learning models interpret raw driving data.</li>
                <li><strong>Consensus Layer:</strong> Validators stake $COURTESY to secure the network and confirm PoSD events.</li>
                <li><strong>Ledger Layer:</strong> Immutable blockchain records of verified acts and token distributions.</li>
              </ul>
              <p className="mt-4"><strong>Key Features:</strong> Lightweight mobile nodes for global scalability. Validator network anchored in eco-friendly PoS. Modular smart-contract design for rewards, governance, and staking.</p>
            </Section>

            <Section id="aivl" num="7" title="AI Verification Layer (AIVL)">
              <p>The AI Verification Layer is Courtesy Chain's "brain." It performs five key functions:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Data Interpretation:</strong> Reads GPS, accelerometer, and OBD-II feeds.</li>
                <li><strong>Behavior Classification:</strong> Distinguishes courteous vs. reckless acts.</li>
                <li><strong>Context Awareness:</strong> Considers traffic, time, and weather before judging.</li>
                <li><strong>Fraud Detection:</strong> Flags spoofed or manipulated sensor data.</li>
                <li><strong>Reward Authorization:</strong> Sends signed verification to the blockchain, triggering smart-contract rewards.</li>
              </ol>
              <p>AI models improve through federated learning: they train collectively without exposing private user data.</p>
            </Section>

            <Section id="token" num="8" title="Courtesy Token ($COURTESY)">
              <p>The Courtesy Token is the utility and reward token powering the ecosystem. Uses include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Earned through verified courteous behavior.</li>
                <li>Staked to support validators and earn passive APY.</li>
                <li>Used for governance votes.</li>
                <li>Redeemable for partner rewards (insurance, fuel, EV credits).</li>
              </ul>
              <p><strong>Token Ethos:</strong> Every token earned is proof of a real-world act of courtesy.</p>
            </Section>

            <Section id="tokenomics" num="9" title="Tokenomics">
              <div className="glass-card p-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ["Total Supply", "100 million $COURTESY"],
                      ["Bonding Curve Allocation", "65%"],
                      ["Pool Migration (AMM)", "35%"],
                      ["Vesting at Launch", "0%"],
                      ["Raise Target", "50 SOL (~$8,500)"],
                      ["Liquidity Lock", "35% post-launch"],
                      ["Projected Market Cap (90 Days)", "$30 million"],
                      ["Bonding Curve Target Cap", "$65,000"],
                    ].map(([k, v], i) => (
                      <tr key={i} className="border-b border-border/30 last:border-0">
                        <td className="py-2.5 pr-4 font-medium text-foreground">{k}</td>
                        <td className="py-2.5 text-muted-foreground">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="posd" num="10" title="Proof-of-Safe-Driving (PoSD)">
              <div className="glass-card p-6 overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 text-xs uppercase tracking-wider text-muted-foreground">Action</th>
                      <th className="text-center py-2 text-xs uppercase tracking-wider text-muted-foreground">Points</th>
                      <th className="text-center py-2 text-xs uppercase tracking-wider text-muted-foreground">Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Yielding safely", "+10", "1.2x"],
                      ["Smooth braking", "+8", "1.1x"],
                      ["Obeying speed limits", "+5", "1.0x"],
                      ["Hard braking / cutoff", "0", "0x"],
                      ["Repeated aggression", "-10", "Penalty"],
                    ].map(([a, p, m], i) => (
                      <tr key={i} className="border-b border-border/30 last:border-0">
                        <td className="py-2">{a}</td>
                        <td className="py-2 text-center font-mono">{p}</td>
                        <td className="py-2 text-center font-mono">{m}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p><strong>Reward Flow:</strong> Trip ends → AI scores behavior → PoSD validators confirm data → Smart contract issues tokens → Wallet updates in real time.</p>
            </Section>

            <Section id="privacy" num="11" title="Data Privacy & Security">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Zero-Knowledge Proofs (ZKPs)</strong> verify events without revealing personal data.</li>
                <li><strong>Encryption and anonymization:</strong> each driver ID is hashed before on-chain recording.</li>
                <li><strong>Off-chain storage:</strong> raw data never touches the public ledger.</li>
                <li><strong>User ownership:</strong> drivers own their data and decide who can view it.</li>
              </ul>
            </Section>

            <Section id="governance" num="12" title="Governance Model / DAO">
              <p>Courtesy Chain DAO will be formed after mainnet launch in three phases:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Phase 1:</strong> Foundation governance (team + validators).</li>
                <li><strong>Phase 2:</strong> Hybrid (governance portal for token holders).</li>
                <li><strong>Phase 3:</strong> Full DAO community rule.</li>
              </ol>
              <p>Voting power is weighted by staked $COURTESY. Community can propose changes to reward ratios, validator requirements, treasury allocations, and ecosystem grants.</p>
            </Section>

            <Section id="impact" num="13" title="Economic & Social Impact">
              <p>Courtesy Chain creates a new behavioral economy based on kindness:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accident reduction through instant behavior feedback.</li>
                <li>Insurers gain fair risk metrics.</li>
                <li>Families feel safer knowing data protects loved ones.</li>
                <li>Professional drivers gain financial and mental health stability.</li>
              </ul>
            </Section>

            <Section id="faith" num="14" title="Faith & Sustainability">
              <p>Courtesy Chain was born from faith, healing, and purpose. It embodies the belief that what does not defeat you can make you stronger.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Courtesy is a spiritual discipline as much as a behavioral one.</li>
                <li>Every reward symbolizes redemption and resilience.</li>
                <li>Blockchain design is eco-friendly (PoS + AI efficiency).</li>
              </ul>
              <p>The chain's strength is not only mathematical—it is moral.</p>
            </Section>

            <Section id="roadmap" num="15" title="Roadmap">
              <div className="glass-card p-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 text-xs uppercase tracking-wider text-muted-foreground">Phase</th>
                      <th className="text-left py-2 text-xs uppercase tracking-wider text-muted-foreground">Timeline</th>
                      <th className="text-left py-2 text-xs uppercase tracking-wider text-muted-foreground">Objective</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Phase 1 - Token Launch", "Q4 2025", "Launch $COURTESY on Pump.fun → Raydium"],
                      ["Phase 2 - MVP App", "Q1 2026", "Mobile app with wallet + basic AI telematics"],
                      ["Phase 3 - PoSD Engine", "Q2 2026", "AI validation + blockchain integration"],
                      ["Phase 4 - Insurance", "Q3 2026", "Partner insurers for courtesy-based premiums"],
                      ["Phase 5 - Mainnet", "Q1 2027", "Full PoSD blockchain + validator network"],
                    ].map(([p, t, o], i) => (
                      <tr key={i} className="border-b border-border/30 last:border-0">
                        <td className="py-2 font-medium">{p}</td>
                        <td className="py-2 text-muted-foreground">{t}</td>
                        <td className="py-2 text-muted-foreground">{o}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="conclusion" num="16" title="Conclusion">
              <p>Courtesy Chain is not just a blockchain—it is a movement. It transforms courtesy into currency, safety into community, and data into trust.</p>
              <p>The $COURTESY token is a utility asset within this ecosystem. It is not a security or investment vehicle. All features, timelines, and allocations are subject to change based on development progress, regulatory guidance, and community input.</p>
              <p className="text-primary font-semibold italic mt-4">Courtesy Pays. Drive Kind. Get Rewarded.</p>
            </Section>

            <div className="mt-8 text-center">
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                Get in Touch <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Whitepaper;
