import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import "../v4/font";
import { U } from "./theme";
import { S, D } from "./timeline";
import { Rays } from "./components/kit";
import { Dashboard } from "./scenes/Dashboard";
import { Ignite, Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8 } from "./scenes/Wizard";
import { AgentLogic, TradingGraph, Activity } from "./scenes/AgentDetail";
import { Consulting, Feed } from "./scenes/Features";
import { Outro } from "./scenes/Outro";

export const UI_TOTAL = S.end;

/** Fade+scale in/out for full chrome scenes. */
const Cut: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6, dur - 6, dur - 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sc = interpolate(f, [0, 8], [1.015, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${sc})` }}>{children}</AbsoluteFill>;
};

/** Fade-in only for wizard step content over the shared rays. */
const Step: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6, dur - 5, dur - 1], [0, 1, 1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Scenes: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: U.bg }}>
    <Sequence from={S.dashboard} durationInFrames={D.dashboard}><Cut dur={D.dashboard}><Dashboard /></Cut></Sequence>

    {/* wizard — one continuous ray backdrop under all steps */}
    <Sequence from={S.ignite} durationInFrames={S.logic - S.ignite}><Rays /></Sequence>
    <Sequence from={S.ignite} durationInFrames={D.ignite}><Step dur={D.ignite}><Ignite /></Step></Sequence>
    <Sequence from={S.s1} durationInFrames={D.s1}><Step dur={D.s1}><Step1 /></Step></Sequence>
    <Sequence from={S.s2} durationInFrames={D.s2}><Step dur={D.s2}><Step2 /></Step></Sequence>
    <Sequence from={S.s3} durationInFrames={D.s3}><Step dur={D.s3}><Step3 /></Step></Sequence>
    <Sequence from={S.s4} durationInFrames={D.s4}><Step dur={D.s4}><Step4 /></Step></Sequence>
    <Sequence from={S.s5} durationInFrames={D.s5}><Step dur={D.s5}><Step5 /></Step></Sequence>
    <Sequence from={S.s6} durationInFrames={D.s6}><Step dur={D.s6}><Step6 /></Step></Sequence>
    <Sequence from={S.s7} durationInFrames={D.s7}><Step dur={D.s7}><Step7 /></Step></Sequence>
    <Sequence from={S.s8} durationInFrames={D.s8}><Step dur={D.s8}><Step8 /></Step></Sequence>

    <Sequence from={S.logic} durationInFrames={D.logic}><Cut dur={D.logic}><AgentLogic /></Cut></Sequence>
    <Sequence from={S.graph} durationInFrames={D.graph}><Cut dur={D.graph}><TradingGraph /></Cut></Sequence>
    <Sequence from={S.activity} durationInFrames={D.activity}><Cut dur={D.activity}><Activity /></Cut></Sequence>
    <Sequence from={S.consult} durationInFrames={D.consult}><Cut dur={D.consult}><Consulting /></Cut></Sequence>
    <Sequence from={S.feed} durationInFrames={D.feed}><Cut dur={D.feed}><Feed /></Cut></Sequence>
    <Sequence from={S.outro} durationInFrames={D.outro}><Cut dur={D.outro}><Outro /></Cut></Sequence>
  </AbsoluteFill>
);

/* orange wipe at the two big beats (ignite + the drop) */
const Wipe: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const d = f - at;
  if (d < 0 || d > 12) return null;
  const w = interpolate(d, [0, 6, 12], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ pointerEvents: "none", backgroundColor: U.orange, clipPath: `polygon(0 0, ${w * 110}% 0, ${w * 110 - 14}% 100%, 0 100%)`, opacity: 0.9 }} />;
};

const cut = (from: number, vol = 0.45) => (
  <Sequence key={`sw${from}`} from={from - 3} durationInFrames={14}><Audio src={staticFile("ui/swipe.wav")} volume={vol} /></Sequence>
);
const keys = (from: number, to: number) => {
  const out: React.ReactNode[] = [];
  for (let f = from; f < to; f += 3) out.push(<Sequence key={`k${f}`} from={f} durationInFrames={4}><Audio src={staticFile("ui/key.wav")} volume={0.35} /></Sequence>);
  return out;
};

const Sound: React.FC = () => (
  <>
    {/* music bed */}
    <Audio src={staticFile("ui/music.wav")} volume={(f) => interpolate(f, [0, 20, S.end - 40, S.end - 4], [0, 0.72, 0.72, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

    {/* scene swishes */}
    {[S.ignite, S.s1, S.s2, S.s3, S.s4, S.s5, S.s6, S.s7, S.s8, S.logic, S.graph, S.activity, S.consult, S.feed, S.outro].map((x) => cut(x))}

    {/* selects */}
    <Sequence from={S.s1 + 10} durationInFrames={8}><Audio src={staticFile("ui/select.wav")} volume={0.5} /></Sequence>
    <Sequence from={S.s4 + 10} durationInFrames={8}><Audio src={staticFile("ui/select.wav")} volume={0.5} /></Sequence>

    {/* typing */}
    {keys(S.s2 + 12, S.s2 + 55)}
    {keys(S.s3 + 20, S.s3 + 95)}
    {keys(S.s5 + 8, S.s5 + 40)}
    {keys(S.outro + 6, S.outro + 22)}

    {/* deploy bloom */}
    <Sequence from={S.s8 + 86} durationInFrames={30}><Audio src={staticFile("ui/deploy.wav")} volume={0.7} /></Sequence>

    {/* the drop: riser -> impact into agent-alive */}
    <Sequence from={S.logic - 45} durationInFrames={48}><Audio src={staticFile("sfx/riser.wav")} volume={0.5} /></Sequence>
    <Sequence from={S.logic} durationInFrames={30}><Audio src={staticFile("sfx/impact.wav")} volume={0.6} /></Sequence>

    {/* shimmer on win-rate + final chime */}
    <Sequence from={S.graph + 72} durationInFrames={26}><Audio src={staticFile("sfx/shimmer.wav")} volume={0.5} /></Sequence>
    <Sequence from={S.outro + 50} durationInFrames={30}><Audio src={staticFile("ui/chime.wav")} volume={0.5} /></Sequence>
  </>
);

export const EcelonUI: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [S.end - 20, S.end - 3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: U.font }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <Scenes />
        <Wipe at={S.ignite} />
        <Wipe at={S.logic} />
      </AbsoluteFill>
      <Sound />
    </AbsoluteFill>
  );
};
