import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { V4 } from "../theme";
import { T, DUR } from "../timeline";
import { CountUp } from "../components/text";
import { AgedTV, Subtitle, BroadcastChrome, AlertBanner } from "../components/aged";
import { CrashChart, DivergeChart, NumberBoard, ForeclosureSigns, BankFacade } from "../components/crash";

// ACT 1 — THE ARCHIVE. A recreated 2008 news broadcast (original graphics,
// aged-tape treatment). Subtitles carry the story: the banks caused it, were
// bailed out, the hedge funds profited, and the people paid.

const FadeCut: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 6, dur - 7, dur - 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/** 1a — "2008." over tape static. */
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

export const Act1: React.FC = () => {
  return (
    <AbsoluteFill>
      <AgedTV amount={1}>
        <Sequence from={T.a1_year} durationInFrames={DUR.a1_year}>
          <FadeCut dur={DUR.a1_year}>
            <Year />
          </FadeCut>
        </Sequence>

        <Sequence from={T.a1_banks} durationInFrames={DUR.a1_banks}>
          <FadeCut dur={DUR.a1_banks}>
            <BankFacade />
            <CrashChart label="DOW JONES" seed={4} />
            <BroadcastChrome />
            <AlertBanner text="Global markets in freefall" from={10} />
            <Subtitle lines={["The banks gambled trillions", "on mortgages built to fail."]} from={14} accentWord="fail." />
          </FadeCut>
        </Sequence>

        <Sequence from={T.a1_bailout} durationInFrames={DUR.a1_bailout}>
          <FadeCut dur={DUR.a1_bailout}>
            <NumberBoard />
            <BroadcastChrome />
            <AlertBanner text="Institutions collapse overnight" from={8} />
            <Subtitle lines={["When it all came crashing down,", "the banks were bailed out."]} from={12} accentWord="bailed out." />
          </FadeCut>
        </Sequence>

        <Sequence from={T.a1_funds} durationInFrames={DUR.a1_funds}>
          <FadeCut dur={DUR.a1_funds}>
            <DivergeChart />
            <BroadcastChrome />
            <Subtitle lines={["The hedge funds saw it coming —", "and made billions betting against everyone."]} from={12} accentWord="billions" />
          </FadeCut>
        </Sequence>

        <Sequence from={T.a1_cost} durationInFrames={DUR.a1_cost}>
          <FadeCut dur={DUR.a1_cost}>
            <ForeclosureSigns />
            <BroadcastChrome />
            <CostToll />
            <Subtitle lines={["Ten million families lost everything.", "They paid for a game they were never in."]} from={44} accentWord="never in." />
          </FadeCut>
        </Sequence>
      </AgedTV>
    </AbsoluteFill>
  );
};

/** The homes-lost counter, held, over the foreclosure row. */
const CostToll: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [36, 44], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 150, opacity: out }}>
      <CountUp
        from={2_000_000}
        to={10_000_000}
        startFrame={4}
        durationFrames={30}
        style={{ fontSize: 128, fontWeight: 800, color: "#EDE7DB", letterSpacing: "-0.02em" }}
      />
      <div style={{ fontFamily: V4.font, fontSize: 30, color: "rgba(231,199,154,0.7)", letterSpacing: "0.16em", marginTop: 8 }}>
        HOMES LOST
      </div>
    </AbsoluteFill>
  );
};
