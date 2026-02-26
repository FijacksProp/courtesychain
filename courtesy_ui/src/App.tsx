import { useCallback, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ParticlesBackground from "@/components/ParticlesBackground";
import ScrollToTop from "@/components/ScrollToTop";
import Preloader from "@/components/Preloader";
import Index from "./pages/Index";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Whitepaper from "./pages/Whitepaper";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const PRELOADER_COOLDOWN_MS = 1000 * 60 * 60 * 1;
const PRELOADER_KEY = "cc-preloader-last-shown";

const shouldShowPreloader = () => {
  if (typeof window === "undefined") return false;

  const lastShownRaw = window.localStorage.getItem(PRELOADER_KEY);
  if (!lastShownRaw) return true;

  const lastShown = Number(lastShownRaw);
  if (!Number.isFinite(lastShown)) return true;

  return Date.now() - lastShown > PRELOADER_COOLDOWN_MS;
};

const App = () => {
  const [showPreloader, setShowPreloader] = useState(shouldShowPreloader);

  const handlePreloaderDone = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PRELOADER_KEY, String(Date.now()));
    }
    setShowPreloader(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Preloader active={showPreloader} onDone={handlePreloaderDone} />
          <BrowserRouter>
            <ScrollToTop />
            <ParticlesBackground />
            <Navbar />
            <main className="relative z-10 pt-16">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/whitepaper" element={<Whitepaper />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
