import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import logo from "@/assets/logo.png";
import logoBlack from "@/assets/logo_black.png";

type PreloaderProps = {
  active: boolean;
  onDone: () => void;
};

const PRELOADER_VISIBLE_MS = 3200;
const PRELOADER_FADE_MS = 450;

const Preloader = ({ active, onDone }: PreloaderProps) => {
  const { theme } = useTheme();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!active) {
      setLeaving(false);
      return;
    }

    const showTimer = window.setTimeout(() => {
      setLeaving(true);
    }, PRELOADER_VISIBLE_MS);

    const doneTimer = window.setTimeout(() => {
      onDone();
    }, PRELOADER_VISIBLE_MS + PRELOADER_FADE_MS);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(doneTimer);
    };
  }, [active, onDone]);

  if (!active) return null;

  const brandLogo = theme === "light" ? logoBlack : logo;

  return (
    <div className={`cc-preloader ${leaving ? "is-leaving" : ""}`} aria-live="polite" aria-busy="true">
      <div className="cc-preloader__content">
        <img src={brandLogo} alt="Courtesy Chain" className="cc-preloader__logo" />
        <div className="cc-preloader__text">CourtesyChain Blockchain</div>
        <div className="cc-preloader__bar">
          <span className="cc-preloader__bar-fill" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
