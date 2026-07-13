import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Series,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Background } from "./components/Background";
import { SceneShell } from "./components/ui";
import { inter } from "./font";
import { Agents } from "./scenes/Agents";
import { Brokers } from "./scenes/Brokers";
import { Hook } from "./scenes/Hook";
import { Intro } from "./scenes/Intro";
import { Outro } from "./scenes/Outro";
import { Phone } from "./scenes/Phone";
import { Signals } from "./scenes/Signals";
import { Strategy } from "./scenes/Strategy";

// Scene lengths (30fps). Total = 1140 frames = 38s — down from 54s.
export const SCENES = {
  intro: 100,
  hook: 95,
  agents: 150,
  strategy: 150,
  phone: 175,
  brokers: 145,
  signals: 145,
  outro: 180,
} as const;

export const TOTAL_FRAMES = Object.values(SCENES).reduce((a, b) => a + b, 0);

const wrap = (dur: number, node: React.ReactNode) => (
  <SceneShell durationInFrames={dur}>{node}</SceneShell>
);

export const EcelonDemo: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: inter, backgroundColor: "#050506" }}>
      <Background />

      <Audio
        src={staticFile("music.m4a")}
        volume={(f) =>
          interpolate(
            f,
            [0, fps * 0.6, durationInFrames - fps * 2.2, durationInFrames - 8],
            [0, 0.9, 0.9, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />

      <Series>
        <Series.Sequence durationInFrames={SCENES.intro}>
          {wrap(SCENES.intro, <Intro />)}
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.hook}>
          {wrap(SCENES.hook, <Hook />)}
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.agents}>
          {wrap(SCENES.agents, <Agents />)}
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.strategy}>
          {wrap(SCENES.strategy, <Strategy />)}
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.phone}>
          {wrap(SCENES.phone, <Phone />)}
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.brokers}>
          {wrap(SCENES.brokers, <Brokers />)}
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.signals}>
          {wrap(SCENES.signals, <Signals />)}
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.outro}>
          {wrap(SCENES.outro, <Outro durationInFrames={SCENES.outro} />)}
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
