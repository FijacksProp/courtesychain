import { useState } from "react";
import { Mail, MessageSquare, Briefcase, Headphones, Newspaper } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import { useToast } from "@/hooks/use-toast";

const contactChannels = [
  { icon: Mail, title: "General Inquiries", email: "contact@courtesychain.io", desc: "For general questions and information about Courtesy Chain." },
  { icon: Briefcase, title: "Business & Partnerships", email: "partnerships@courtesychain.io", desc: "For collaboration opportunities and business development." },
  { icon: Headphones, title: "Technical Support", email: "support@courtesychain.io", desc: "For app issues, bugs, and technical assistance." },
  { icon: Newspaper, title: "Media & Press", email: "press@courtesychain.io", desc: "For media inquiries, interviews, and press releases." },
];

const inquiryTypes = [
  { label: "General Inquiry", value: "general" },
  { label: "Partnership Opportunity", value: "partnership" },
  { label: "Technical Support", value: "support" },
  { label: "Media & Press", value: "media" },
  { label: "Investment Inquiry", value: "investment" },
  { label: "Other", value: "other" },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", type: "", subject: "", message: "" });

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to send message right now.");
      }

      toast({ title: "Message Sent!", description: data.message || "Thank you for reaching out. We'll respond within 24 hours." });
      setForm({ name: "", email: "", type: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Hero */}
      <section className="section-padding pt-28 md:pt-36">
        <div className="container-narrow mx-auto px-4 md:px-6 text-center">
          <SectionReveal>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Get in Touch</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-6 text-balance">
              Let's Start a <span className="gradient-text">Conversation</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Have questions? Want to partner with us? Our team responds within 24 hours.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Form + Contact */}
      <section className="section-padding pt-12">
        <div className="container-narrow mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <SectionReveal>
              <div className="glass-card p-8">
                <h2 className="font-heading font-bold text-xl mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Full Name *</label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Inquiry Type *</label>
                    <select
                      required
                      value={form.type}
                      onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    >
                      <option value="">Select type...</option>
                      {inquiryTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Subject *</label>
                    <input
                      required
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                      placeholder="Tell us more..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </SectionReveal>

            <div className="space-y-4">
              <SectionReveal delay={0.1}>
                <h2 className="font-heading font-bold text-xl mb-6">Contact Channels</h2>
              </SectionReveal>
              {contactChannels.map((c, i) => (
                <SectionReveal key={i} delay={0.15 + i * 0.1}>
                  <a
                    href={`mailto:${c.email}`}
                    className="glass-card-hover p-5 flex gap-4 items-start block"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <c.icon className="text-primary" size={18} />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-sm mb-0.5">{c.title}</h3>
                      <p className="text-xs text-muted-foreground mb-1">{c.desc}</p>
                      <span className="text-xs text-primary font-medium">{c.email}</span>
                    </div>
                  </a>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="section-padding bg-card/30">
        <div className="container-narrow mx-auto px-4 md:px-6 text-center">
          <SectionReveal>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Connect With Us</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-4">Join Our Community</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Stay updated with the latest news, participate in discussions, and be part of the Courtesy Chain movement.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: "Twitter / X", url: "https://x.com/CourtesyChain" },
                { label: "Telegram", url: "https://t.me/CourtesyChain" },
                { label: "Discord", url: "#" },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card/50 backdrop-blur-sm text-sm font-medium text-foreground hover:bg-card hover:border-primary/30 transition-colors"
                >
                  <MessageSquare size={14} className="text-primary" />
                  {s.label}
                </a>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
};

export default Contact;
