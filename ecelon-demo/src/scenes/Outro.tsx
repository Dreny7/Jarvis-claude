import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LogoMark, Wordmark } from "../components/Logo";
import { Pop } from "../components/ui";
import { colors, orangeGradient } from "../theme";

export const Outro: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoS = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 170, mass: 0.8 } });
  const underline = interpolate(frame, [30, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", opacity: fadeOut }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 40,
          opacity: Math.min(1, logoS * 1.4),
          transform: `scale(${0.9 + logoS * 0.1})`,
        }}
      >
        <LogoMark size={210} glowOpacity={0.95} />
        <Wordmark fontSize={130} />
      </div>

      <Pop delay={16} distance={30} style={{ marginTop: 54 }}>
        <div
          style={{
            fontSize: 52,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: colors.text,
            textAlign: "center",
          }}
        >
          Your agents are already{" "}
          <span style={{ color: colors.orange, textShadow: "0 0 36px rgba(255,92,0,0.7)" }}>
            working.
          </span>
        </div>
        <div
          style={{
            height: 4,
            width: `${underline * 100}%`,
            margin: "26px auto 0",
            maxWidth: 560,
            borderRadius: 2,
            background: orangeGradient,
            boxShadow: "0 0 22px rgba(255,92,0,0.7)",
          }}
        />
      </Pop>

      <Pop delay={34} distance={24} style={{ marginTop: 62 }}>
        <div
          style={{
            padding: "20px 52px",
            borderRadius: 999,
            background: orangeGradient,
            fontSize: 31,
            fontWeight: 700,
            color: "#fff",
            boxShadow: "0 0 54px rgba(255,92,0,0.55), inset 0 1px 0 rgba(255,255,255,0.35)",
          }}
        >
          Get early access
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
