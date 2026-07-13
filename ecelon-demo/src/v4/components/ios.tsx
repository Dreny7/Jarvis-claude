import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { V4 } from "../theme";

// iOS design kit — frosted glass, hairline strokes, pill controls, and a
// living background so every product frame has motion in it.

export const ORANGE_GRAD = `linear-gradient(140deg, ${V4.orangeHi}, ${V4.orangeDeep})`;

/** Frosted-glass card: translucent fill, hairline stroke, big radius, soft drop. */
export const Glass: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; radius?: number }> = ({
  children,
  style,
  radius = 30,
}) => (
  <div
    style={{
      backgroundColor: "rgba(22,22,26,0.72)",
      backdropFilter: "blur(28px)",
      WebkitBackdropFilter: "blur(28px)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: radius,
      boxShadow: "0 40px 110px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Two drifting orange glows + slow parallax — the "alive" backdrop for part 2. */
export const GlowField: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const x1 = 26 + Math.sin(frame / 46) * 9;
  const y1 = 30 + Math.cos(frame / 58) * 8;
  const x2 = 76 - Math.sin(frame / 52) * 10;
  const y2 = 72 + Math.sin(frame / 40) * 7;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 34% 30% at ${x1}% ${y1}%, rgba(255,75,0,${0.13 * intensity}), transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 30% 34% at ${x2}% ${y2}%, rgba(255,122,61,${0.09 * intensity}), transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** iOS segmented control with an animated selection pill. */
export const Segmented: React.FC<{ options: string[]; selected: number; width?: number; switchAt?: number }> = ({
  options,
  selected,
  width = 460,
  switchAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // if switchAt given, animate from 0 → selected at that frame
  const s = switchAt === undefined ? 1 : spring({ frame: frame - switchAt, fps, config: { damping: 16, stiffness: 220, mass: 0.7 } });
  const idx = switchAt === undefined ? selected : selected * s;
  const segW = width / options.length;
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width,
        padding: 5,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 5,
          left: 5 + idx * segW,
          width: segW - 10,
          height: "calc(100% - 10px)",
          borderRadius: 999,
          background: ORANGE_GRAD,
          boxShadow: "0 4px 18px rgba(255,75,0,0.45)",
        }}
      />
      {options.map((o, i) => {
        const active = Math.round(idx) === i;
        return (
          <div
            key={o}
            style={{
              position: "relative",
              width: segW,
              textAlign: "center",
              padding: "12px 0",
              fontFamily: V4.font,
              fontWeight: 700,
              fontSize: 23,
              color: active ? "#fff" : V4.dim,
            }}
          >
            {o}
          </div>
        );
      })}
    </div>
  );
};

/** Spring pop-in with slight scale — the standard iOS entrance. */
export const Rise: React.FC<{ delay: number; children: React.ReactNode; from?: number; style?: React.CSSProperties }> = ({
  delay,
  children,
  from = 26,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 270, mass: 0.6 } });
  return (
    <div
      style={{
        opacity: Math.min(1, s * 1.4),
        transform: `translateY(${(1 - s) * from}px) scale(${0.97 + s * 0.03})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Slim status pill (LIVE — PAPER, DRAFT, etc.). */
export const Pill: React.FC<{ text: string; on?: boolean; size?: number }> = ({ text, on = true, size = 19 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      fontFamily: V4.font,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: "0.07em",
      padding: `${size * 0.42}px ${size * 0.95}px`,
      borderRadius: 999,
      color: on ? V4.orange : V4.dim,
      border: `1.5px solid ${on ? "rgba(255,107,44,0.5)" : "rgba(245,245,247,0.22)"}`,
      backgroundColor: on ? "rgba(255,75,0,0.10)" : "transparent",
    }}
  >
    {on && <span style={{ width: size * 0.42, height: size * 0.42, borderRadius: 999, backgroundColor: V4.orange, boxShadow: "0 0 10px rgba(255,75,0,0.9)" }} />}
    {text}
  </div>
);
