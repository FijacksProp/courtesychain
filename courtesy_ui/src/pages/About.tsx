import { ArrowRight, Heart, Eye, Shield, Leaf, Users, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import SectionReveal from "@/components/SectionReveal";
import familyImg from "@/assets/family-driving.webp";
import ccSign from "@/assets/cc-sign.jpg";

const values = [
  { icon: Heart, title: "Courtesy as Currency", desc: "Every token earned is proof of a real-world act of kindness on the road." },
  { icon: Shield, title: "Safety First", desc: "Instant behavior feedback reduces accidents caused by human error—the root of 90% of crashes." },
  { icon: Eye, title: "Transparency", desc: "Blockchain-verified records create an immutable, transparent system of accountability." },
  { icon: Brain, title: "AI-Powered", desc: "Advanced machine learning analyzes driving data with context awareness for fair, accurate verification." },
  { icon: Leaf, title: "Sustainability", desc: "Eco-friendly Proof-of-Stake ensures sustainable, low-energy blockchain operations." },
  { icon: Users, title: "Community-Driven", desc: "DAO governance empowers token holders to shape the protocol's future together." },
];

const About = () => (
  <div className="relative">
    {/* Hero */}
    <section className="section-padding pt-28 md:pt-36">
      <div className="container-narrow mx-auto px-4 md:px-6 text-center">
        <SectionReveal>
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Our Story</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-6 text-balance">
            Born from Tragedy,{" "}
            <span className="gradient-text">Built with Purpose</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Courtesy Chain transforms a family's devastating experience into a global movement for safer roads. Our story is one of resilience, faith, and innovation.
          </p>
        </SectionReveal>
      </div>
    </section>

    {/* Origin Story */}
    <section className="section-padding pt-12">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <SectionReveal>
            <div className="relative rounded-2xl overflow-hidden">
              <img src={ccSign} alt="Courtesy Chain" className="w-full h-96 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <h2 className="text-3xl font-heading font-bold mb-6">A Story of Resilience</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Courtesy Chain began with a family tragedy that became a mission. After a devastating car accident that injured both father and son, the founder realized that a few seconds of courtesy—a single act of patience—could have changed everything.
              </p>
              <p>
                That moment of impact became a moment of clarity. The father, recovering alongside his son, made a commitment: to transform the pain of that experience into a force for preventing similar tragedies worldwide.
              </p>
              <p>
                What started as a personal story of survival evolved into a global movement built on faith, recovery, and innovation—one that uses blockchain rewards to encourage safer roads, stronger families, and smarter communities.
              </p>
            </div>
            <blockquote className="mt-6 border-l-2 border-primary pl-4 italic text-muted-foreground">
              "Every driver becomes a living node of kindness—connected, verified, and rewarded for contributing to safer shared roads."
            </blockquote>
          </SectionReveal>
        </div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="section-padding bg-card/30">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Our Foundation</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3">Mission & Vision</h2>
          </div>
        </SectionReveal>
        <div className="grid md:grid-cols-2 gap-8">
          <SectionReveal>
            <div className="glass-card-hover p-8 h-full">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To make courtesy measurable and rewarding—saving lives through kindness, technology, and accountability. We believe that when good driving is incentivized through blockchain-verified rewards, roads become safer for everyone.
              </p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.15}>
            <div className="glass-card-hover p-8 h-full">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <span className="text-xl">🔭</span>
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                A world where every driver becomes a living node of kindness—connected, verified, and rewarded for contributing to safer shared roads. We envision a behavioral economy where courtesy becomes the most valuable currency on the road.
              </p>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="section-padding">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">What We Stand For</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3">Our Core Values</h2>
          </div>
        </SectionReveal>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <div className="glass-card-hover p-7 h-full">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="text-primary" size={20} />
                </div>
                <h3 className="font-heading font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Impact */}
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={familyImg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      </div>
      <div className="container-narrow mx-auto px-4 md:px-6 relative z-10 text-center">
        <SectionReveal>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Changing Lives, One Drive at a Time</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            Courtesy Chain creates a new behavioral economy based on kindness. When one good driver acts courteously, it affects everyone on the road. Accident reduction through instant behavior feedback. Insurers gain fair risk metrics. Families feel safer knowing data protects loved ones.
          </p>
          <blockquote className="text-lg italic text-muted-foreground max-w-xl mx-auto mb-8">
            "One good driver affects everyone on the road. When courtesy becomes currency, safety becomes inevitable."
            <cite className="block text-sm mt-2 not-italic text-primary">— Mac, Courtesy Chain Founder</cite>
          </blockquote>
          <Link to="/how-it-works" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            See How It Works <ArrowRight size={16} />
          </Link>
        </SectionReveal>
      </div>
    </section>
  </div>
);

export default About;
