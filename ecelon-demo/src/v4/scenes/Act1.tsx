import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { V4 } from "../theme";
import { T, DUR } from "../timeline";
import { CountUp } from "../components/text";
import { AgedTV, Subtitle, BroadcastChrome, AlertBanner } from "../components/aged";
import {
  CrashChart,
  DivergeChart,
  NumberBoard,
  ForeclosureSigns,
  BankFacade,
  HousingChart,
  WireHeadlines,
  WealthToll,
} from "../components/crash";

// THE ARCHIVE — 31 seconds of recreated 2008 broadcast. Nine beats, each one
// pressing harder: origin → crash day → the board → the wires → who profited →
// who paid → the toll → the thesis. Subtitles carry the "reporter" voice.

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
  const zoom = 1 + frame * 0.0012; // slow creep — dread
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `scale(${zoom})` }}>
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
  const out = interpolate(frame, [DUR.c7 - 14, DUR.c7 - 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 140, opacity: out }}>
      <CountUp
        from={2_000_000}
        to={10_000_000}
        startFrame={6}
        durationFrames={40}
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
      {/* c1 — 2008. */}
      <Sequence from={T.c1} durationInFrames={DUR.c1}>
        <Cut dur={DUR.c1}>
          <Year />
          <Subtitle lines={["It started quietly."]} from={34} />
          <BroadcastChrome />
        </Cut>
      </Sequence>

      {/* c2 — the origin: housing rollover */}
      <Sequence from={T.c2} durationInFrames={DUR.c2}>
        <Cut dur={DUR.c2}>
          <HousingChart />
          <Subtitle
            lines={["The banks gambled trillions", "on mortgages built to fail."]}
            from={14}
            accentWord="fail."
          />
          <BroadcastChrome />
          <AlertBanner text="Housing market turns" from={6} />
        </Cut>
      </Sequence>

      {/* c3 — crash day: DOW −777.68 */}
      <Sequence from={T.c3} durationInFrames={DUR.c3}>
        <Cut dur={DUR.c3}>
          <BankFacade />
          <CrashChart label="DOW JONES" seed={4} />
          <Subtitle
            lines={["Then, in a single afternoon,", "it all came down."]}
            from={12}
            accentWord="down."
          />
          <BroadcastChrome />
          <AlertBanner text="Largest point drop in history" from={5} />
        </Cut>
      </Sequence>

      {/* c4 — the board: real prints, everything red-lining */}
      <Sequence from={T.c4} durationInFrames={DUR.c4}>
        <Cut dur={DUR.c4}>
          <NumberBoard />
          <Subtitle
            lines={["Names people trusted", "with their life savings — gone."]}
            from={14}
            accentWord="gone."
          />
          <BroadcastChrome />
          <AlertBanner text="Institutions fail overnight" from={4} />
        </Cut>
      </Sequence>

      {/* c5 — the wires: Lehman / AIG / bailout */}
      <Sequence from={T.c5} durationInFrames={DUR.c5}>
        <Cut dur={DUR.c5}>
          <WireHeadlines />
          <Subtitle
            lines={["The banks were bailed out.", "The people were not."]}
            from={48}
            accentWord="not."
          />
          <BroadcastChrome />
        </Cut>
      </Sequence>

      {/* c6 — who profited: the diverge */}
      <Sequence from={T.c6} durationInFrames={DUR.c6}>
        <Cut dur={DUR.c6}>
          <DivergeChart />
          <Subtitle
            lines={["The hedge funds saw it coming.", "Their algorithms made billions."]}
            from={14}
            accentWord="billions."
          />
          <BroadcastChrome />
        </Cut>
      </Sequence>

      {/* c7 — who paid: foreclosures */}
      <Sequence from={T.c7} durationInFrames={DUR.c7}>
        <Cut dur={DUR.c7}>
          <ForeclosureSigns />
          <CostToll />
          <Subtitle lines={["Ten million families paid for it."]} from={40} accentWord="paid" />
          <BroadcastChrome />
        </Cut>
      </Sequence>

      {/* c8 — the toll: $19.2T / 8.8M jobs */}
      <Sequence from={T.c8} durationInFrames={DUR.c8}>
        <Cut dur={DUR.c8}>
          <WealthToll />
          <Subtitle
            lines={["A lifetime of work,", "erased in a quarter."]}
            from={46}
            accentWord="erased"
          />
          <BroadcastChrome />
        </Cut>
      </Sequence>

      {/* c9 — the thesis */}
      <Sequence from={T.c9} durationInFrames={DUR.c9}>
        <Cut dur={DUR.c9}>
          <Edge />
        </Cut>
      </Sequence>
    </AgedTV>
  </AbsoluteFill>
);
