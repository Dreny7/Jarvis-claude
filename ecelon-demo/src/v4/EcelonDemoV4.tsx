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

// Two-track score with a real transition on the flip:
// - "The Way" (driving section) under the crash, tape-stops into the slam —
//   the last beat of the track pitches down to zero (pre-rendered tapestop.wav),
//   a riser climbs underneath, and the boom lands ON the first orange frame
//   as "Highway to Hell" takes over.
const WAY_TRIM = Math.round(57.5 * 30);
const HTH_TRIM = 12; // ~0.4s — straight into the riff
const STOP_LEN = 24; // 0.8s tape-stop tail

const wayVolume = (f: number) =>
  interpolate(f, [0, 12, T.slam - STOP_LEN - 4, T.slam - STOP_LEN], [0, 0.85, 0.85, 0], {
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

/** Sleek UI sound layer for the modern half. */
const Sfx: React.FC = () => (
  <>
    {/* the flip: riser → tape-stop → boom */}
    <Sequence from={T.slam - 52} durationInFrames={56}>
      <Audio src={staticFile("sfx/riser.wav")} volume={(f) => interpolate(f, [0, 44, 52], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </Sequence>
    <Sequence from={T.slam - STOP_LEN} durationInFrames={STOP_LEN + 2}>
      <Audio src={staticFile("sfx/tapestop.wav")} volume={0.9} />
    </Sequence>
    <Sequence from={T.slam} durationInFrames={40}>
      <Audio src={staticFile("sfx/impact.wav")} volume={0.9} />
    </Sequence>

    {/* part 2 — sleek accents on every beat change */}
    <Sequence from={T.reveal} durationInFrames={20}>
      <Audio src={staticFile("sfx/whoosh.wav")} volume={0.5} />
    </Sequence>
    {[T.built, T.how1, T.how2, T.how3].map((f) => (
      <Sequence key={f} from={f} durationInFrames={8}>
        <Audio src={staticFile("sfx/pop.wav")} volume={0.55} />
      </Sequence>
    ))}
    {[T.p1, T.agents, T.p2, T.p4].map((f) => (
      <Sequence key={f} from={f} durationInFrames={12}>
        <Audio src={staticFile("sfx/swish.wav")} volume={0.5} />
      </Sequence>
    ))}
    <Sequence from={T.p3} durationInFrames={26}>
      <Audio src={staticFile("sfx/shimmer.wav")} volume={0.5} />
    </Sequence>
    <Sequence from={T.a5} durationInFrames={12}>
      <Audio src={staticFile("sfx/swish.wav")} volume={0.45} />
    </Sequence>
  </>
);

/** 3-frame luma flash + kick shake exactly on the slam. */
const SlamFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const d = frame - T.slam;
  if (d < 0 || d > 8) return null;
  const flash = interpolate(d, [0, 1, 4], [0.9, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ backgroundColor: "#FFF6EF", opacity: flash, pointerEvents: "none" }} />;
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

  // kick shake: 5-frame decaying jolt on the slam
  const d = frame - T.slam;
  const shake = d >= 0 && d < 6 ? Math.sin(d * 2.4) * (6 - d) * 1.6 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: V4.font }}>
      {/* overscan while shaking so the translate never exposes the root background */}
      <AbsoluteFill style={{ opacity: fadeOut, transform: shake ? `translate(${shake}px, ${-shake * 0.6}px) scale(1.015)` : undefined }}>
        <SceneStack />
        {vignette > 0 && <Vignette strength={vignette} />}
        {grain > 0 && <Grain intensity={grain} />}
      </AbsoluteFill>
      <SlamFlash />

      {/* crash score — driving section, tape-stopped into the slam */}
      <Sequence from={0} durationInFrames={T.slam}>
        <Audio src={staticFile("way.mp3")} trimBefore={WAY_TRIM} volume={wayVolume} />
      </Sequence>
      {/* the flip — riff from the first orange frame to the end */}
      <Sequence from={T.slam} durationInFrames={T.end - T.slam}>
        <Audio src={staticFile("hth.mp3")} trimBefore={HTH_TRIM} volume={hthVolume} />
      </Sequence>
      <Sfx />
    </AbsoluteFill>
  );
};
