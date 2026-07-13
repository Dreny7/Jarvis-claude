import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { V4 } from "../theme";
import { T, DUR } from "../timeline";
import { KineticLine } from "../components/text";
import { ScanFace } from "../components/ScanFace";
import { SingleFacet } from "../components/FacetMark";

// ACT 2 — THE TURN. The archive dissolves into the present. The edge that
// belonged to the machines becomes the pivot to Ecelon.

/** 2a — scan-grid face: "The system was built for them." */
const System: React.FC = () => {
  const frame = useCurrentFrame();
  const bg = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const out = interpolate(frame, [DUR.a2_system - 10, DUR.a2_system - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: V4.bgDeep, opacity: out }}>
      <AbsoluteFill
        style={{
          opacity: bg,
          background:
            "radial-gradient(ellipse 62% 78% at 72% 50%, rgba(255,75,0,0.5) 0%, rgba(255,75,0,0.16) 45%, rgba(8,8,10,0) 75%)",
        }}
      />
      <ScanFace scanStart={16} scanDuration={64} />
      <div style={{ position: "absolute", left: "7%", top: "38%", width: 820 }}>
        <KineticLine text="For decades, the edge" delay={8} fontSize={64} fontWeight={600} align="left" color={V4.dim} />
        <div style={{ height: 6 }} />
        <KineticLine text="belonged to {orange:them.}" delay={22} fontSize={96} fontWeight={800} align="left" punchy />
      </div>
    </AbsoluteFill>
  );
};

/** 2b — the pivot: "So we built the algorithm for everyone else." + facet ignite. */
const Pivot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const IGNITE = 78;
  const facetS = spring({ frame: frame - IGNITE, fps, config: { damping: 16, stiffness: 150, mass: 1.1 } });
  const glow = interpolate(frame, [IGNITE, IGNITE + 8, IGNITE + 34], [0, 1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lift = interpolate(frame, [IGNITE, IGNITE + 26], [0, -70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const out = interpolate(frame, [DUR.a2_pivot - 8, DUR.a2_pivot - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#050506", justifyContent: "center", alignItems: "center", opacity: out }}>
      <div style={{ transform: `translateY(${lift}px)`, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
        <KineticLine text="So we built the algorithm" delay={10} stagger={3.5} fontSize={78} fontWeight={700} />
        <KineticLine text="for {orange:everyone} else." delay={30} stagger={3.5} fontSize={78} fontWeight={700} />
      </div>
      {frame >= IGNITE && (
        <div style={{ position: "absolute", top: "63%", opacity: Math.min(1, facetS * 1.4), transform: `scale(${0.7 + facetS * 0.3})` }}>
          <SingleFacet index={0} width={120} glow={glow} />
        </div>
      )}
    </AbsoluteFill>
  );
};

export const Act2: React.FC = () => (
  <>
    <Sequence from={T.a2_system} durationInFrames={DUR.a2_system}>
      <System />
    </Sequence>
    <Sequence from={T.a2_pivot} durationInFrames={DUR.a2_pivot}>
      <Pivot />
    </Sequence>
  </>
);
