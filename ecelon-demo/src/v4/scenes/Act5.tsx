import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { V4 } from "../theme";
import { KineticLine } from "../components/text";
import { FacetMark, Wordmark } from "../components/FacetMark";
import { PlusGrid } from "../components/vfx";

// ACT 5 — brand / CTA. One continuous calm scene, no cuts.
// Local frames: assembly 0–120, tagline 120–250, CTA 250–360.

export const Act5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // facets lock left→right, 12f apart
  const facetProgress = Array.from({ length: 5 }, (_, i) =>
    spring({ frame: frame - 10 - i * 12, fps, config: { damping: 15, stiffness: 160, mass: 0.95 } }),
  );
  const bloom = interpolate(frame, [78, 92, 150], [0.15, 1, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wordS = spring({ frame: frame - 86, fps, config: { damping: 20, stiffness: 170, mass: 0.9 } });
  const markLift = interpolate(frame, [116, 150], [0, -120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tagIn = interpolate(frame, [128, 148], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaS = spring({ frame: frame - 252, fps, config: { damping: 15, stiffness: 200, mass: 0.8 } });
  const disclosureIn = interpolate(frame, [286, 306], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ctaPulse = 1 + Math.sin(Math.max(0, frame - 270) / 9) * 0.012;

  return (
    <AbsoluteFill style={{ backgroundColor: V4.bgDeep, justifyContent: "center", alignItems: "center" }}>
      <PlusGrid opacity={interpolate(frame, [240, 280], [0, 0.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} cell={72} />

      {/* mark + wordmark row — centered on its own, lifts up to make room */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${markLift - 40}px)`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <FacetMark width={230} facetProgress={facetProgress} glow={bloom} explode={90} />
        {/* wordmark reveals by expanding width so the row stays centered pre-arrival */}
        <div
          style={{
            width: wordS * 470,
            overflow: "hidden",
            whiteSpace: "nowrap",
            marginLeft: wordS * 42,
            opacity: Math.min(1, wordS * 1.5),
          }}
        >
          <Wordmark fontSize={120} />
        </div>
      </div>

      {/* tagline + callback, below center once the mark lifts */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          marginTop: 4,
          opacity: tagIn,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: V4.font,
            fontWeight: 600,
            fontSize: 42,
            letterSpacing: "-0.015em",
            color: V4.white,
          }}
        >
          The AI-Agent Operating System for Modern Investors
        </div>
        <div style={{ marginTop: 24 }}>
          <KineticLine
            text="They had the algorithms. {orange:Now} {orange:you} {orange:do.}"
            delay={166}
            stagger={3}
            fontSize={52}
            fontWeight={700}
            color={V4.dim}
          />
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: 210,
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
            backgroundColor: V4.orangeDeep,
            padding: "22px 64px",
            borderRadius: 999,
            boxShadow: "0 0 60px rgba(255,75,0,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
          }}
        >
          Get started
        </div>
        <div style={{ fontFamily: V4.font, fontSize: 24, color: V4.dim, whiteSpace: "nowrap" }}>
          Free during beta · Paper trading with live market data
        </div>
      </div>

      {/* honest beta disclosure — real product line, verbatim */}
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
