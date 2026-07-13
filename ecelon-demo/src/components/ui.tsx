import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { cardStyle, colors, orangeGradient } from "../theme";

/** Fast push transition: scenes zoom-settle in and depart with a quick scale/fade. */
export const SceneShell: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 20, stiffness: 200, mass: 0.7 } });
  const exitStart = durationInFrames - 9;
  const exit = interpolate(frame, [exitStart, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, enter * 1.5) * (1 - exit),
        transform: `scale(${0.965 + enter * 0.035 + exit * 0.06})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Pop-in wrapper for cards/blocks — snappy spring with configurable direction. */
export const Pop: React.FC<{
  delay?: number;
  from?: "up" | "down" | "left" | "right" | "scale";
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, from = "up", distance = 40, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 17, stiffness: 230, mass: 0.65 },
  });
  const d = (1 - s) * distance;
  const t =
    from === "up"
      ? `translateY(${d}px)`
      : from === "down"
        ? `translateY(${-d}px)`
        : from === "left"
          ? `translateX(${d}px)`
          : from === "right"
            ? `translateX(${-d}px)`
            : `scale(${0.85 + s * 0.15})`;
  return (
    <div style={{ opacity: Math.min(1, s * 1.4), transform: t, ...style }}>
      {children}
    </div>
  );
};

export const GlassCard: React.FC<{
  style?: React.CSSProperties;
  accent?: boolean;
  children: React.ReactNode;
}> = ({ style, accent = false, children }) => (
  <div
    style={{
      ...cardStyle,
      ...(accent
        ? {
            border: "1px solid rgba(255,92,0,0.45)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.10), 0 0 44px rgba(255,92,0,0.16), 0 24px 60px rgba(0,0,0,0.55)",
          }
        : {}),
      ...style,
    }}
  >
    {children}
  </div>
);

export const StatusBadge: React.FC<{
  label: string;
  tone?: "orange" | "green" | "dim";
  pulseDelay?: number;
}> = ({ label, tone = "orange", pulseDelay = 0 }) => {
  const frame = useCurrentFrame();
  const pulse = 0.55 + 0.45 * Math.sin((frame + pulseDelay) / 6);
  const color =
    tone === "orange" ? colors.orange : tone === "green" ? colors.green : colors.textDim;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 14px",
        borderRadius: 999,
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: "0.08em",
        color,
        backgroundColor:
          tone === "dim" ? "rgba(255,255,255,0.05)" : `${color}1A`,
        border: `1px solid ${tone === "dim" ? "rgba(255,255,255,0.10)" : `${color}55`}`,
      }}
    >
      {tone !== "dim" && (
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: pulse,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      )}
      {label}
    </div>
  );
};

/** Small squircle icon tile with the orange gradient. */
export const IconTile: React.FC<{ size?: number; children: React.ReactNode }> = ({
  size = 56,
  children,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      background: orangeGradient,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 0 26px rgba(255,92,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);
