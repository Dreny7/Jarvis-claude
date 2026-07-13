import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../theme";

// Deterministic pseudo-random (no Math.random — renders must be pure).
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const PARTICLES = Array.from({ length: 90 }, (_, i) => ({
  x: rand(i) * 100,
  y: rand(i + 100) * 100,
  size: 1 + rand(i + 200) * 2.2,
  drift: 6 + rand(i + 300) * 16,
  phase: rand(i + 400) * Math.PI * 2,
  warm: rand(i + 500) > 0.45,
}));

export const Background: React.FC<{ bloom?: number }> = ({ bloom = 0.5 }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Center orange bloom — kept saturated, not muddy */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 62% 55% at 50% 58%, rgba(255,92,0,${
            0.16 * bloom
          }) 0%, rgba(255,92,0,${0.05 * bloom}) 42%, transparent 72%)`,
        }}
      />
      {/* Ember particles */}
      {PARTICLES.map((p, i) => {
        const y = p.y - ((frame * 0.028 * p.drift) % 120);
        const flicker = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame / 17 + p.phase));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${((y % 120) + 120) % 120 - 10}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.warm ? colors.orangeSoft : "rgba(255,255,255,0.75)",
              opacity: flicker * (p.warm ? 0.5 : 0.28),
              boxShadow: p.warm ? "0 0 6px rgba(255,123,36,0.8)" : "none",
            }}
          />
        );
      })}
      {/* Vignette keeps edges pure black */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 75% at 50% 50%, transparent 55%, rgba(0,0,0,0.85) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
