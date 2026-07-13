import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { V4 } from "../theme";
import { T, DUR } from "../timeline";
import { KineticLine, TypeOn } from "../components/text";
import { FacetMark, Wordmark } from "../components/FacetMark";
import { PROFILE } from "../components/ScanFace";
import { GlowField } from "../components/ios";

// ECELON INTRO — the music flips, the palette inverts, the energy spikes.
// Slam (black-on-orange) → reference-photo silhouette lockup → thesis → 3 how-beats.

const ORANGE_FIELD = `linear-gradient(160deg, ${V4.orangeHi} 0%, ${V4.orange} 45%, ${V4.orangeDeep} 100%)`;

/** Hard orange frame: "NOT ANYMORE." in black. */
const Slam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 2, fps, config: { damping: 13, stiffness: 300, mass: 0.6 } });
  return (
    <AbsoluteFill style={{ background: ORANGE_FIELD, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily: V4.font,
          fontWeight: 800,
          fontSize: 160,
          letterSpacing: "-0.03em",
          color: "#0A0A0B",
          transform: `scale(${0.8 + s * 0.2})`,
          opacity: Math.min(1, s * 1.6),
        }}
      >
        NOT ANYMORE.
      </div>
    </AbsoluteFill>
  );
};

/** The reference-photo frame: black silhouette on orange, white lockup center. */
const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lockup = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 190, mass: 0.85 } });
  const drift = interpolate(frame, [0, DUR.reveal], [0, -18]);
  const tagIn = interpolate(frame, [34, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: ORANGE_FIELD, overflow: "hidden" }}>
      {/* silhouette, right side, slow drift — like the brand photo */}
      <svg
        width={1400}
        height={1456}
        viewBox="0 0 520 540"
        style={{ position: "absolute", right: -220, top: -120, transform: `translateY(${drift}px)` }}
      >
        <path d={PROFILE} fill="#0A0808" />
      </svg>
      {/* soft red-orange rim where silhouette meets field */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 50% 60% at 62% 50%, rgba(120,20,0,0.25), transparent 70%)" }} />

      {/* centered white lockup */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 34,
            opacity: Math.min(1, lockup * 1.4),
            transform: `scale(${0.92 + lockup * 0.08})`,
          }}
        >
          <FacetMark width={170} facetProgress={[1, 1, 1, 1, 1]} color="#FFFFFF" />
          <Wordmark fontSize={110} color="#FFFFFF" />
        </div>
        <div
          style={{
            marginTop: 34,
            fontFamily: V4.font,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: "0.01em",
            color: "#FFFFFF",
            textShadow: "0 2px 18px rgba(60,10,0,0.55)",
            opacity: tagIn,
          }}
        >
          The AI-Agent Operating System for Modern Investors
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Thesis on black — the pivot line, huge. */
const Built: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#050506", justifyContent: "center", alignItems: "center" }}>
    <GlowField intensity={0.7} />
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      <KineticLine text="We built the algorithm" delay={4} stagger={2.5} fontSize={92} fontWeight={800} punchy />
      <KineticLine text="for {orange:everyone} else." delay={16} stagger={2.5} fontSize={92} fontWeight={800} punchy />
    </div>
  </AbsoluteFill>
);

/** Three rapid how-beats: type → backtest → execute. */
const HowBeat: React.FC<{ n: string; line: string; children: React.ReactNode }> = ({ n, line, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, stiffness: 280, mass: 0.6 } });
  return (
    <AbsoluteFill style={{ backgroundColor: V4.bg, justifyContent: "center", alignItems: "center", gap: 40 }}>
      <GlowField intensity={0.8} />
      <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * 30}px)` }}>
        <span style={{ fontFamily: V4.mono, fontSize: 30, color: V4.orange, fontWeight: 700 }}>{n}</span>
        <span style={{ fontFamily: V4.font, fontWeight: 800, fontSize: 84, letterSpacing: "-0.03em", color: V4.white }}>{line}</span>
      </div>
      <div style={{ opacity: Math.min(1, s * 1.3), transform: `scale(${0.94 + s * 0.06})` }}>{children}</div>
    </AbsoluteFill>
  );
};

const MiniPrompt: React.FC = () => (
  <div
    style={{
      width: 900,
      border: "1.5px solid rgba(255,107,44,0.55)",
      borderRadius: 20,
      padding: "22px 28px",
      fontFamily: V4.font,
      fontSize: 30,
      color: V4.white,
      backgroundColor: "rgba(22,22,26,0.72)",
      backdropFilter: "blur(24px)",
      boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
    }}
  >
    <TypeOn text="Trade momentum on large-caps. Cap my risk at 2% a day." startFrame={4} charsPerFrame={2.2} />
  </div>
);

const MiniCurve: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [2, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pts: string[] = [];
  let y = 150;
  for (let i = 0; i < 40; i++) {
    const r = Math.sin(i * 12.9898) * 43758.5453;
    y += ((r - Math.floor(r)) - 0.58) * 26;
    y = Math.max(20, Math.min(170, y));
    pts.push(`${(i / 39) * 900},${y}`);
  }
  return (
    <svg width={900} height={190} viewBox="0 0 900 190">
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={V4.orange}
        strokeWidth={5}
        strokeDasharray={1200}
        strokeDashoffset={1200 * (1 - draw)}
        style={{ filter: "drop-shadow(0 0 10px rgba(255,75,0,0.6))" }}
      />
    </svg>
  );
};

const MiniFill: React.FC = () => {
  const frame = useCurrentFrame();
  const on = frame > 6;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, width: 900, border: "1px solid rgba(255,107,44,0.5)", borderRadius: 20, padding: "20px 26px", backgroundColor: "rgba(255,75,0,0.08)", backdropFilter: "blur(24px)", opacity: on ? 1 : 0 }}>
      <span style={{ fontFamily: V4.font, fontWeight: 700, fontSize: 28, color: V4.white }}>Alpha Trader</span>
      <span style={{ fontFamily: V4.font, fontSize: 28, color: V4.dim }}>opened NVDA @ $142.80</span>
      <span style={{ marginLeft: "auto", fontFamily: V4.font, fontWeight: 800, fontSize: 22, color: V4.orange, border: `1.5px solid ${V4.orange}`, borderRadius: 999, padding: "4px 14px" }}>BUY</span>
    </div>
  );
};

export const Intro: React.FC = () => (
  <>
    <Sequence from={T.slam} durationInFrames={DUR.slam}>
      <Slam />
    </Sequence>
    <Sequence from={T.reveal} durationInFrames={DUR.reveal}>
      <Reveal />
    </Sequence>
    <Sequence from={T.built} durationInFrames={DUR.built}>
      <Built />
    </Sequence>
    <Sequence from={T.how1} durationInFrames={DUR.how1}>
      <HowBeat n="01" line="Type your strategy.">
        <MiniPrompt />
      </HowBeat>
    </Sequence>
    <Sequence from={T.how2} durationInFrames={DUR.how2}>
      <HowBeat n="02" line="Agents backtest it.">
        <MiniCurve />
      </HowBeat>
    </Sequence>
    <Sequence from={T.how3} durationInFrames={DUR.how3}>
      <HowBeat n="03" line="They execute. Live.">
        <MiniFill />
      </HowBeat>
    </Sequence>
  </>
);
