import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LogoMark, Wordmark } from "../components/Logo";
import { colors } from "../theme";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const build = interpolate(frame, [2, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wordS = spring({
    frame: frame - 20,
    fps,
    config: { damping: 18, stiffness: 210, mass: 0.7 },
  });
  const tagS = spring({
    frame: frame - 32,
    fps,
    config: { damping: 18, stiffness: 210, mass: 0.7 },
  });
  // quick glow bloom right as the mark completes
  const flash = interpolate(frame, [24, 30, 44], [0, 1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 44 }}
    >
      <LogoMark size={340} build={build} glowOpacity={0.5 + flash * 0.7} />
      <div
        style={{
          opacity: Math.min(1, wordS * 1.4),
          transform: `translateY(${(1 - wordS) * 30}px)`,
        }}
      >
        <Wordmark fontSize={104} />
      </div>
      <div
        style={{
          opacity: Math.min(1, tagS * 1.4),
          transform: `translateY(${(1 - tagS) * 22}px)`,
          fontSize: 25,
          fontWeight: 600,
          letterSpacing: "0.34em",
          color: colors.orangeSoft,
          textShadow: "0 0 24px rgba(255,92,0,0.4)",
        }}
      >
        AI-AGENT TRADING PLATFORM
      </div>
    </AbsoluteFill>
  );
};
