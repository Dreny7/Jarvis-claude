import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import "./font";
import { V4 } from "./theme";
import { T } from "./timeline";
import { Grain, Vignette } from "./components/vfx";
import { Act1 } from "./scenes/Act1";
import { Act2 } from "./scenes/Act2";
import { Act4 } from "./scenes/Act4";
import { Act5 } from "./scenes/Act5";

export const V4_TOTAL_FRAMES = T.end;

// New single-track audio bed: "The Way" (user-supplied). The track has a ~17s
// ambient intro, so we start playback at its musical onset and let its natural
// build carry the crash → pivot → product → climax arc. No SFX, no other music.
const MUSIC_TRIM_FRAMES = 510; // ~17.0s in — where the track's build begins

const musicVolume = (f: number) =>
  interpolate(
    f,
    [0, 20, T.end - 60, T.end - 6],
    [0, 0.92, 0.92, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

const SceneStack: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={T.a1_year} durationInFrames={T.a2_system - T.a1_year}>
      <Act1 />
    </Sequence>
    <Act2 />
    <Act4 />
    <Sequence from={T.a5} durationInFrames={T.end - T.a5}>
      <Act5 />
    </Sequence>
  </AbsoluteFill>
);

export const EcelonDemoV4: React.FC = () => {
  const frame = useCurrentFrame();

  // Act 1 has its own aged treatment; grade the modern acts subtly.
  const inArchive = frame < T.a2_system;
  const grain = inArchive ? 0 : interpolate(frame, [T.a2_system, T.a4a], [0.06, 0.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vignette = inArchive ? 0 : interpolate(frame, [T.a2_system, T.a4a], [0.6, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [T.end - 26, T.end - 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: V4.font }}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <SceneStack />
        {!inArchive && <Vignette strength={vignette} />}
        {!inArchive && <Grain intensity={grain} />}
      </AbsoluteFill>

      <Audio src={staticFile("way.mp3")} trimBefore={MUSIC_TRIM_FRAMES} volume={musicVolume} />
    </AbsoluteFill>
  );
};
