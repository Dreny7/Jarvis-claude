import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import "../v4/font";
import { U } from "./theme";
import { Rays, GlowField, Grain } from "./components/kit";
import { PushIn, Tagline, Chip, Statement, TeaseWindow } from "./components/launch";
import { Dashboard } from "./scenes/Dashboard";
import { Ignite, Step3, Step4, Step5, Step6, Step7, Step8 } from "./scenes/Wizard";
import { AgentLogic, TradingGraph, Activity } from "./scenes/AgentDetail";
import { Consulting, Feed } from "./scenes/Features";
import { Outro } from "./scenes/Outro";

// Launch-video cut — hook-led, message-driven, dynamic. Reuses the faithful
// product screens + the 120bpm beat-synced score (drop lands at f795).
export const LAUNCH_TOTAL = 1320;

const L = {
  hook: 0, create: 120, describe: 190, risk: 330, capital: 390, ask: 450,
  review: 540, deployText: 645, deploy: 690,
  live: 795, track: 915, activity: 1035, consult: 1095, feed: 1170, cta: 1230, end: 1320,
} as const;

/* fade+scale cut wrapper for full scenes */
const Cut: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6, dur - 6, dur - 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
/* wizard step content over the shared rays — fade only */
const Step: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6, dur - 5, dur - 1], [0, 1, 1, 0.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/* ---- Hook ---- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const teaseIn = f > 62;
  const stmtOut = interpolate(f, [58, 70], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: U.bg }}>
      <GlowField intensity={1.3} />
      {f < 72 && (
        <AbsoluteFill style={{ opacity: stmtOut }}>
          <Statement lines={[{ text: "Trading agents" }, { text: "that answer to you.", o: true }]} delay={6} size={110} />
        </AbsoluteFill>
      )}
      {teaseIn && (
        <AbsoluteFill>
          <TeaseWindow x={30} y={40} rot={-6} delay={64}>
            <div style={{ fontFamily: U.font, fontWeight: 800, fontSize: 26, color: U.white }}>Nova</div>
            <div style={{ fontFamily: U.mono, fontSize: 14, color: U.text2, marginTop: 8 }}>RSI(14) &lt; 30 · long</div>
            <div style={{ marginTop: 14, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${U.orange}, transparent)` }} />
          </TeaseWindow>
          <TeaseWindow x={70} y={58} rot={5} delay={70}>
            <div style={{ fontFamily: U.font, fontWeight: 800, fontSize: 30, color: U.white }}>+2.32%</div>
            <div style={{ fontFamily: U.font, fontSize: 15, color: U.text2, marginTop: 6 }}>paper · this month</div>
          </TeaseWindow>
          <TeaseWindow x={50} y={48} rot={-2} delay={76}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: U.orange }} /><span style={{ fontFamily: U.font, fontWeight: 700, fontSize: 20, color: U.white }}>Deployed · live</span></div>
            <div style={{ fontFamily: U.font, fontSize: 15, color: U.text2, marginTop: 10 }}>Binance · Paper · Manual</div>
          </TeaseWindow>
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90 }}>
            <div style={{ fontFamily: U.font, fontWeight: 700, fontSize: 34, color: U.text2, opacity: interpolate(f, [84, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>This is Ecelon.</div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      <Grain opacity={0.04} />
    </AbsoluteFill>
  );
};

const Scenes: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: U.bg }}>
    <Sequence from={L.hook} durationInFrames={L.create - L.hook}><Cut dur={L.create - L.hook}><Hook /></Cut></Sequence>

    {/* shared rays behind the whole create flow */}
    <Sequence from={L.create} durationInFrames={L.live - L.create}><Rays /></Sequence>

    <Sequence from={L.create} durationInFrames={L.describe - L.create}><Step dur={L.describe - L.create}><Ignite /></Step></Sequence>

    <Sequence from={L.describe} durationInFrames={L.risk - L.describe}>
      <Step dur={L.risk - L.describe}><PushIn dur={L.risk - L.describe} from={1.05}><Step3 /></PushIn><Chip text="Plain-English strategy" /></Step>
    </Sequence>
    <Sequence from={L.risk} durationInFrames={L.capital - L.risk}>
      <Step dur={L.capital - L.risk}><Step4 /><Chip text="Risk it can't break" /></Step>
    </Sequence>
    <Sequence from={L.capital} durationInFrames={L.ask - L.capital}>
      <Step dur={L.ask - L.capital}><Step5 /><Chip text="Your capital, your rules" /></Step>
    </Sequence>
    <Sequence from={L.ask} durationInFrames={L.review - L.ask}>
      <Step dur={L.review - L.ask}><Step7 /><Chip text="It reasons with you" /></Step>
    </Sequence>
    <Sequence from={L.review} durationInFrames={L.deployText - L.review}>
      <Step dur={L.deployText - L.review}><Step6 /><Chip text="Review before it runs" /></Step>
    </Sequence>
    <Sequence from={L.deployText} durationInFrames={L.deploy - L.deployText}><Step dur={L.deploy - L.deployText}><Statement lines={[{ text: "Then " }, { text: "deploy.", o: true }]} delay={4} size={100} /></Step></Sequence>
    <Sequence from={L.deploy} durationInFrames={L.live - L.deploy}><Step dur={L.live - L.deploy}><Step8 /></Step></Sequence>

    {/* it's alive — the drop */}
    <Sequence from={L.live} durationInFrames={L.track - L.live}><Cut dur={L.track - L.live}><PushIn dur={L.track - L.live}><AgentLogic /></PushIn><Tagline text="Now it's {o:live}." delay={10} /></Cut></Sequence>
    <Sequence from={L.track} durationInFrames={L.activity - L.track}><Cut dur={L.activity - L.track}><PushIn dur={L.activity - L.track}><TradingGraph /></PushIn><Tagline text="{o:71%} win rate. Broker-verified." delay={10} /></Cut></Sequence>
    <Sequence from={L.activity} durationInFrames={L.consult - L.activity}><Cut dur={L.consult - L.activity}><PushIn dur={L.consult - L.activity}><Activity /></PushIn><Tagline text="Every decision, {o:logged}." delay={8} /></Cut></Sequence>
    <Sequence from={L.consult} durationInFrames={L.feed - L.consult}><Cut dur={L.feed - L.consult}><PushIn dur={L.feed - L.consult}><Consulting /></PushIn><Tagline text="Ask anything. {o:Anytime}." delay={8} /></Cut></Sequence>
    <Sequence from={L.feed} durationInFrames={L.cta - L.feed}><Cut dur={L.cta - L.feed}><PushIn dur={L.cta - L.feed}><Feed /></PushIn><Tagline text="Share your {o:edge}." delay={8} /></Cut></Sequence>

    <Sequence from={L.cta} durationInFrames={L.end - L.cta}><Cut dur={L.end - L.cta}><Outro /></Cut></Sequence>
  </AbsoluteFill>
);

const Wipe: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const d = f - at;
  if (d < 0 || d > 12) return null;
  const w = interpolate(d, [0, 6, 12], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ pointerEvents: "none", backgroundColor: U.orange, clipPath: `polygon(0 0, ${w * 110}% 0, ${w * 110 - 14}% 100%, 0 100%)`, opacity: 0.9 }} />;
};

const cut = (from: number, vol = 0.42) => (
  <Sequence key={`sw${from}`} from={from - 3} durationInFrames={14}><Audio src={staticFile("ui/swipe.wav")} volume={vol} /></Sequence>
);
const keys = (from: number, to: number) => {
  const out: React.ReactNode[] = [];
  for (let f = from; f < to; f += 3) out.push(<Sequence key={`k${f}`} from={f} durationInFrames={4}><Audio src={staticFile("ui/key.wav")} volume={0.33} /></Sequence>);
  return out;
};

const Sound: React.FC = () => (
  <>
    <Audio src={staticFile("ui/music.wav")} volume={(f) => interpolate(f, [0, 20, L.end - 40, L.end - 4], [0, 0.72, 0.72, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    {[L.create, L.describe, L.risk, L.capital, L.ask, L.review, L.deployText, L.deploy, L.live, L.track, L.activity, L.consult, L.feed, L.cta].map((x) => cut(x))}
    <Sequence from={L.risk + 10} durationInFrames={8}><Audio src={staticFile("ui/select.wav")} volume={0.5} /></Sequence>
    {keys(L.describe + 22, L.describe + 92)}
    {keys(L.capital + 8, L.capital + 42)}
    {keys(L.cta + 6, L.cta + 22)}
    <Sequence from={L.deploy + 86} durationInFrames={30}><Audio src={staticFile("ui/deploy.wav")} volume={0.75} /></Sequence>
    <Sequence from={L.live - 46} durationInFrames={48}><Audio src={staticFile("sfx/riser.wav")} volume={0.55} /></Sequence>
    <Sequence from={L.live} durationInFrames={30}><Audio src={staticFile("sfx/impact.wav")} volume={0.65} /></Sequence>
    <Sequence from={L.track + 72} durationInFrames={26}><Audio src={staticFile("sfx/shimmer.wav")} volume={0.5} /></Sequence>
    <Sequence from={L.cta + 50} durationInFrames={30}><Audio src={staticFile("ui/chime.wav")} volume={0.5} /></Sequence>
  </>
);

export const EcelonLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [L.end - 20, L.end - 3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: U.font }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <Scenes />
        <Wipe at={L.create} />
        <Wipe at={L.live} />
      </AbsoluteFill>
      <Sound />
    </AbsoluteFill>
  );
};
