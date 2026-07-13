import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { V4 } from "../theme";
import { KineticLine } from "../components/text";
import { FacetMark, Wordmark } from "../components/FacetMark";
import { PlusGrid } from "../components/vfx";

// OUTRO — the complete lockup enters whole (no facet assembly), then
// tagline → callback → CTA → verbatim beta disclosure. Music still driving.

export const Act5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lockup = spring({ frame: frame - 6, fps, config: { damping: 15, stiffness: 210, mass: 0.8 } });
  const bloom = interpolate(frame, [6, 22, 70], [0.1, 1, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const markLift = interpolate(frame, [56, 84], [0, -130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tagIn = interpolate(frame, [66, 84], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaS = spring({ frame: frame - 150, fps, config: { damping: 14, stiffness: 240, mass: 0.7 } });
  const disclosureIn = interpolate(frame, [186, 206], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaPulse = 1 + Math.sin(Math.max(0, frame - 168) / 8) * 0.014;

  return (
    <AbsoluteFill style={{ backgroundColor: V4.bgDeep, justifyContent: "center", alignItems: "center" }}>
      <PlusGrid opacity={interpolate(frame, [130, 170], [0, 0.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} cell={72} />

      {/* complete lockup — enters as one piece */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${markLift - 40}px) scale(${0.9 + lockup * 0.1})`,
          display: "flex",
          alignItems: "center",
          gap: 42,
          opacity: Math.min(1, lockup * 1.5),
        }}
      >
        <FacetMark width={230} facetProgress={[1, 1, 1, 1, 1]} glow={bloom} />
        <Wordmark fontSize={120} />
      </div>

      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, marginTop: 0, opacity: tagIn, textAlign: "center" }}>
        <div style={{ fontFamily: V4.font, fontWeight: 600, fontSize: 42, letterSpacing: "-0.015em", color: V4.white }}>
          The AI-Agent Operating System for Modern Investors
        </div>
        <div style={{ marginTop: 24 }}>
          <KineticLine
            text="They had the algorithms. {orange:Now} {orange:you} {orange:do.}"
            delay={92}
            stagger={3}
            fontSize={52}
            fontWeight={700}
            color={V4.dim}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: 200,
          transform: `translateX(-50%) translateY(${(1 - ctaS) * 34}px) scale(${ctaPulse})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          opacity: Math.min(1, ctaS * 1.4),
        }}
      >
        <div
          style={{
            fontFamily: V4.font,
            fontWeight: 700,
            fontSize: 34,
            color: "#FFFFFF",
            background: `linear-gradient(140deg, ${V4.orange}, ${V4.orangeDeep})`,
            padding: "22px 64px",
            borderRadius: 999,
            boxShadow: "0 0 60px rgba(255,75,0,0.45)",
          }}
        >
          Get started
        </div>
        <div style={{ fontFamily: V4.font, fontSize: 24, color: V4.dim, whiteSpace: "nowrap" }}>
          Free during beta · Paper trading with live market data
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 56,
          width: "100%",
          textAlign: "center",
          opacity: disclosureIn,
          fontFamily: V4.font,
          fontSize: 22,
          color: V4.dim,
          letterSpacing: "0.04em",
        }}
      >
        Ecelon Beta · Paper trading · Live markets, no real funds — ecelon.ai
      </div>
    </AbsoluteFill>
  );
};
