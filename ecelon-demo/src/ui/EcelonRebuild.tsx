import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import "../v4/font";
import { U } from "./theme";
import { Rays } from "./components/kit";
import { Tagline, Statement } from "./components/launch";
import { ProblemChart, TensionCards, BrandReveal, Connections } from "./scenes/rebuild";
import { Step3, Step4, Step5, Step6, Step7, Step8 } from "./scenes/Wizard";
import { AgentLogic, TradingGraph, Activity } from "./scenes/AgentDetail";
import { Consulting, Feed } from "./scenes/Features";
import { Dashboard } from "./scenes/Dashboard";
import { Outro } from "./scenes/Outro";

// Built to CODEX-REBUILD-BRIEF.md. Problem-led 14-scene launch film, ~43s,
// 30fps, 1920x1080. Hard cuts on the 120bpm beat — sequences are back-to-back
// and never overlap, so two full layouts are never on screen at once. Every
// scene enters with a directional push/scale (no cross-dissolve). No VO.
export const REBUILD_TOTAL = 1290;

const R = {
  problem: 0, tension: 90, brand: 180, describe: 270, risk: 360, capital: 420,
  reason: 480, deploy: 540, alive: 630, activity: 720, custody: 810,
  ecosystem: 900, ecoFeed: 945, payoff: 990, cta: 1110, end: 1290,
} as const;

/** Directional entrance wrapper — slide/scale in, hard cut out (no fade-out
 *  overlap). dir: 'up' | 'left' | 'scale'. */
const In: React.FC<{ dir?: "up" | "left" | "scale"; children: React.ReactNode }> = ({ dir = "up", children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(f, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t = dir === "left" ? `translateX(${(1 - p) * 60}px)` : dir === "scale" ? `scale(${0.985 + p * 0.015})` : `translateY(${(1 - p) * 30}px)`;
  return <AbsoluteFill style={{ opacity: o, transform: t }}>{children}</AbsoluteFill>;
};

const Scenes: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: U.bg }}>
    {/* ACT 1 — PROBLEM */}
    <Sequence from={R.problem} durationInFrames={R.tension - R.problem}><In dir="scale"><ProblemChart /></In><Tagline text="Your best trades happen while you're {o:asleep}." delay={16} /></Sequence>
    <Sequence from={R.tension} durationInFrames={R.brand - R.tension}><In><TensionCards /></In><Tagline text="Bots you can't see inside. Bots that {o:hold your money}." delay={16} /></Sequence>

    {/* ACT 2 — PROMISE + BUILD (shared rays under the wizard) */}
    <Sequence from={R.brand} durationInFrames={R.brand + 90 - R.brand}><In dir="scale"><BrandReveal /></In></Sequence>
    <Sequence from={R.describe} durationInFrames={R.reason - R.describe}><Rays /></Sequence>
    <Sequence from={R.describe} durationInFrames={R.risk - R.describe}><In dir="left"><Step3 /></In><Tagline text="Just describe it in {o:plain English}." delay={8} /></Sequence>
    <Sequence from={R.risk} durationInFrames={R.capital - R.risk}><In dir="left"><Step4 /></In><Tagline text="Set the {o:guardrails}." delay={6} /></Sequence>
    <Sequence from={R.capital} durationInFrames={R.reason - R.capital}><In dir="left"><Step5 /></In><Tagline text="Ten thousand in paper. {o:Your rules}." delay={6} /></Sequence>
    <Sequence from={R.reason} durationInFrames={R.deploy - R.reason}><Rays /><In dir="left"><Step7 /></In><Tagline text="It asks the questions you'd {o:forget to}." delay={8} /></Sequence>
    <Sequence from={R.deploy} durationInFrames={R.alive - R.deploy}><Rays /><In dir="scale"><Step8 /></In></Sequence>

    {/* ACT 3 — PROOF */}
    <Sequence from={R.alive} durationInFrames={R.activity - R.alive}><In dir="scale"><TradingGraph /></In><Tagline text="Now it trades live prices — in {o:paper}." delay={10} /></Sequence>
    <Sequence from={R.activity} durationInFrames={R.custody - R.activity}><In><Activity /></In><Tagline text="It explains every decision — even when it does {o:nothing}." delay={8} /></Sequence>
    <Sequence from={R.custody} durationInFrames={R.ecosystem - R.custody}><In dir="left"><Connections /></In><Tagline text="Your venue. Your funds. {o:Always}." delay={8} /></Sequence>
    <Sequence from={R.ecosystem} durationInFrames={R.ecoFeed - R.ecosystem}><In dir="scale"><AgentLogic /></In><Tagline text="See how it {o:thinks}." delay={6} /></Sequence>
    <Sequence from={R.ecoFeed} durationInFrames={R.payoff - R.ecoFeed}><In dir="left"><Feed /></In><Tagline text="Learn from {o:other agents}." delay={6} /></Sequence>

    {/* ACT 4 — PAYOFF + CTA */}
    <Sequence from={R.payoff} durationInFrames={R.cta - R.payoff}><In dir="scale"><Dashboard /></In><Tagline text="This is your {o:desk} now." delay={12} /></Sequence>
    <Sequence from={R.cta} durationInFrames={R.end - R.cta}><In dir="scale"><Outro /></In></Sequence>
  </AbsoluteFill>
);

/* single-frame luma flashes at the two act-turns (brand hit + CTA hit) */
const Flash: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const d = f - at;
  if (d < 0 || d > 6) return null;
  const o = interpolate(d, [0, 1, 6], [0.55, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ backgroundColor: "#FFF6EF", opacity: o, pointerEvents: "none" }} />;
};

const cut = (from: number, v = 0.4) => (
  <Sequence key={`sw${from}`} from={from - 3} durationInFrames={14}><Audio src={staticFile("ui/swipe.wav")} volume={v} /></Sequence>
);
const keys = (from: number, to: number) => {
  const out: React.ReactNode[] = [];
  for (let f = from; f < to; f += 3) out.push(<Sequence key={`k${f}`} from={f} durationInFrames={4}><Audio src={staticFile("ui/key.wav")} volume={0.32} /></Sequence>);
  return out;
};

const Sound: React.FC = () => (
  <>
    <Audio src={staticFile("ui/music_rebuild.wav")} volume={(f) => interpolate(f, [0, 16, R.end - 30, R.end - 3], [0, 0.74, 0.74, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    {[R.tension, R.brand, R.describe, R.risk, R.capital, R.reason, R.deploy, R.alive, R.activity, R.custody, R.ecosystem, R.ecoFeed, R.payoff, R.cta].map((x) => cut(x))}
    {/* brand + CTA impacts reinforce the two big hits */}
    <Sequence from={R.brand} durationInFrames={30}><Audio src={staticFile("sfx/impact.wav")} volume={0.6} /></Sequence>
    <Sequence from={R.cta} durationInFrames={30}><Audio src={staticFile("sfx/impact.wav")} volume={0.65} /></Sequence>
    <Sequence from={R.payoff} durationInFrames={60}><Audio src={staticFile("sfx/riser.wav")} volume={0.5} /></Sequence>
    {/* typing */}
    {keys(R.describe + 22, R.describe + 88)}
    {keys(R.capital + 8, R.capital + 40)}
    {keys(R.reason + 30, R.reason + 55)}
    {keys(R.cta + 8, R.cta + 24)}
    {/* select on risk pill, deploy bloom+chime, shimmer on win-rate */}
    <Sequence from={R.risk + 10} durationInFrames={8}><Audio src={staticFile("ui/select.wav")} volume={0.5} /></Sequence>
    <Sequence from={R.deploy + 64} durationInFrames={30}><Audio src={staticFile("ui/deploy.wav")} volume={0.75} /></Sequence>
    <Sequence from={R.alive + 66} durationInFrames={26}><Audio src={staticFile("sfx/shimmer.wav")} volume={0.45} /></Sequence>
    <Sequence from={R.cta + 50} durationInFrames={30}><Audio src={staticFile("ui/chime.wav")} volume={0.5} /></Sequence>
  </>
);

export const EcelonRebuild: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [R.end - 18, R.end - 3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: U.font }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <Scenes />
        <Flash at={R.brand} />
        <Flash at={R.cta} />
      </AbsoluteFill>
      <Sound />
    </AbsoluteFill>
  );
};
