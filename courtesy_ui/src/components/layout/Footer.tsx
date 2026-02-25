import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import logoBlack from "@/assets/logo_black.png";
import { useTheme } from "../ThemeProvider";

const Footer = () => {
  const { theme } = useTheme();
  const brandLogo = theme === "light" ? logoBlack : logo;

  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container-narrow mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={brandLogo} alt="Courtesy Chain" className="h-8 w-8" />
              <span className="font-heading font-bold text-foreground">Courtesy Chain</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The world's first blockchain ecosystem transforming safe driving into measurable digital value.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4 text-sm">Navigate</h4>
            <div className="space-y-2.5">
              {[
                { label: "Home", path: "/" },
                { label: "About", path: "/about" },
                { label: "How It Works", path: "/how-it-works" },
                { label: "Whitepaper", path: "/whitepaper" },
                { label: "Contact", path: "/contact" },
              ].map((l) => (
                <Link key={l.path} to={l.path} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4 text-sm">Resources</h4>
            <div className="space-y-2.5">
              <Link to="/whitepaper" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Whitepaper</Link>
              <a href="https://dexscreener.com/solana/Ah3UfdotFeMgjYmWjVv7wtzRxu481qhgNWWsXgChpump" target="_blank" rel="noopener" className="block text-sm text-muted-foreground hover:text-primary transition-colors">DEXScreener</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</a>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4 text-sm">Contact</h4>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <a href="mailto:contact@courtesychain.io" className="block hover:text-primary transition-colors">contact@courtesychain.io</a>
              <a href="mailto:partnerships@courtesychain.io" className="block hover:text-primary transition-colors">partnerships@courtesychain.io</a>
              <a href="mailto:support@courtesychain.io" className="block hover:text-primary transition-colors">support@courtesychain.io</a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">Copyright 2025 Courtesy Chain. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Courtesy Pays. Drive Kind. Get Rewarded.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
