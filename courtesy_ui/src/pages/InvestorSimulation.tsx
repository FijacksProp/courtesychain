import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";

const InvestorSimulation = () => {
  return (
    <div className="min-h-screen bg-[#040a0f] text-[#ecfff5] section-padding pt-28 md:pt-36">
      <div className="container-narrow mx-auto px-4 md:px-6">
        <SectionReveal>
          <div className="rounded-2xl border border-[#00ff88]/20 bg-[#071118]/90 p-8 md:p-10">
            <Link
              to="/investors"
              className="inline-flex items-center gap-2 text-sm text-[#f5a623] hover:text-[#ffd590] transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Investor Portal
            </Link>

            <h1 className="mt-6 text-3xl md:text-5xl [font-family:'Orbitron',sans-serif]">AIVL Live Simulation</h1>
            <p className="mt-4 text-[#c8e6d7] max-w-3xl">
              This section is reserved for the live AI Verification Layer simulation environment. Integrate telemetry playback, AI
              sanitization traces, and on-chain validation outputs in this module.
            </p>

            <div className="mt-8 rounded-xl border border-[#f5a623]/30 bg-[#0b1821] p-6 text-sm text-[#b7d7c7]">
              Placeholder ready. Next phase can wire real-time mock telemetry and scoring visualization.
            </div>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
};

export default InvestorSimulation;
