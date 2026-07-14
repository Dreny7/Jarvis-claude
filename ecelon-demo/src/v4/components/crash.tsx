import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { V4, rand } from "../theme";

const AMBER = "#E7C79A"; // warm archival white
const AMBER_DIM = "rgba(231,199,154,0.45)";

/** A plunging market line ("DOW JONES") drawing on, aged palette. */
export const CrashChart: React.FC<{ label?: string; seed?: number }> = ({
  label = "DOW JONES",
  seed = 4,
}) => {
  const frame = useCurrentFrame();
  const N = 60;
  const pts: { x: number; y: number }[] = [];
  let y = 120;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    // gentle up, then a hard cliff down
    const base = t < 0.4 ? 120 - t * 60 : 96 + (t - 0.4) * 900;
    y = Math.min(600, base + (rand(seed * 50 + i) - 0.5) * 46);
    pts.push({ x: 120 + t * 1680, y });
  }
  const draw = interpolate(frame, [4, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const len = 3400;
  const headIdx = Math.min(N - 1, Math.floor(draw * (N - 1)));
  const head = pts[headIdx];
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* gridlines */}
        {[300, 450, 600, 750].map((gy) => (
          <line key={gy} x1={120} y1={gy} x2={1800} y2={gy} stroke={AMBER_DIM} strokeWidth={1} opacity={0.25} />
        ))}
        {/* area under */}
        <path
          d={`${path} L${head.x},780 L120,780 Z`}
          fill="rgba(255,120,40,0.10)"
          opacity={draw}
          style={{ clipPath: `inset(0 ${(1 - draw) * 100}% 0 0)` }}
        />
        <path
          d={path}
          fill="none"
          stroke={AMBER}
          strokeWidth={4}
          strokeDasharray={len}
          strokeDashoffset={len * (1 - draw)}
          style={{ filter: "drop-shadow(0 0 6px rgba(255,150,80,0.4))" }}
        />
        {draw > 0.02 && draw < 0.99 && (
          <circle cx={head.x} cy={head.y} r={7} fill={V4.orange} />
        )}
      </svg>
      {/* real print: Sept 29, 2008 — Dow −777.68 (−6.98%), its worst point drop */}
      <div
        style={{
          position: "absolute",
          top: 132,
          left: 128,
          fontFamily: V4.mono,
          fontSize: 26,
          letterSpacing: 3,
          color: AMBER,
          backgroundColor: "rgba(5,4,3,0.6)",
          padding: "8px 14px",
        }}
      >
        {label}
        <span style={{ color: V4.orange, marginLeft: 20, fontWeight: 700 }}>
          ▼ {(-Math.min(777.68, 90 + draw * 687.68)).toFixed(2)} (−6.98%)
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 196,
          left: 142,
          fontFamily: V4.mono,
          fontSize: 20,
          letterSpacing: 2,
          color: AMBER_DIM,
        }}
      >
        S&amp;P 500 ▼ −8.79% · NASDAQ ▼ −9.14% · SEPT 29 2008
      </div>
    </AbsoluteFill>
  );
};

/** Two diverging lines: the market falls, one line rises — the fund's gain. */
export const DivergeChart: React.FC = () => {
  const frame = useCurrentFrame();
  const N = 50;
  const down: string[] = [];
  const up: string[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const dy = 380 + t * 300 + (rand(10 + i) - 0.5) * 30;
    const uy = 380 - t * 280 + (rand(90 + i) - 0.5) * 26;
    down.push(`${i === 0 ? "M" : "L"}${140 + t * 1640},${dy}`);
    up.push(`${i === 0 ? "M" : "L"}${140 + t * 1640},${uy}`);
  }
  const draw = interpolate(frame, [4, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const len = 2600;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1080 760" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0 }}>
        <path d={down.join(" ")} fill="none" stroke={AMBER_DIM} strokeWidth={5} strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
        <path d={up.join(" ")} fill="none" stroke={V4.orange} strokeWidth={6} strokeDasharray={len} strokeDashoffset={len * (1 - draw)} style={{ filter: "drop-shadow(0 0 10px rgba(255,75,0,0.5))" }} />
      </svg>
      <div style={{ position: "absolute", left: "9%", top: "27%", fontFamily: V4.mono, fontSize: 24, color: V4.orange, fontWeight: 700 }}>THE FUNDS ▲</div>
      <div style={{ position: "absolute", left: "9%", top: "66%", fontFamily: V4.mono, fontSize: 22, color: AMBER_DIM }}>THE MARKET ▼</div>
    </AbsoluteFill>
  );
};

/**
 * A board of the real 2008 collapse — actual tickers with their actual
 * worst-day prints (Lehman −94% Sep 15; AIG −61% Sep 16; WaMu −87% Sep 26;
 * Wachovia −82% Sep 29; Citi −26%, BofA −26%, Goldman −19%, Merrill −24%…).
 */
const REAL_PRINTS: { sym: string; name: string; print: string }[] = [
  { sym: "LEH", name: "LEHMAN BROS", print: "▼ 94.3%" },
  { sym: "AIG", name: "AIG", print: "▼ 60.8%" },
  { sym: "WM", name: "WASH. MUTUAL", print: "▼ 86.6%" },
  { sym: "WB", name: "WACHOVIA", print: "▼ 81.6%" },
  { sym: "C", name: "CITIGROUP", print: "▼ 26.0%" },
  { sym: "BAC", name: "BANK OF AMERICA", print: "▼ 26.2%" },
  { sym: "MER", name: "MERRILL LYNCH", print: "▼ 24.7%" },
  { sym: "GS", name: "GOLDMAN SACHS", print: "▼ 18.9%" },
  { sym: "MS", name: "MORGAN STANLEY", print: "▼ 24.2%" },
  { sym: "FNM", name: "FANNIE MAE", print: "▼ 89.6%" },
  { sym: "FRE", name: "FREDDIE MAC", print: "▼ 82.8%" },
  { sym: "DJIA", name: "DOW JONES", print: "▼ 777.68" },
];

export const NumberBoard: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ padding: "140px 120px 200px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {Array.from({ length: 6 }, (_, r) => (
        <div key={r} style={{ display: "flex", justifyContent: "space-between" }}>
          {Array.from({ length: 2 }, (_, c) => {
            const i = r * 2 + c;
            const e = REAL_PRINTS[i];
            const on = frame > i * 5; // rows cascade in fast
            const halted = ["LEH", "WM", "WB"].includes(e.sym) && Math.floor(frame / 8) % 2 === 0;
            return (
              <div key={c} style={{ opacity: on ? 1 : 0, fontFamily: V4.mono, fontSize: 33, letterSpacing: 1, width: 780, whiteSpace: "nowrap", display: "flex" }}>
                <span style={{ color: AMBER, fontWeight: 700, width: 110 }}>{e.sym}</span>
                <span style={{ color: AMBER_DIM, fontSize: 24, width: 360, alignSelf: "center" }}>{e.name}</span>
                <span style={{ color: V4.orange, fontWeight: 700 }}>{halted ? "HALTED" : e.print}</span>
              </div>
            );
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
};

/**
 * A field of foreclosure signs the camera pushes into — the human cost.
 * v5: laid out on non-overlapping depth LANES (not free-scattered), so
 * cards never collide/garble into each other regardless of scale — a
 * concrete bug in the earlier random-scatter version. Signs keep arriving
 * as the counter climbs; farther lanes read smaller and dimmer for depth.
 */
export const ForeclosureSigns: React.FC = () => {
  const frame = useCurrentFrame();
  // slow dolly-in: the whole field grows toward the viewer for the full beat
  const push = 1 + interpolate(frame, [0, 120], [0, 0.16]);
  const drift = interpolate(frame, [0, 120], [0, -80]);

  // 3 depth bands, each sign given its own lane so cards can never overlap
  const BANDS = [
    { count: 3, y: 200, s: 1.0, o: 1, atBase: 0, atStep: 5 },
    { count: 4, y: 420, s: 0.68, o: 0.7, atBase: 12, atStep: 4 },
    { count: 4, y: 600, s: 0.46, o: 0.42, atBase: 30, atStep: 4 },
  ];

  const signs: { x: number; y: number; s: number; o: number; r: number; at: number }[] = [];
  BANDS.forEach((band) => {
    const laneW = 1920 / band.count;
    for (let i = 0; i < band.count; i++) {
      const h1 = Math.sin((i + band.count * 7) * 12.9898) * 43758.5453;
      const rx = h1 - Math.floor(h1);
      signs.push({
        x: laneW * i + laneW * 0.5 + (rx - 0.5) * laneW * 0.3, // jitter bounded to 30% of the lane — never crosses into a neighbor
        y: band.y,
        s: band.s,
        o: band.o,
        r: (rx - 0.5) * 6,
        at: band.atBase + i * band.atStep,
      });
    }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0A09", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -60, transform: `scale(${push})` }}>
        {/* faint ground */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "48%", background: "linear-gradient(180deg, transparent, rgba(20,17,14,0.9))" }} />
        {signs.map((sg, i) => {
          const inO = interpolate(frame, [sg.at, sg.at + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          // fixed 210px-wide wrapper, all children pixel-positioned off its
          // ground-contact origin — no auto-width/shrink-to-fit ambiguity,
          // so the card can never drift off its post or into a neighbor.
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: sg.x - 105 + drift * (1 - sg.s),
                bottom: sg.y,
                width: 210,
                transform: `scale(${sg.s}) rotate(${sg.r}deg)`,
                opacity: sg.o * inO,
                transformOrigin: "bottom center",
                zIndex: Math.round(sg.s * 100),
              }}
            >
              {/* ground shadow — sells them as physical objects, not floating PNGs */}
              <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", width: 140, height: 18, borderRadius: "50%", background: "rgba(0,0,0,0.5)", filter: "blur(6px)" }} />
              <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 6, height: 150, backgroundColor: "#2A241C" }} />
              <div style={{ position: "absolute", bottom: 150, left: 0, width: 210, padding: "16px 10px", backgroundColor: "#DED8CB", transform: "rotate(-2deg)", boxShadow: "0 10px 30px rgba(0,0,0,0.7)" }}>
                <div style={{ fontFamily: V4.font, fontWeight: 800, fontSize: 26, color: "#161310", textAlign: "center", letterSpacing: 1, whiteSpace: "nowrap" }}>FORECLOSED</div>
                <div style={{ fontFamily: V4.mono, fontSize: 13, color: "#3A342A", textAlign: "center", marginTop: 4, letterSpacing: 2, whiteSpace: "nowrap" }}>BANK OWNED</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Bank-columns silhouette (institutional facade) for the "banks" beat. */
export const BankFacade: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 120], [1.0, 1.08]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0908", justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `scale(${push})` }}>
        <svg width={1400} height={620} viewBox="0 0 1400 620">
          {/* pediment */}
          <polygon points="120,150 700,40 1280,150" fill="#141210" />
          <rect x="120" y="150" width="1160" height="40" fill="#17140F" />
          {/* columns */}
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={175 + i * 140} y={190} width={64} height={360} fill="#131110" rx={4} />
          ))}
          {/* steps */}
          <rect x="80" y="550" width="1240" height="18" fill="#171410" />
          <rect x="40" y="568" width="1320" height="20" fill="#141210" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/** Housing rollover — the origin story. Case-Shiller-shaped rise then cliff. */
export const HousingChart: React.FC = () => {
  const frame = useCurrentFrame();
  const N = 56;
  const pts: string[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    // long steady climb (2000→2006), rounded top, hard fall (2007→2009)
    const base =
      t < 0.62 ? 620 - t * 560 : t < 0.72 ? 273 - Math.sin((t - 0.62) * 18) * 18 : 260 + (t - 0.72) * 1350;
    const wob = (rand(77 + i) - 0.5) * 16;
    pts.push(`${140 + t * 1640},${Math.min(700, base + wob)}`);
  }
  const draw = interpolate(frame, [4, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const len = 2600;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {[260, 400, 540, 680].map((gy) => (
          <line key={gy} x1={140} y1={gy} x2={1780} y2={gy} stroke={AMBER_DIM} strokeWidth={1} opacity={0.22} />
        ))}
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke={AMBER}
          strokeWidth={4.5}
          strokeDasharray={len}
          strokeDashoffset={len * (1 - draw)}
          style={{ filter: "drop-shadow(0 0 7px rgba(255,150,80,0.4))" }}
        />
      </svg>
      <div style={{ position: "absolute", top: 132, left: 140, fontFamily: V4.mono, fontSize: 25, letterSpacing: 3, color: AMBER, backgroundColor: "rgba(5,4,3,0.6)", padding: "8px 14px" }}>
        U.S. HOME PRICES · 2000 → 2009
      </div>
    </AbsoluteFill>
  );
};

/** Wire-service headlines — factual, original phrasing, typed like a feed. */
export const WireHeadlines: React.FC = () => {
  const frame = useCurrentFrame();
  const WIRES = [
    { t: "09·15·2008 04:57", txt: "LEHMAN BROTHERS FILES FOR BANKRUPTCY — LARGEST IN U.S. HISTORY", d: 4 },
    { t: "09·16·2008 21:04", txt: "FED RESCUES AIG WITH $85,000,000,000 LOAN", d: 34 },
    { t: "10·03·2008 13:22", txt: "CONGRESS PASSES $700,000,000,000 BANK BAILOUT", d: 62 },
  ];
  return (
    <AbsoluteFill style={{ padding: "220px 150px", display: "flex", flexDirection: "column", gap: 66 }}>
      {WIRES.map((w) => {
        const on = interpolate(frame, [w.d, w.d + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const chars = Math.max(0, Math.floor((frame - w.d) * 1.6));
        return (
          <div key={w.t} style={{ opacity: on }}>
            <div style={{ fontFamily: V4.mono, fontSize: 20, letterSpacing: 3, color: AMBER_DIM, marginBottom: 10 }}>
              ⚡ WIRE · {w.t} ET
            </div>
            <div style={{ fontFamily: V4.mono, fontSize: 38, fontWeight: 700, letterSpacing: 1, color: AMBER, lineHeight: 1.3 }}>
              {w.txt.slice(0, chars)}
              {chars < w.txt.length ? <span style={{ opacity: 0.6 }}>▌</span> : null}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** The human toll in numbers — $19.2T erased, 8.8M jobs. Heavy, held. */
export const WealthToll: React.FC = () => {
  const frame = useCurrentFrame();
  const secondIn = interpolate(frame, [52, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 60 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: V4.font, fontWeight: 800, fontSize: 130, color: "#EDE7DB", letterSpacing: "-0.02em" }}>
          <CrashCount to={19.2} startFrame={4} durationFrames={34} format={(v) => `$${v.toFixed(1)} TRILLION`} />
        </div>
        <div style={{ fontFamily: V4.font, fontSize: 32, color: "rgba(231,199,154,0.7)", letterSpacing: "0.14em", marginTop: 8 }}>
          OF HOUSEHOLD WEALTH — ERASED
        </div>
      </div>
      <div style={{ textAlign: "center", opacity: secondIn, transform: `translateY(${(1 - secondIn) * 20}px)` }}>
        <div style={{ fontFamily: V4.font, fontWeight: 800, fontSize: 96, color: V4.orange, letterSpacing: "-0.02em" }}>
          8,800,000 JOBS
        </div>
        <div style={{ fontFamily: V4.font, fontSize: 30, color: "rgba(231,199,154,0.7)", letterSpacing: "0.14em", marginTop: 6 }}>
          GONE WITH THEM
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CrashCount: React.FC<{ to: number; startFrame: number; durationFrames: number; format: (v: number) => string }> = ({
  to,
  startFrame,
  durationFrames,
  format,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [startFrame, startFrame + durationFrames], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{format(v)}</span>;
};
