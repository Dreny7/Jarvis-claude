import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";

/** Deterministic per-frame film grain (feTurbulence, overlay blend). */
export const Grain: React.FC<{ intensity: number }> = ({ intensity }) => {
  const frame = useCurrentFrame();
  if (intensity <= 0.001) return null;
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        // "screen" (not "overlay") — overlay math cancels to ~0 on near-black
        // scenes, which nulled the grain entirely (caught in review).
        mixBlendMode: "screen",
        opacity: intensity,
        pointerEvents: "none",
      }}
    >
      <filter id="v4-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency={0.9}
          numOctaves={2}
          seed={frame % 8}
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.35 0.35 0.35 0 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#v4-grain)" />
    </svg>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 78% 72% at 50% 50%, transparent 52%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** 2.39:1 letterbox bars; retract 0..1 animates them away. */
export const Letterbox: React.FC<{ retract: number }> = ({ retract }) => {
  const h = 11.5 * (1 - retract);
  if (h <= 0.05) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "space-between", pointerEvents: "none" }}>
      <div style={{ height: `${h}%`, backgroundColor: "#000" }} />
      <div style={{ height: `${h}%`, backgroundColor: "#000" }} />
    </AbsoluteFill>
  );
};

/** Decaying noise-driven shake after each impact frame (global frames). */
export const useShake = (impactFrames: number[], amplitude = 9) => {
  const frame = useCurrentFrame();
  let shake = 0;
  for (const f of impactFrames) {
    const since = frame - f;
    if (since >= 0 && since < 12) {
      shake = Math.max(shake, interpolate(since, [0, 12], [1, 0]) * amplitude);
    }
  }
  const x = noise2D("v4-shake-x", frame * 0.9, 0) * shake;
  const y = noise2D("v4-shake-y", frame * 0.9, 7) * shake;
  return { x, y };
};

/** Faint "+" crosshair grid — the recurring brand scan motif. */
export const PlusGrid: React.FC<{
  opacity?: number;
  cell?: number;
  color?: string;
}> = ({ opacity = 0.1, cell = 64, color = "#FF6B2C" }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, pointerEvents: "none" }}>
    <defs>
      <pattern id="v4-plus" width={cell} height={cell} patternUnits="userSpaceOnUse">
        <path
          d={`M ${cell / 2} ${cell / 2 - 6} v 12 M ${cell / 2 - 6} ${cell / 2} h 12`}
          stroke={color}
          strokeWidth={1.6}
          fill="none"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#v4-plus)" />
  </svg>
);
