import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "./font";
import { V4 } from "./theme";
import { T } from "./timeline";
import { Grain, Vignette, Letterbox, useShake } from "./components/vfx";
import { Act1 } from "./scenes/Act1";
import { Act2 } from "./scenes/Act2";
import { Act3 } from "./scenes/Act3";
import { Act4 } from "./scenes/Act4";
import { Act5 } from "./scenes/Act5";

export const V4_TOTAL_FRAMES = T.end;

// SFX cue sheet (global frames). Sparse by design — cuts and hero beats only.
const WHOOSH: { at: number; vol: number }[] = [
  { at: T.a1b - 3, vol: 0.2 },
  { at: T.a1c - 3, vol: 0.2 },
  { at: T.a1d - 3, vol: 0.2 },
  { at: T.a2b - 3, vol: 0.34 },
  { at: T.a2c - 3, vol: 0.34 },
  { at: T.a2d - 3, vol: 0.36 },
  { at: T.a4a - 3, vol: 0.34 },
  { at: T.a4b - 3, vol: 0.32 },
  { at: T.a4c - 3, vol: 0.32 },
  { at: T.a4d - 3, vol: 0.32 },
  { at: T.a5 - 3, vol: 0.3 },
];
const IMPACTS: { at: number; vol: number }[] = [
  { at: T.a2a - 2, vol: 0.55 }, // music slam reinforcement
  { at: 513, vol: 0.5 }, // "billions."
  { at: T.a3Ignite - 2, vol: 0.55 }, // facet ignite
  { at: 1140, vol: 0.5 }, // NEVER ALLOWED lock
  { at: 1272, vol: 0.4 }, // 71% lands
  { at: 1588, vol: 0.45 }, // mark completes
];
const TICKS: { at: number; vol: number }[] = [
  // "2008." typewriter
  ...[10, 15, 20, 25, 30].map((at) => ({ at, vol: 0.3 })),
  // odometer ticking (Act 1d)
  ...Array.from({ length: 10 }, (_, i) => ({ at: T.a1d + 4 + i * 4, vol: 0.14 })),
  // facet locks (Act 5)
  ...Array.from({ length: 5 }, (_, i) => ({ at: T.a5 + 16 + i * 12, vol: 0.3 })),
];

const SHAKE_FRAMES = [515, 1142];

const musicVolume = (localF: number) => {
  // Sequence starts at T.a2a; global = localF + 360
  const g = localF + T.a2a;
  return interpolate(
    g,
    [T.a2a, T.a2a + 6, T.a3 - 6, T.a3 + 4, T.a3Ignite - 10, T.a3Ignite + 14, T.a5, 1770, 1850],
    [0.0, 0.72, 0.66, 0.07, 0.07, 0.6, 0.55, 0.5, 0.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};

const SceneStack: React.FC = () => {
  const { x, y } = useShake(SHAKE_FRAMES, 10);
  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px)` }}>
      <Act1 />
      <Act2 />
      <Sequence from={T.a3} durationInFrames={T.a4a - T.a3}>
        <Act3 />
      </Sequence>
      <Act4 />
      <Sequence from={T.a5} durationInFrames={T.end - T.a5}>
        <Act5 />
      </Sequence>
    </AbsoluteFill>
  );
};

export const EcelonDemoV4: React.FC = () => {
  const frame = useCurrentFrame();

  // grade: heavy doc grain → subtle product grain
  const grain = interpolate(frame, [0, T.a2a, T.a3, T.a4a], [0.11, 0.11, 0.07, 0.045], {
    extrapolateRight: "clamp",
  });
  const vignette = interpolate(frame, [0, T.a3, T.a4a], [0.8, 0.7, 0.5], {
    extrapolateRight: "clamp",
  });
  // letterbox retracts as the pivot resolves: documentary → product
  const retract = interpolate(frame, [T.a3Ignite, T.a3Ignite + 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [T.end - 26, T.end - 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: V4.font }}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <SceneStack />
        <Vignette strength={vignette} />
        <Grain intensity={grain} />
        <Letterbox retract={retract} />
      </AbsoluteFill>

      {/* ---- audio ---- */}
      {/* Act 1 room-tone drone (near-silence, not dead silence) */}
      <Sequence from={0} durationInFrames={T.a2a + 20}>
        <Audio src={staticFile("sfx/drone.wav")} volume={0.5} />
      </Sequence>
      {/* score enters at the reveal; trimBefore skips the track's silent first ~1s */}
      <Sequence from={T.a2a} durationInFrames={T.end - T.a2a}>
        <Audio src={staticFile("music.m4a")} trimBefore={32} volume={musicVolume} />
      </Sequence>
      {/* riser into the pivot cut */}
      <Sequence from={T.a2d + 22} durationInFrames={80}>
        <Audio src={staticFile("sfx/riser.wav")} volume={0.4} />
      </Sequence>
      {WHOOSH.map((s, i) => (
        <Sequence key={`w${i}`} from={s.at} durationInFrames={26}>
          <Audio src={staticFile("sfx/whoosh.wav")} volume={s.vol} />
        </Sequence>
      ))}
      {IMPACTS.map((s, i) => (
        <Sequence key={`i${i}`} from={s.at} durationInFrames={30}>
          <Audio src={staticFile("sfx/impact.wav")} volume={s.vol} />
        </Sequence>
      ))}
      {TICKS.map((s, i) => (
        <Sequence key={`t${i}`} from={s.at} durationInFrames={4}>
          <Audio src={staticFile("sfx/tick.wav")} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
