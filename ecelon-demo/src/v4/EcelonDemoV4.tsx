import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import "./font";
import { V4 } from "./theme";
import { T } from "./timeline";
import { Grain, Vignette } from "./components/vfx";
import { SFX_CUES } from "./config/audioCues";
import { Act1 } from "./scenes/Act1";
import { Intro } from "./scenes/Intro";
import { Phone } from "./scenes/Phone";
import { Act4 } from "./scenes/Act4";
import { Act5 } from "./scenes/Act5";

export const V4_TOTAL_FRAMES = T.end;

// The pivot (§4 of the v5 brief): the archive powers off across a full 34
// frames — picture collapses to a line, then the line shrinks to a dot
// through TRUE SILENCE (dead air, no score, no drone, no SFX) — and only
// then does the sub-boom + chord 1 of "Highway to Hell" detonate, exactly
// on the first neon frame. Silence-then-detonation is the whole point.
const WAY_TRIM = Math.round(57.5 * 30);
const HTH_TRIM = 6; // measured: the first chord ATTACK lands exactly on the slam
const CRT_LEN = 34; // power-off runs the full pivot window
const SILENCE_FROM = 14; // last 14 frames before the slam are dead air

const wayVolume = (f: number) =>
  interpolate(f, [0, 12, T.slam - 34 - 8, T.slam - 34], [0, 0.85, 0.85, 0], {
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

/** Every one-shot SFX cue, read straight from the editable config array. */
const Sfx: React.FC = () => (
  <>
    {SFX_CUES.map((cue) => (
      <Sequence key={cue.label} from={cue.from} durationInFrames={cue.duration}>
        <Audio src={staticFile(cue.src)} volume={cue.volume} />
      </Sequence>
    ))}
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

/** The hot line of a CRT powering off — collapses to a line, then a dot. */
const CrtLine: React.FC = () => {
  const frame = useCurrentFrame();
  const d = frame - (T.slam - CRT_LEN);
  if (d < 0 || frame >= T.slam) return null;
  const toLine = interpolate(d, [0, CRT_LEN - SILENCE_FROM], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const toDot = interpolate(d, [CRT_LEN - SILENCE_FROM, CRT_LEN - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const w = interpolate(toDot, [0, 1], [100, 0.6]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          width: `${w}%`,
          height: 4 - toDot * 1.5,
          backgroundColor: "#FFFFFF",
          opacity: toLine * 0.95,
          boxShadow: `0 0 ${26 + toLine * 30}px rgba(255,240,220,0.95), 0 0 90px rgba(255,140,60,0.5)`,
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
  // grain doubles as the anti-banding dither (§2A) — always on, tuned per act:
  // heavier + fast-reseeding "film" grain in the archive, fine + slow
  // "digital" grain in the modern half, off during the flat neon beats.
  const grain = inNeon ? 0 : inArchive ? 0.065 : 0.035;
  const grainAnimate = inArchive;
  const vignette = inArchive || inNeon ? 0 : 0.45;
  const fadeOut = interpolate(frame, [T.end - 24, T.end - 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CRT power-off: picture squashes to a line, brightens, dies
  const crtD = frame - (T.slam - CRT_LEN);
  const inCrt = crtD >= 0 && frame < T.slam;
  const crtY = inCrt
    ? interpolate(crtD, [0, CRT_LEN - SILENCE_FROM], [1, 0.004], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const crtX = inCrt
    ? interpolate(crtD, [CRT_LEN - SILENCE_FROM, CRT_LEN - 2], [1, 0.01], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const crtBright = inCrt
    ? 1 + interpolate(crtD, [0, CRT_LEN - SILENCE_FROM], [0, 2.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

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
        {grain > 0 && <Grain intensity={grain} animate={grainAnimate} />}
      </AbsoluteFill>
      <CrtLine />
      <SlamFlash />

      {/* crash score — driving section, fades out as the tape-stop takes over */}
      <Sequence from={0} durationInFrames={T.slam}>
        <Audio src={staticFile("way.mp3")} trimBefore={WAY_TRIM} volume={wayVolume} />
      </Sequence>
      {/* original low drone + sparse motif — the Act I "ache" layer (see ASSETS_README) */}
      <Sequence from={0} durationInFrames={T.slam}>
        <Audio src={staticFile("sfx/act1_ache.wav")} volume={1} />
      </Sequence>
      {/* the flip — chord 1 attack ON the first neon frame */}
      <Sequence from={T.slam} durationInFrames={T.end - T.slam}>
        <Audio src={staticFile("hth.mp3")} trimBefore={HTH_TRIM} volume={hthVolume} />
      </Sequence>
      <Sfx />
    </AbsoluteFill>
  );
};
