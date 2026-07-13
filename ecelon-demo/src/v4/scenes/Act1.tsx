import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { V4 } from "../theme";
import { T, DUR } from "../timeline";
import { CountUp } from "../components/text";
import { AgedTV, Subtitle, BroadcastChrome, AlertBanner } from "../components/aged";
import { CrashChart, DivergeChart, NumberBoard, ForeclosureSigns, BankFacade } from "../components/crash";

// THE ARCHIVE — recreated 2008 broadcast, fast cuts, real prints.
// Runs under the driving section of the score; hard-cuts to the orange slam.

const Cut: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  // near-hard cuts: 3-frame in, 3-frame out
  const o = interpolate(frame, [0, 3, dur - 4, dur - 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Year: React.FC = () => {
  const frame = useCurrentFrame();
  const flick = 0.6 + 0.4 * Math.abs(Math.sin(frame / 3));
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: V4.font, fontWeight: 800, fontSize: 150, letterSpacing: "0.02em", color: "#EDE7DB", opacity: flick }}>
        2008.
      </div>
      <div style={{ position: "absolute", bottom: 300, fontFamily: V4.mono, fontSize: 26, letterSpacing: 6, color: "rgba(231,199,154,0.6)" }}>
        THE COLLAPSE
      </div>
    </AbsoluteFill>
  );
};

/** Final crash beat: the thesis line, dark, still aged. */
const Edge: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#080706", justifyContent: "center", alignItems: "center" }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: V4.font, fontWeight: 600, fontSize: 58, color: "rgba(237,231,219,0.75)" }}>
        For decades, the edge
      </div>
      <div style={{ fontFamily: V4.font, fontWeight: 800, fontSize: 86, color: "#EDE7DB", marginTop: 10 }}>
        belonged to <span style={{ color: V4.orange }}>them.</span>
      </div>
    </div>
  </AbsoluteFill>
);

const CostToll: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [58, 66], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 140, opacity: out }}>
      <CountUp
        from={2_000_000}
        to={10_000_000}
        startFrame={3}
        durationFrames={26}
        style={{ fontSize: 124, fontWeight: 800, color: "#EDE7DB", letterSpacing: "-0.02em" }}
      />
      <div style={{ fontFamily: V4.font, fontSize: 30, color: "rgba(231,199,154,0.7)", letterSpacing: "0.16em", marginTop: 8 }}>
        HOMES LOST
      </div>
    </AbsoluteFill>
  );
};

export const Act1: React.FC = () => (
  <AbsoluteFill>
    <AgedTV amount={1}>
      <Sequence from={T.c1} durationInFrames={DUR.c1}>
        <Cut dur={DUR.c1}>
          <Year />
        </Cut>
      </Sequence>

      <Sequence from={T.c2} durationInFrames={DUR.c2}>
        <Cut dur={DUR.c2}>
          <BankFacade />
          <CrashChart label="DOW JONES" seed={4} />
          <Subtitle lines={["The banks gambled trillions", "on mortgages built to fail."]} from={8} accentWord="fail." />
          <BroadcastChrome />
          <AlertBanner text="Global markets in freefall" from={5} />
        </Cut>
      </Sequence>

      <Sequence from={T.c3} durationInFrames={DUR.c3}>
        <Cut dur={DUR.c3}>
          <NumberBoard />
          <Subtitle lines={["When it collapsed —", "the banks were bailed out."]} from={8} accentWord="bailed out." />
          <BroadcastChrome />
          <AlertBanner text="Institutions fail overnight" from={4} />
        </Cut>
      </Sequence>

      <Sequence from={T.c4} durationInFrames={DUR.c4}>
        <Cut dur={DUR.c4}>
          <DivergeChart />
          <Subtitle lines={["The hedge funds made billions", "betting against everyone else."]} from={8} accentWord="billions" />
          <BroadcastChrome />
        </Cut>
      </Sequence>

      <Sequence from={T.c5} durationInFrames={DUR.c5}>
        <Cut dur={DUR.c5}>
          <ForeclosureSigns />
          <CostToll />
          <Subtitle lines={["Ten million families paid for it."]} from={30} accentWord="paid" />
          <BroadcastChrome />
        </Cut>
      </Sequence>

      <Sequence from={T.c6} durationInFrames={DUR.c6}>
        <Cut dur={DUR.c6}>
          <Edge />
        </Cut>
      </Sequence>
    </AgedTV>
  </AbsoluteFill>
);
