import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { V4 } from "../theme";
import { T } from "../timeline";
import { KineticLine } from "../components/text";
import { SingleFacet } from "../components/FacetMark";

// ACT 3 — the pivot. Silence, one line, first facet (Trust) ignites.
// Local frame 0 = T.a3 (750). Ignite at local 100 (global 850).

const IGNITE = T.a3Ignite - T.a3;

export const Act3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const facetS = spring({
    frame: frame - IGNITE,
    fps,
    config: { damping: 16, stiffness: 150, mass: 1.1 },
  });
  const glow = interpolate(frame, [IGNITE, IGNITE + 8, IGNITE + 34], [0, 1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // the line drifts up slightly to make room as the shard arrives
  const lift = interpolate(frame, [IGNITE, IGNITE + 26], [0, -70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#050506", justifyContent: "center", alignItems: "center" }}>
      {/* explicit two-line break — avoids the "else." widow (review finding) */}
      <div style={{ transform: `translateY(${lift}px)`, display: "flex", flexDirection: "column", gap: 8 }}>
        <KineticLine text="So we built the algorithm" delay={16} stagger={4} fontSize={78} fontWeight={700} />
        <KineticLine text="for everyone else." delay={38} stagger={4} fontSize={78} fontWeight={700} />
      </div>
      {frame >= IGNITE && (
        <div
          style={{
            position: "absolute",
            top: "62%",
            opacity: Math.min(1, facetS * 1.4),
            transform: `scale(${0.7 + facetS * 0.3})`,
          }}
        >
          <SingleFacet index={0} width={120} glow={glow} />
        </div>
      )}
    </AbsoluteFill>
  );
};
