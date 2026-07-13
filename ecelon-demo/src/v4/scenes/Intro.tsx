import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { V4 } from "../theme";
import { T, DUR } from "../timeline";
import { KineticLine } from "../components/text";
import { FacetMark, Wordmark } from "../components/FacetMark";
import { GlowField } from "../components/ios";

// ECELON INTRO — the archive powers off, chord 1 detonates on a FLAT neon
// field. No gradients: the brand color is #FF4B00, full bleed, nothing else.
// Every scene boundary here sits on a measured riff onset.

const NEON = V4.neon;
const INK = "#0A0A0B";

/** Expanding shock rings + radial shards — the detonation dressing. */
const Shockwave: React.FC<{ tint?: string }> = ({ tint = "rgba(10,10,11,0.5)" }) => {
  const frame = useCurrentFrame();
  const rings = [0, 5, 11];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
      {rings.map((d, i) => {
        const p = interpolate(frame - d, [0, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (p <= 0 || p >= 1) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              border: `${5 - i}px solid ${i === 1 ? "rgba(255,255,255,0.75)" : tint}`,
              transform: `scale(${0.2 + p * 11})`,
              opacity: (1 - p) * 0.9,
            }}
          />
        );
      })}
      {/* 16 shards firing outward for the first ~14 frames */}
      {Array.from({ length: 16 }, (_, i) => {
        const p = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (p >= 1) return null;
        const a = (i / 16) * Math.PI * 2;
        const dist = 130 + p * 880;
        const len = 90 * (1 - p) + 14;
        return (
          <div
            key={`s${i}`}
            style={{
              position: "absolute",
              width: len,
              height: i % 4 === 0 ? 5 : 3,
              backgroundColor: i % 3 === 0 ? "#FFFFFF" : INK,
              opacity: (1 - p) * 0.85,
              transform: `rotate(${(a * 180) / Math.PI}deg) translateX(${dist}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Chord 1: flat neon detonation — "NOT ANYMORE." */
const Slam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 320, mass: 0.7 } });
  const split = interpolate(frame, [0, 6], [9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = 1.55 - s * 0.55; // crashes DOWN into place
  const text: React.CSSProperties = {
    fontFamily: V4.font,
    fontWeight: 800,
    fontSize: 160,
    letterSpacing: "-0.03em",
    whiteSpace: "nowrap",
  };
  return (
    <AbsoluteFill style={{ backgroundColor: NEON, justifyContent: "center", alignItems: "center" }}>
      <Shockwave />
      <div style={{ position: "relative", transform: `scale(${scale})`, opacity: Math.min(1, s * 2) }}>
        {/* 6-frame chromatic split — white and ink ghosts, on-palette */}
        {split > 0.3 && (
          <>
            <div style={{ ...text, position: "absolute", left: -split, top: 0, color: "#FFFFFF", opacity: 0.7 }}>NOT ANYMORE.</div>
            <div style={{ ...text, position: "absolute", left: split, top: 0, color: "rgba(10,10,11,0.55)" }}>NOT ANYMORE.</div>
          </>
        )}
        <div style={{ ...text, position: "relative", color: INK }}>NOT ANYMORE.</div>
      </div>
    </AbsoluteFill>
  );
};

/** Chord 2: the lockup on flat neon — clean, no silhouette, no gradient. */
const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 13, stiffness: 300, mass: 0.75 } });
  const tagIn = interpolate(frame, [16, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagRise = interpolate(frame, [16, 28], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: NEON, justifyContent: "center", alignItems: "center" }}>
      <Shockwave tint="rgba(255,255,255,0.5)" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 34,
          opacity: Math.min(1, s * 1.8),
          transform: `scale(${1.35 - s * 0.35})`,
        }}
      >
        <FacetMark width={190} facetProgress={[1, 1, 1, 1, 1]} color="#FFFFFF" />
        <Wordmark fontSize={124} color="#FFFFFF" />
      </div>
      <div
        style={{
          marginTop: 40,
          fontFamily: V4.font,
          fontWeight: 700,
          fontSize: 36,
          letterSpacing: "0.01em",
          color: INK,
          opacity: tagIn,
          transform: `translateY(${tagRise}px)`,
        }}
      >
        The AI-Agent Operating System for Modern Investors
      </div>
    </AbsoluteFill>
  );
};

/** Chord 3: thesis on black. */
const Built: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#050506", justifyContent: "center", alignItems: "center" }}>
    <GlowField intensity={0.7} />
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      <KineticLine text="We built the algorithm" delay={3} stagger={2} fontSize={92} fontWeight={800} punchy />
      <KineticLine text="for {orange:everyone} else." delay={13} stagger={2} fontSize={92} fontWeight={800} punchy />
    </div>
  </AbsoluteFill>
);

/** Chords 4/5/6: three word-punches, each ON a riff stab (0 / 16 / 32). */
const PUNCHES = [
  { word: "Type it.", at: 0, color: V4.white },
  { word: "Test it.", at: 16, color: V4.white },
  { word: "Trade it.", at: 32, color: V4.neon },
];

const Punch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#050506", justifyContent: "center", alignItems: "center" }}>
      <GlowField intensity={0.9} />
      <div style={{ display: "flex", gap: 56, alignItems: "baseline" }}>
        {PUNCHES.map((p) => {
          const s = spring({ frame: frame - p.at, fps, config: { damping: 11, stiffness: 340, mass: 0.7 } });
          return (
            <span
              key={p.word}
              style={{
                fontFamily: V4.font,
                fontWeight: 800,
                fontSize: 116,
                letterSpacing: "-0.03em",
                color: p.color,
                opacity: frame < p.at ? 0 : Math.min(1, s * 2),
                transform: `scale(${1.7 - s * 0.7})`,
                display: "inline-block",
                textShadow: p.color === V4.neon ? "0 0 60px rgba(255,75,0,0.6)" : undefined,
              }}
            >
              {p.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
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
    <Sequence from={T.punch} durationInFrames={DUR.punch}>
      <Punch />
    </Sequence>
  </>
);
