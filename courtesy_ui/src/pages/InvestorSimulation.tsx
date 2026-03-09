import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Navigation, XCircle } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import { useTheme } from "@/components/ThemeProvider";

/* ─────────────────────────── types ─────────────────────────── */
type RoutePoint = { x: number; y: number };
type Neighborhood = { name: string; x: number; y: number };
type SimEvent = {
  id: string;
  action: string;
  points: number;
  multiplierLabel: string;
  multiplierValue: number;
  isNegative: boolean;
  progressAt: number;
  shownAtSec: number;
  clockLabel: string;
};
type PlannedEvent = Omit<SimEvent, "shownAtSec" | "clockLabel">;
type Trip = {
  id: number;
  origin: Neighborhood;
  destination: Neighborhood;
  startMinutes: number;
  durationMinutes: number;
  finalScore: number;
  finalConfidence: number;
  events: PlannedEvent[];
  points: RoutePoint[];
  simDurationMs: number;
};

/* ─────────────────────────── constants ─────────────────────── */

// Miami neighborhoods mapped to a 200×260 SVG viewBox
// (wider coords = thicker-looking strokes at real pixel sizes)
const NEIGHBORHOODS: Neighborhood[] = [
  { name: "Aventura",      x: 158, y:  34 },
  { name: "Hialeah",       x:  52, y:  72 },
  { name: "Wynwood",       x:  92, y:  88 },
  { name: "Downtown",      x: 110, y: 104 },
  { name: "Brickell",      x: 110, y: 124 },
  { name: "Miami Beach",   x: 148, y: 104 },
  { name: "Little Havana", x:  84, y: 132 },
  { name: "Coral Gables",  x:  88, y: 164 },
  { name: "Doral",         x:  38, y: 142 },
  { name: "Kendall",       x:  98, y: 224 },
  { name: "Coconut Grove", x: 108, y: 172 },
  { name: "Edgewater",     x: 106, y:  78 },
];

const POSD_ACTIONS = [
  { action: "Yielding safely",         points: 10, multiplierLabel: "1.2x", multiplierValue: 1.2, isNegative: false, weight: 18 },
  { action: "Smooth braking",          points:  8, multiplierLabel: "1.1x", multiplierValue: 1.1, isNegative: false, weight: 16 },
  { action: "Obeying speed limits",    points:  5, multiplierLabel: "1.0x", multiplierValue: 1.0, isNegative: false, weight: 14 },
  { action: "Safe Distance Maintained",points:  9, multiplierLabel: "1.1x", multiplierValue: 1.1, isNegative: false, weight: 14 },
  { action: "Smooth Acceleration",     points:  7, multiplierLabel: "1.1x", multiplierValue: 1.1, isNegative: false, weight: 12 },
  { action: "Smooth Lane Merge",       points:  6, multiplierLabel: "1.0x", multiplierValue: 1.0, isNegative: false, weight: 10 },
  { action: "Intersection Courtesy",   points:  9, multiplierLabel: "1.1x", multiplierValue: 1.1, isNegative: false, weight: 10 },
  { action: "Safe Following Distance", points:  8, multiplierLabel: "1.1x", multiplierValue: 1.1, isNegative: false, weight: 10 },
  { action: "Smooth Cornering",        points:  6, multiplierLabel: "1.0x", multiplierValue: 1.0, isNegative: false, weight:  8 },
  { action: "Hard braking / cutoff",   points:  0, multiplierLabel: "0x",   multiplierValue:   0, isNegative: true,  weight:  4 },
  { action: "Repeated aggression",     points:-10, multiplierLabel: "Penalty", multiplierValue: 1, isNegative: true, weight:  3 },
] as const;

/* ─────────────────────────── helpers ───────────────────────── */
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const rf    = (min: number, max: number) => min + Math.random() * (max - min);
const ri    = (min: number, max: number) => Math.floor(rf(min, max + 1));

const toClock = (minutes: number) => {
  const n   = ((minutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(n / 60);
  const m   = Math.floor(n % 60);
  const suf = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suf}`;
};

const weightedRandom = (min: number, max: number) => {
  const r = (Math.random() + Math.random() + Math.random()) / 3;
  return min + r * (max - min);
};

const pickOriginDestination = () => {
  const oi = ri(0, NEIGHBORHOODS.length - 1);
  let di   = ri(0, NEIGHBORHOODS.length - 1);
  while (di === oi) di = ri(0, NEIGHBORHOODS.length - 1);
  return { origin: NEIGHBORHOODS[oi], destination: NEIGHBORHOODS[di] };
};

const pickAction = () => {
  const total  = POSD_ACTIONS.reduce((s, a) => s + a.weight, 0);
  let cursor   = rf(0, total);
  for (const a of POSD_ACTIONS) { cursor -= a.weight; if (cursor <= 0) return a; }
  return POSD_ACTIONS[0];
};

/* Catmull-Rom spline interpolation */
const cr = (p0: RoutePoint, p1: RoutePoint, p2: RoutePoint, p3: RoutePoint, t: number): RoutePoint => {
  const t2 = t * t, t3 = t2 * t;
  return {
    x: 0.5 * ((2*p1.x) + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
    y: 0.5 * ((2*p1.y) + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*t3),
  };
};

const buildRoute = (origin: Neighborhood, destination: Neighborhood): RoutePoint[] => {
  const n = ri(4, 6);
  const wps: RoutePoint[] = [{ x: origin.x, y: origin.y }];
  for (let i = 0; i < n; i++) {
    const t = (i + 1) / (n + 1);
    wps.push({
      x: clamp(origin.x + (destination.x - origin.x) * t + rf(-18, 18), 12, 188),
      y: clamp(origin.y + (destination.y - origin.y) * t + rf(-20, 20), 14, 246),
    });
  }
  wps.push({ x: destination.x, y: destination.y });
  const pad = [wps[0], ...wps, wps[wps.length - 1]];
  const pts: RoutePoint[] = [];
  for (let i = 0; i < pad.length - 3; i++) {
    for (let t = 0; t <= 1; t += 0.025) pts.push(cr(pad[i], pad[i+1], pad[i+2], pad[i+3], t));
  }
  return pts;
};

const buildPlannedEvents = (tripId: number, count: number): PlannedEvent[] => {
  const evs: PlannedEvent[] = [];
  for (let i = 0; i < count; i++) {
    const base   = (i + 1) / (count + 1);
    const chosen = pickAction();
    evs.push({
      id:              `${tripId}-ev-${i}`,
      action:          chosen.action,
      points:          chosen.points,
      multiplierLabel: chosen.multiplierLabel,
      multiplierValue: chosen.multiplierValue,
      isNegative:      chosen.isNegative,
      progressAt:      clamp(base + rf(-0.04, 0.04), 0.06, 0.96),
    });
  }
  return evs.sort((a, b) => a.progressAt - b.progressAt);
};

const buildSpeedProfile = () => {
  const profile: Array<{ p: number; speed: number }> = [];
  let speed = rf(30, 40);
  for (let i = 0; i <= 40; i++) {
    const p = i / 40;
    speed   = clamp(speed + rf(-5, 5) + Math.sin(p * Math.PI * 2 / rf(1.6, 2.5)) * 2.5, 25, 70);
    profile.push({ p, speed });
  }
  return profile;
};

const interpSpeed = (profile: Array<{ p: number; speed: number }>, progress: number) => {
  for (let i = 1; i < profile.length; i++) {
    if (progress <= profile[i].p) {
      const prev = profile[i - 1], next = profile[i];
      const t    = (progress - prev.p) / (next.p - prev.p || 1);
      return prev.speed + (next.speed - prev.speed) * t;
    }
  }
  return profile[profile.length - 1].speed;
};

const createTrip = (id: number): Trip => {
  const { origin, destination } = pickOriginDestination();
  const dur = ri(10, 25);
  return {
    id,
    origin,
    destination,
    startMinutes:    ri(6 * 60, 21 * 60),
    durationMinutes: dur,
    finalScore:      Math.round(weightedRandom(91, 99)),
    finalConfidence: Number(weightedRandom(97.1, 99.8).toFixed(1)),
    events:          buildPlannedEvents(id, ri(5, 15)),
    points:          buildRoute(origin, destination),
    simDurationMs:   dur * 60 * ri(120, 150),
  };
};

/* ═══════════════════════ COMPONENT ═════════════════════════ */
const InvestorSimulation = () => {
  const { theme }  = useTheme();
  const isDark     = theme === "dark";
  const navigate   = useNavigate();

  const [loadingAuth, setLoadingAuth] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

  const [trip,          setTrip]          = useState<Trip>(() => createTrip(Date.now()));
  const [progress,      setProgress]      = useState(0);
  const [visibleEvents, setVisibleEvents] = useState<SimEvent[]>([]);
  const [status,        setStatus]        = useState<"running" | "cooldown">("running");
  const [simElapsedSec, setSimElapsedSec] = useState(0);
  const [tripCounter,   setTripCounter]   = useState(1);
  const [speedProfile,  setSpeedProfile]  = useState(() => buildSpeedProfile());

  const rafRef      = useRef<number | null>(null);
  const cooldownRef = useRef<number | null>(null);
  const startedRef  = useRef<number>(0);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/investors/session/`, { credentials: "include" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.authenticated) {
          if (data?.email) {
            window.localStorage.setItem("cc_investor_email", data.email);
          }
          navigate("/investors/access");
          return;
        }
      } catch {
        navigate("/investors/access");
        return;
      } finally {
        setLoadingAuth(false);
      }
    };

    checkSession();
  }, [apiBaseUrl, navigate]);

  /* derived positions */
  const completedIndex = useMemo(
    () => clamp(Math.floor(progress * (trip.points.length - 1)), 0, trip.points.length - 1),
    [progress, trip.points.length],
  );
  const completedPoints = useMemo(
    () => trip.points.slice(0, Math.max(2, completedIndex + 1)),
    [trip.points, completedIndex],
  );
  const car     = trip.points[completedIndex];
  const carNext = trip.points[Math.min(completedIndex + 1, trip.points.length - 1)];
  const carAngle = Math.atan2(carNext.y - car.y, carNext.x - car.x) * (180 / Math.PI);

  /* live metrics */
  const scoreNow = useMemo(() => {
    const base  = 88 + progress * (trip.finalScore - 88);
    const bonus = (visibleEvents.length / Math.max(1, trip.events.length)) * 1.5;
    return Math.min(trip.finalScore, Number((base + bonus).toFixed(1)));
  }, [progress, trip.finalScore, trip.events.length, visibleEvents.length]);

  const confidenceNow = useMemo(() => {
    const base  = 96.7 + progress * (trip.finalConfidence - 96.7);
    const bonus = visibleEvents.length > 0 ? 0.2 : 0;
    return Math.min(trip.finalConfidence, Number((base + bonus).toFixed(1)));
  }, [progress, trip.finalConfidence, visibleEvents.length]);

  const speedMph = useMemo(() => {
    const baseline = interpSpeed(speedProfile, progress);
    const nearInt  = trip.events.some(
      (e) => (e.action === "Intersection Courtesy" || e.action === "Yielding safely") && Math.abs(e.progressAt - progress) < 0.05,
    );
    return Math.round(clamp(baseline - (nearInt ? rf(3, 7) : 0), 25, 70));
  }, [progress, speedProfile, trip.events]);

  const rewardTotal = useMemo(
    () => visibleEvents.reduce((s, e) => s + (e.points < 0 ? e.points : e.points * e.multiplierValue), 0),
    [visibleEvents],
  );

  /* animation loop */
  useEffect(() => {
    if (loadingAuth) return;

    startedRef.current = performance.now();
    setStatus("running");
    setProgress(0);
    setSimElapsedSec(0);
    setVisibleEvents([]);
    setSpeedProfile(buildSpeedProfile());

    const frame = (now: number) => {
      const elapsed = now - startedRef.current;
      const p       = clamp(elapsed / trip.simDurationMs, 0, 1);
      setProgress(p);
      setSimElapsedSec(Math.floor(p * trip.durationMinutes * 60));

      setVisibleEvents((prev) => {
        const seen = new Set(prev.map((e) => e.id));
        const adds: SimEvent[] = [];
        trip.events.forEach((e) => {
          if (!seen.has(e.id) && p >= e.progressAt) {
            const sec = Math.floor(e.progressAt * trip.durationMinutes * 60);
            adds.push({ ...e, shownAtSec: sec, clockLabel: toClock(trip.startMinutes + sec / 60) });
          }
        });
        if (!adds.length) return prev;
        return [...prev, ...adds].sort((a, b) => a.shownAtSec - b.shownAtSec).slice(-12);
      });

      if (p >= 1) {
        setStatus("cooldown");
        cooldownRef.current = window.setTimeout(() => {
          setTripCounter((x) => x + 1);
          setTrip(createTrip(Date.now()));
        }, ri(3000, 4000));
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current)  cancelAnimationFrame(rafRef.current);
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, [loadingAuth, trip.id, trip.durationMinutes, trip.events, trip.simDurationMs, trip.startMinutes]);

  /* SVG path strings */
  const toPath = (pts: RoutePoint[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const fullPath      = toPath(trip.points);
  const completedPath = toPath(completedPoints);

  const elapsed = `${Math.floor(simElapsedSec / 60)}:${String(simElapsedSec % 60).padStart(2, "0")}`;
  const target  = `${trip.durationMinutes}:00`;

  if (loadingAuth) {
    return <div className="section-padding pt-28 md:pt-36 text-center text-muted-foreground">Authorizing simulation access...</div>;
  }

  /* ── map colour tokens ── */
  const mapBg      = isDark ? "#06111a" : "#dff0e8";
  const landFill   = isDark ? "#0d1f2b" : "#c8e6d4";
  const blockFill  = isDark ? "#112233" : "#b8d9c4";
  const waterFill  = isDark ? "#081622" : "#a8d4e8";
  const roadStroke = isDark ? "rgba(0,255,136,0.18)" : "rgba(0,120,80,0.25)";
  const labelFill  = isDark ? "#5d9e88"              : "#2a6b55";
  const dotFill    = isDark ? "#3a7a68"              : "#2a6b55";

  return (
    <div
      className={`min-h-screen pt-24 md:pt-28 pb-12 transition-colors ${
        isDark ? "bg-[#040a0f] text-[#ecfff5]" : "bg-[#f5faf7] text-[#0b1e18]"
      }`}
    >
      <div className="w-full px-4 md:px-8 xl:px-12">
        <SectionReveal>
          <div
            className={`rounded-2xl border p-5 md:p-8 w-full ${
              isDark ? "border-[#00ff88]/20 bg-[#071118]/90" : "border-[#00a866]/25 bg-white/90"
            }`}
          >
            {/* back link */}
            <Link
              to="/investors"
              className="inline-flex items-center gap-2 text-sm text-[#f5a623] hover:text-[#ffd590] transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Investor Portal
            </Link>

            {/* heading */}
            <h1 className="mt-4 text-2xl md:text-4xl [font-family:'Orbitron',sans-serif]">
              AIVL Verification Feed
            </h1>
            <p className={`mt-2 text-sm md:text-base ${isDark ? "text-[#c8e6d7]" : "text-[#365c4f]"}`}>
              Live randomised route simulation — behavioural verification events, moving vehicle
              telemetry and synchronised scoring.
            </p>

            <div className="mt-6 grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[minmax(460px,560px)_1fr] gap-6 items-start">

              {/* ── PHONE / MAP COLUMN ── */}
              <div className="w-full">
                {/* phone outer bezel */}
                <div
                  className={`rounded-[2.4rem] p-[10px] border shadow-2xl w-full ${
                    isDark
                      ? "bg-[#0a151d] border-[#00ff88]/25 shadow-[0_0_60px_rgba(0,255,136,0.08)]"
                      : "bg-[#edf7f2] border-[#00a866]/30"
                  }`}
                >
                  {/* phone screen */}
                  <div
                    className={`rounded-[2rem] overflow-hidden border ${
                      isDark ? "border-[#1d2e39] bg-[#061018]" : "border-[#c9e6d8] bg-[#f7fffb]"
                    }`}
                  >
                    {/* status bar */}
                    <div
                      className={`px-5 py-2 flex items-center justify-between text-[10px] border-b ${
                        isDark ? "border-[#1e323e] bg-[#08131a] text-[#4a7a68]" : "border-[#d6ece1] bg-[#eef9f3] text-[#3a6a58]"
                      }`}
                    >
                      <span className="[font-family:'Orbitron',sans-serif] text-[9px] tracking-widest text-[#00ff88]">
                        TRIP {tripCounter}
                      </span>
                      <div className="flex items-center gap-1">
                        <span>{trip.origin.name}</span>
                        <Navigation size={10} className="text-[#f5a623]" />
                        <span>{trip.destination.name}</span>
                      </div>
                      <span className={status === "running" ? "text-[#00ff88]" : "text-[#f5a623]"}>
                        {status === "running" ? "● LIVE" : "✓ DONE"}
                      </span>
                    </div>

                    {/* ── MAP CONTAINER ── */}
                    <div className="relative" style={{ height: "clamp(380px, 55vw, 620px)" }}>

                      {/* ── SVG MAP ── */}
                      <svg
                        viewBox="0 0 200 260"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
                      >
                        <defs>
                          {/* green glow filter for route */}
                          <filter id="glow-route" x="-40%" y="-40%" width="180%" height="180%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                          {/* subtle glow for car */}
                          <filter id="glow-car" x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                          {/* radial gradient for car halo */}
                          <radialGradient id="carHalo" cx="50%" cy="50%" r="50%">
                            <stop offset="0%"   stopColor="#00ff88" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#00ff88" stopOpacity="0"   />
                          </radialGradient>
                          {/* gradient for completed route */}
                          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor="#00ff88" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#00ff88" stopOpacity="1"   />
                          </linearGradient>
                          {/* water shimmer */}
                          <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor={isDark ? "#081e2e" : "#b8ddf0"} />
                            <stop offset="100%" stopColor={isDark ? "#0d2a3e" : "#9dcce8"} />
                          </linearGradient>
                        </defs>

                        {/* ── Base map background ── */}
                        <rect x="0" y="0" width="200" height="260" fill={mapBg} />

                        {/* ── Land mass (Miami peninsula shape) ── */}
                        <path
                          d="M0,0 H140 L134,50 L138,100 L128,150 L132,200 L120,260 H0 Z"
                          fill={landFill}
                        />

                        {/* ── Water (Biscayne Bay east side) ── */}
                        <path
                          d="M148,0 L200,0 L200,260 L158,260 L145,200 L152,148 L142,100 L150,50 Z"
                          fill="url(#waterGrad)"
                          opacity="0.9"
                        />

                        {/* Water shimmer lines */}
                        {[20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240].map((y) => (
                          <line
                            key={y}
                            x1="148" y1={y} x2="200" y2={y}
                            stroke={isDark ? "rgba(0,180,255,0.06)" : "rgba(100,200,255,0.2)"}
                            strokeWidth="0.8"
                          />
                        ))}

                        {/* ── City blocks ── */}
                        {[
                          [16, 22, 28, 18], [54, 22, 24, 16], [88, 18, 30, 14], [126, 24, 18, 12],
                          [20, 50, 22, 20], [52, 48, 32, 18], [94, 44, 26, 16], [124, 52, 14, 10],
                          [18, 80, 20, 22], [48, 76, 28, 20], [84, 72, 24, 18], [118, 82, 16, 12],
                          [16, 112, 18, 20],[50, 108, 26, 22],[86, 106, 22, 16],[112, 114, 14, 10],
                          [14, 144, 16, 22],[40, 142, 24, 20],[80, 140, 20, 18],[108, 148, 12, 10],
                          [16, 176, 18, 20],[48, 174, 22, 18],[82, 172, 20, 16],
                          [14, 210, 16, 18],[46, 208, 20, 16],[80, 206, 18, 14],
                          [14, 240, 14, 16],[44, 238, 18, 14],
                        ].map(([x, y, w, h], i) => (
                          <rect key={i} x={x} y={y} width={w} height={h} rx="1.5" fill={blockFill} opacity="0.7" />
                        ))}

                        {/* ── Road network ── */}
                        {/* Horizontal roads */}
                        {[30, 60, 90, 118, 148, 176, 208, 238].map((y) => (
                          <line key={`h${y}`} x1="0" y1={y} x2="148" y2={y}
                            stroke={roadStroke} strokeWidth="1.8" />
                        ))}
                        {/* Vertical roads */}
                        {[28, 56, 86, 114, 138].map((x) => (
                          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="260"
                            stroke={roadStroke} strokeWidth="1.8" />
                        ))}
                        {/* Diagonal roads (gives Miami feel) */}
                        <line x1="0"   y1="60"  x2="60"  y2="0"   stroke={roadStroke} strokeWidth="1.4" />
                        <line x1="0"   y1="120" x2="80"  y2="40"  stroke={roadStroke} strokeWidth="1.2" />
                        <line x1="20"  y1="200" x2="100" y2="120" stroke={roadStroke} strokeWidth="1.2" />
                        <line x1="40"  y1="260" x2="130" y2="170" stroke={roadStroke} strokeWidth="1.2" />

                        {/* ── Neighbourhood dots & labels ── */}
                        {NEIGHBORHOODS.map((n) => (
                          <g key={n.name}>
                            <circle cx={n.x} cy={n.y} r="3" fill={dotFill} opacity="0.9" />
                            <circle cx={n.x} cy={n.y} r="1.4" fill={isDark ? "#8ecfb8" : "#1a5a44"} />
                            <text
                              x={n.x + 4.5} y={n.y + 1.5}
                              fontSize="5.5"
                              fill={labelFill}
                              fontFamily="'Orbitron', sans-serif"
                              letterSpacing="0.3"
                            >
                              {n.name}
                            </text>
                          </g>
                        ))}

                        {/* ── Ghost (full) route ── */}
                        <path
                          d={fullPath}
                          fill="none"
                          stroke={isDark ? "rgba(0,255,136,0.15)" : "rgba(0,150,80,0.2)"}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="6 4"
                        />

                        {/* ── Completed (glowing) route ── */}
                        {/* outer glow pass */}
                        <path
                          d={completedPath}
                          fill="none"
                          stroke="rgba(0,255,136,0.25)"
                          strokeWidth="9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* core bright line */}
                        <path
                          d={completedPath}
                          fill="none"
                          stroke="url(#routeGrad)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#glow-route)"
                        />

                        {/* ── Origin pin ── */}
                        <circle cx={trip.points[0].x} cy={trip.points[0].y} r="5" fill="rgba(245,166,35,0.2)" />
                        <circle cx={trip.points[0].x} cy={trip.points[0].y} r="3" fill="#f5a623" />
                        <circle cx={trip.points[0].x} cy={trip.points[0].y} r="1.5" fill="#fff" />

                        {/* ── Destination pin ── */}
                        <circle cx={trip.points[trip.points.length-1].x} cy={trip.points[trip.points.length-1].y} r="6" fill="rgba(0,255,136,0.2)" />
                        <circle cx={trip.points[trip.points.length-1].x} cy={trip.points[trip.points.length-1].y} r="3.5" fill="#00ff88" />
                        <text
                          x={trip.points[trip.points.length-1].x}
                          y={trip.points[trip.points.length-1].y + 1.2}
                          textAnchor="middle"
                          fontSize="4"
                          fill="#000"
                          fontWeight="bold"
                        >★</text>

                        {/* ── Event checkpoint pins ── */}
                        {visibleEvents.map((ev) => {
                          const idx = clamp(Math.floor(ev.progressAt * (trip.points.length - 1)), 0, trip.points.length - 1);
                          const pt  = trip.points[idx];
                          return (
                            <g key={ev.id}>
                              <circle cx={pt.x} cy={pt.y} r="5.5"
                                fill={ev.isNegative ? "rgba(255,60,60,0.2)" : "rgba(0,255,136,0.18)"}
                                stroke={ev.isNegative ? "#ff4444" : "#00ff88"}
                                strokeWidth="1.2"
                              />
                              <text x={pt.x} y={pt.y + 2} textAnchor="middle"
                                fontSize="5" fill={ev.isNegative ? "#ff6666" : "#00ff88"} fontWeight="bold">
                                {ev.isNegative ? "✕" : "✓"}
                              </text>
                            </g>
                          );
                        })}

                        {/* ── Car ── */}
                        <g transform={`translate(${car.x.toFixed(2)},${car.y.toFixed(2)}) rotate(${carAngle.toFixed(2)})`}
                          filter="url(#glow-car)">
                          {/* halo */}
                          <circle r="12" fill="url(#carHalo)" />
                          {/* body */}
                          <rect x="-7" y="-4" width="14" height="8" rx="2.5"
                            fill={isDark ? "#d8fff0" : "#0f2d21"}
                            stroke="#00ff88" strokeWidth="1.2"
                          />
                          {/* cabin */}
                          <rect x="-4" y="-6.5" width="8" height="5.5" rx="1.8"
                            fill={isDark ? "#a0d8c0" : "#1a4d38"}
                            stroke="#00ff88" strokeWidth="0.8"
                          />
                          {/* headlights */}
                          <circle cx="7"  cy="-2" r="1.8" fill="#00ff88" opacity="0.95" />
                          <circle cx="7"  cy="2"  r="1.8" fill="#00ff88" opacity="0.95" />
                          {/* light beam */}
                          <path d="M8.5,-2 L14,-3.5 L14,-0.5 Z" fill="rgba(0,255,136,0.3)" />
                          <path d="M8.5, 2 L14, 0.5 L14, 3.5 Z" fill="rgba(0,255,136,0.3)" />
                          {/* tail lights */}
                          <circle cx="-7" cy="-2" r="1.4" fill="#f5a623" opacity="0.8" />
                          <circle cx="-7" cy="2"  r="1.4" fill="#f5a623" opacity="0.8" />
                          {/* wheels */}
                          <rect x="-5" y="-5.5" width="4" height="2" rx="1" fill="#1a2a22" stroke="rgba(0,255,136,0.4)" strokeWidth="0.5"/>
                          <rect x="-5" y=" 3.5" width="4" height="2" rx="1" fill="#1a2a22" stroke="rgba(0,255,136,0.4)" strokeWidth="0.5"/>
                          <rect x=" 2" y="-5.5" width="4" height="2" rx="1" fill="#1a2a22" stroke="rgba(0,255,136,0.4)" strokeWidth="0.5"/>
                          <rect x=" 2" y=" 3.5" width="4" height="2" rx="1" fill="#1a2a22" stroke="rgba(0,255,136,0.4)" strokeWidth="0.5"/>
                        </g>
                      </svg>

                      {/* ── HUD overlays ── */}
                      {/* Speed + time strip at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2"
                        style={{ background: isDark ? "rgba(4,10,15,0.82)" : "rgba(240,255,248,0.88)" }}>
                        <span className={`text-[10px] [font-family:'Orbitron',sans-serif] ${isDark ? "text-[#00ff88]" : "text-[#00804a]"}`}>
                          {speedMph} <span className="text-[8px] opacity-60">MPH</span>
                        </span>
                        <div className="flex gap-1 items-center">
                          {/* progress bar */}
                          <div className={`w-24 h-1 rounded-full overflow-hidden ${isDark ? "bg-[#1a3028]" : "bg-[#c0e0d0]"}`}>
                            <div
                              className="h-full rounded-full bg-[#00ff88] transition-all duration-300"
                              style={{ width: `${(progress * 100).toFixed(1)}%` }}
                            />
                          </div>
                          <span className={`text-[9px] ${isDark ? "text-[#5a8878]" : "text-[#3a6858]"}`}>
                            {elapsed}/{target}
                          </span>
                        </div>
                        <span className={`text-[10px] [font-family:'Orbitron',sans-serif] ${isDark ? "text-[#f5a623]" : "text-[#b87010]"}`}>
                          {scoreNow.toFixed(0)}
                          <span className="text-[8px] opacity-60"> pts</span>
                        </span>
                      </div>
                    </div>
                    {/* end map container */}

                  </div>
                  {/* end phone screen */}
                </div>
                {/* end phone bezel */}
              </div>
              {/* end map column */}

              {/* ── STATS COLUMN ── */}
              <div className="space-y-4 flex flex-col h-full">

                {/* metric cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  <div className={`min-w-0 rounded-xl border p-3 md:p-4 ${isDark ? "border-[#00ff88]/20 bg-[#0b1821]" : "border-[#00a866]/20 bg-[#f4fff9]"}`}>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#00ff88]">Trip Score</p>
                    <p className="mt-2 leading-tight whitespace-nowrap text-[clamp(1rem,4.5vw,1.9rem)] [font-family:'Orbitron',sans-serif]">
                      {scoreNow.toFixed(1)}
                    </p>
                  </div>
                  <div className={`min-w-0 rounded-xl border p-3 md:p-4 ${isDark ? "border-[#f5a623]/30 bg-[#0f1821]" : "border-[#d88d14]/30 bg-[#fff8eb]"}`}>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#f5a623]">AI Confidence</p>
                    <p className="mt-2 leading-tight whitespace-nowrap text-[clamp(1rem,4.5vw,1.9rem)] [font-family:'Orbitron',sans-serif]">
                      {confidenceNow.toFixed(1)}%
                    </p>
                  </div>
                  <div className={`min-w-0 rounded-xl border p-3 md:p-4 ${isDark ? "border-[#2b4453] bg-[#0a141b]" : "border-[#c7dde1] bg-[#eef7f9]"}`}>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#8eb2c0]">Verified Events</p>
                    <p className="mt-2 leading-tight whitespace-nowrap text-[clamp(1rem,4.5vw,1.9rem)] [font-family:'Orbitron',sans-serif]">
                      {visibleEvents.length}/{trip.events.length}
                    </p>
                  </div>
                </div>

                {/* reward total */}
                <div className={`min-w-0 rounded-xl border p-3 md:p-4 ${isDark ? "border-[#00ff88]/25 bg-[#071722]" : "border-[#00a866]/28 bg-[#eafaf2]"}`}>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#00ff88]">Reward Total</p>
                  <p className={`mt-1 leading-tight whitespace-nowrap text-[clamp(1rem,4.6vw,1.6rem)] [font-family:'Orbitron',sans-serif] ${rewardTotal < 0 ? "text-red-400" : "text-[#00ff88]"}`}>
                    {rewardTotal >= 0 ? "+" : ""}{rewardTotal.toFixed(1)} pts
                  </p>
                </div>

                {/* live feed — scrollable after 4 items */}
                <div className={`rounded-xl border p-4 flex flex-col flex-1 min-h-0 ${isDark ? "border-[#1e323f] bg-[#08141d]" : "border-[#d6e8dd] bg-[#f8fffb]"}`}>
                  <div className="flex items-center justify-between mb-3 shrink-0">
                    <h3 className="text-sm [font-family:'Orbitron',sans-serif]">Live Verification Feed</h3>
                    <span className={`text-xs font-mono ${status === "running" ? "text-[#00ff88]" : "text-[#f5a623]"}`}>
                      {status === "running" ? "● Analysing" : "✓ Trip Complete"}
                    </span>
                  </div>

                  {/* fixed height = ~4 cards, then scroll */}
                  <div
                    className="space-y-2 overflow-y-auto pr-1"
                    style={{ maxHeight: "calc(4 * 80px)", scrollbarWidth: "thin", scrollbarColor: isDark ? "#1e3a2a transparent" : "#b0d8c0 transparent" }}
                  >
                    {visibleEvents.length === 0 && (
                      <p className={`text-xs ${isDark ? "text-[#7fa596]" : "text-[#5b7e6f]"}`}>
                        Awaiting first verified signal…
                      </p>
                    )}
                    {visibleEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className={`rounded-lg border px-3 py-2 transition-all shrink-0 ${
                          ev.isNegative
                            ? isDark ? "border-red-900/50 bg-red-950/30" : "border-red-300/50 bg-red-50"
                            : isDark ? "border-[#1f3643] bg-[#0b1a24]"  : "border-[#cfe3d8] bg-[#f3fcf7]"
                        }`}
                        style={{ animation: "fadeIn 260ms ease-out" }}
                      >
                        <div className="flex items-start gap-2">
                          {ev.isNegative
                            ? <XCircle     size={15} className="text-red-400 mt-0.5 shrink-0" />
                            : <CheckCircle2 size={15} className="text-[#00ff88] mt-0.5 shrink-0" />
                          }
                          <div className="min-w-0">
                            <p className="text-sm leading-tight">{ev.action}</p>
                            <p className={`text-[11px] mt-0.5 ${ev.isNegative ? "text-red-400" : "text-[#f5a623]"}`}>
                              {ev.points >= 0 ? "+" : ""}{ev.points} pts · {ev.multiplierLabel}
                            </p>
                            <p className={`text-[11px] mt-1 ${isDark ? "text-[#86a79b]" : "text-[#5e8072]"}`}>
                              Verified at {ev.clockLabel}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              {/* end stats column */}

            </div>
          </div>
        </SectionReveal>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
};

export default InvestorSimulation;
