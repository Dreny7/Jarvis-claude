import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import "./font";
import { V4 } from "./theme";
import { T } from "./timeline";
import { Grain, Vignette } from "./components/vfx";
import { Act1 } from "./scenes/Act1";
import { Intro } from "./scenes/Intro";
import { Phone } from "./scenes/Phone";
import { Act4 } from "./scenes/Act4";
import { Act5 } from "./scenes/Act5";

export const V4_TOTAL_FRAMES = T.end;

// Two-track score with a real transition on the flip:
// the old TV literally powers off — the archive picture collapses to a hot
// white line, then a dot — while the crash track tape-stops underneath;
// chord 1 of "Highway to Hell" detonates ON the first neon frame.
const WAY_TRIM = Math.round(57.5 * 30);
const HTH_TRIM = 6; // measured: the first chord ATTACK lands exactly on the slam
const STOP_LEN = 24; // 0.8s tape-stop tail
const CRT_LEN = 14; // power-off collapse length

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

/** Sleek UI sound layer — every accent sits on a scene boundary (= an onset). */
const Sfx: React.FC = () => (
  <>
    {/* the flip: riser → tape-stop → boom on chord 1 */}
    <Sequence from={T.slam - 52} durationInFrames={56}>
      <Audio src={staticFile("sfx/riser.wav")} volume={(f) => interpolate(f, [0, 44, 52], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </Sequence>
    <Sequence from={T.slam - STOP_LEN} durationInFrames={STOP_LEN + 2}>
      <Audio src={staticFile("sfx/tapestop.wav")} volume={0.9} />
    </Sequence>
    <Sequence from={T.slam} durationInFrames={40}>
      <Audio src={staticFile("sfx/impact.wav")} volume={0.9} />
    </Sequence>

    {/* part 2 — sleek accents on every beat-locked boundary */}
    <Sequence from={T.reveal} durationInFrames={20}>
      <Audio src={staticFile("sfx/whoosh.wav")} volume={0.5} />
    </Sequence>
    {[T.built, T.punch, T.punch + 16, T.punch + 32].map((f) => (
      <Sequence key={f} from={f} durationInFrames={8}>
        <Audio src={staticFile("sfx/pop.wav")} volume={0.55} />
      </Sequence>
    ))}
    <Sequence from={T.phone} durationInFrames={20}>
      <Audio src={staticFile("sfx/whoosh.wav")} volume={0.6} />
    </Sequence>
    {[T.phone + 73, T.phone + 136, T.phone + 198].map((f) => (
      <Sequence key={f} from={f} durationInFrames={8}>
        <Audio src={staticFile("sfx/pop.wav")} volume={0.5} />
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

/** 3-frame luma flash exactly on the slam. */
const SlamFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const d = frame - T.slam;
  if (d < 0 || d > 8) return null;
  const flash = interpolate(d, [0, 1, 4], [0.9, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ backgroundColor: "#FFF6EF", opacity: flash, pointerEvents: "none" }} />;
};

/** The hot line of a CRT powering off — drawn over the collapsing picture. */
const CrtLine: React.FC = () => {
  const frame = useCurrentFrame();
  const d = frame - (T.slam - CRT_LEN);
  if (d < 0 || frame >= T.slam) return null;
  const collapse = interpolate(d, [0, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shrink = interpolate(d, [9, CRT_LEN - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const w = interpolate(shrink, [0, 1], [100, 0.6]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          width: `${w}%`,
          height: 4 - shrink * 1.5,
          backgroundColor: "#FFFFFF",
          opacity: collapse * 0.95,
          boxShadow: `0 0 ${26 + collapse * 30}px rgba(255,240,220,0.95), 0 0 90px rgba(255,140,60,0.5)`,
          borderRadius: 4,
        }}
      />
    </AbsoluteFill>
  );
};

const SceneStack: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={T.slam}>
      <Act1 />
    </Sequence>
    <Intro />
    <Phone />
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
  const inNeon = frame >= T.slam && frame < T.built; // neon frames stay clean
  const grain = inArchive || inNeon ? 0 : 0.04;
  const vignette = inArchive || inNeon ? 0 : 0.45;
  const fadeOut = interpolate(frame, [T.end - 24, T.end - 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CRT power-off: picture squashes to a line, brightens, dies
  const crtD = frame - (T.slam - CRT_LEN);
  const inCrt = crtD >= 0 && frame < T.slam;
  const crtY = inCrt ? interpolate(crtD, [0, 9], [1, 0.004], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const crtX = inCrt ? interpolate(crtD, [9, CRT_LEN - 1], [1, 0.01], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const crtBright = inCrt ? 1 + interpolate(crtD, [0, 9], [0, 2.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  // kick shake: 5-frame decaying jolt on the slam (overscanned)
  const d = frame - T.slam;
  const shake = d >= 0 && d < 6 ? Math.sin(d * 2.4) * (6 - d) * 1.6 : 0;

  const sceneTransform = inCrt
    ? `scaleY(${crtY}) scaleX(${crtX})`
    : shake
      ? `translate(${shake}px, ${-shake * 0.6}px) scale(1.015)`
      : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: V4.font }}>
      <AbsoluteFill
        style={{
          opacity: fadeOut,
          transform: sceneTransform,
          filter: crtBright > 1 ? `brightness(${crtBright})` : undefined,
        }}
      >
        <SceneStack />
        {vignette > 0 && <Vignette strength={vignette} />}
        {grain > 0 && <Grain intensity={grain} />}
      </AbsoluteFill>
      <CrtLine />
      <SlamFlash />

      {/* crash score — driving section, tape-stopped into the slam */}
      <Sequence from={0} durationInFrames={T.slam}>
        <Audio src={staticFile("way.mp3")} trimBefore={WAY_TRIM} volume={wayVolume} />
      </Sequence>
      {/* the flip — chord 1 attack ON the first neon frame */}
      <Sequence from={T.slam} durationInFrames={T.end - T.slam}>
        <Audio src={staticFile("hth.mp3")} trimBefore={HTH_TRIM} volume={hthVolume} />
      </Sequence>
      <Sfx />
    </AbsoluteFill>
  );
};
