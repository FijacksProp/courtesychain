import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import { useTheme } from "@/components/ThemeProvider";

const InvestorSimulation = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen section-padding pt-28 md:pt-36 transition-colors ${isDark ? "bg-[#040a0f] text-[#ecfff5]" : "bg-[#f5faf7] text-[#0b1e18]"}`}>
      <div className="container-narrow mx-auto px-4 md:px-6">
        <SectionReveal>
          <div className={`rounded-2xl border p-8 md:p-10 ${isDark ? "border-[#00ff88]/20 bg-[#071118]/90" : "border-[#00a866]/25 bg-[#ffffff]/90"}`}>
            <Link
              to="/investors"
              className="inline-flex items-center gap-2 text-sm text-[#f5a623] hover:text-[#ffd590] transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Investor Portal
            </Link>

            <h1 className="mt-6 text-3xl md:text-5xl [font-family:'Orbitron',sans-serif]">AIVL Live Simulation</h1>
            <p className={`mt-4 max-w-3xl ${isDark ? "text-[#c8e6d7]" : "text-[#365c4f]"}`}>
              This section is reserved for the live AI Verification Layer simulation environment. Integrate telemetry playback, AI
              sanitization traces, and on-chain validation outputs in this module.
            </p>

            <div className={`mt-8 rounded-xl border p-6 text-sm ${isDark ? "border-[#f5a623]/30 bg-[#0b1821] text-[#b7d7c7]" : "border-[#d88d14]/35 bg-[#fff8eb] text-[#6d4b17]"}`}>
              Placeholder ready. Next phase can wire real-time mock telemetry and scoring visualization.
            </div>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
};

export default InvestorSimulation;
