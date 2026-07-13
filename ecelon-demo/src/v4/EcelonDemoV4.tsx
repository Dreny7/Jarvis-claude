import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import "./font";
import { V4 } from "./theme";
import { T } from "./timeline";
import { Grain, Vignette } from "./components/vfx";
import { Act1 } from "./scenes/Act1";
import { Intro } from "./scenes/Intro";
import { Act4 } from "./scenes/Act4";
import { Act5 } from "./scenes/Act5";

export const V4_TOTAL_FRAMES = T.end;

// Two-track score:
// - "The Way" DRIVING section (from ~57.5s into the track) under the crash,
//   hard-muted at the orange slam.
// - "Highway to Hell" kicks in exactly at the slam and carries to the end.
const WAY_TRIM = Math.round(57.5 * 30);
const HTH_TRIM = 12; // ~0.4s — straight into the riff

const wayVolume = (f: number) =>
  interpolate(f, [0, 12, T.slam - 10, T.slam - 2], [0, 0.85, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const hthVolume = (f: number) => {
  const g = f + T.slam;
  return interpolate(g, [T.slam, T.slam + 4, T.end - 70, T.end - 8], [0, 0.95, 0.95, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const SceneStack: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={T.slam}>
      <Act1 />
    </Sequence>
    <Intro />
    <Act4 />
    <Sequence from={T.a5} durationInFrames={T.end - T.a5}>
      <Act5 />
    </Sequence>
  </AbsoluteFill>
);

export const EcelonDemoV4: React.FC = () => {
  const frame = useCurrentFrame();

  // Act 1 carries its own aged treatment; modern acts get a subtle grade.
  const inArchive = frame < T.slam;
  const inOrange = frame >= T.slam && frame < T.built; // slam + reveal frames stay clean
  const grain = inArchive || inOrange ? 0 : 0.04;
  const vignette = inArchive || inOrange ? 0 : 0.45;
  const fadeOut = interpolate(frame, [T.end - 24, T.end - 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: V4.font }}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <SceneStack />
        {vignette > 0 && <Vignette strength={vignette} />}
        {grain > 0 && <Grain intensity={grain} />}
      </AbsoluteFill>

      {/* crash score — driving section, killed dead at the slam */}
      <Sequence from={0} durationInFrames={T.slam}>
        <Audio src={staticFile("way.mp3")} trimBefore={WAY_TRIM} volume={wayVolume} />
      </Sequence>
      {/* the flip — riff from the first orange frame to the end */}
      <Sequence from={T.slam} durationInFrames={T.end - T.slam}>
        <Audio src={staticFile("hth.mp3")} trimBefore={HTH_TRIM} volume={hthVolume} />
      </Sequence>
    </AbsoluteFill>
  );
};
