import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
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
import { FOOTAGE_SLOTS } from "../config/footage";

// THE ARCHIVE — 33 seconds of recreated 2008 broadcast, a grief piece before
// the drop. Nine beats, each pressing harder: origin → crash day → the board
// → the wires → who profited → who paid → the toll → the thesis. Subtitles
// carry the "reporter" voice; the heaviest beats hold longer and reveal
// word-by-word rather than snapping in.

const Cut: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  // near-hard cuts: 3-frame in, 3-frame out
  const o = interpolate(frame, [0, 3, dur - 4, dur - 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/**
 * A cleared clip dropped into public/archival/ + wired in config/footage.ts —
 * renders behind the existing graphics with the archival grade (desaturated,
 * warm, soft) and a slow Ken Burns push/pull. Renders nothing when the slot
 * has no `src`, which is the shipped default — see ASSETS_README.md.
 */
const ArchivalFootage: React.FC<{ slotKey: string; durLocal: number }> = ({ slotKey, durLocal }) => {
  const slot = FOOTAGE_SLOTS.find((s) => s.key === slotKey);
  const frame = useCurrentFrame();
  if (!slot?.src) return null;
  const kb =
    slot.kenBurns === "pull"
      ? interpolate(frame, [0, durLocal], [1.1, 1.0])
      : interpolate(frame, [0, durLocal], [1.0, 1.1]);
  return (
    <>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            transform: `scale(${kb})`,
            filter: "grayscale(0.65) sepia(0.22) contrast(1.12) brightness(0.85) blur(0.3px)",
          }}
        >
          <OffthreadVideo src={staticFile(`archival/${slot.src}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </AbsoluteFill>
      {slot.voSrc && <Audio src={staticFile(`vo/${slot.voSrc}`)} volume={0.9} />}
    </>
  );
};

/** Slow, near-imperceptible handheld drift — sells the archive as footage, not slides. */
const Handheld: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / 67) * 2.4;
  const dy = Math.cos(frame / 81) * 1.8;
  return <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px)` }}>{children}</AbsoluteFill>;
};

const Year: React.FC = () => {
  const frame = useCurrentFrame();
  const flick = 0.6 + 0.4 * Math.abs(Math.sin(frame / 3));
  const zoom = 1 + frame * 0.0012; // slow creep — dread
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `scale(${zoom})` }}>
      <ArchivalFootage slotKey="street-dusk" durLocal={DUR.c1} />
      <div style={{ fontFamily: V4.font, fontWeight: 800, fontSize: 150, letterSpacing: "0.02em", color: "#EDE7DB", opacity: flick }}>
        2008.
      </div>
      <div style={{ position: "absolute", bottom: 300, fontFamily: V4.mono, fontSize: 26, letterSpacing: 6, color: "rgba(231,199,154,0.6)" }}>
        THE COLLAPSE
      </div>
    </AbsoluteFill>
  );
};

/** Final crash beat: the thesis line, dark, still aged, held. */
const Edge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame, fps, config: { damping: 26, stiffness: 90, mass: 1.1 } });
  const s2 = spring({ frame: frame - 10, fps, config: { damping: 26, stiffness: 90, mass: 1.1 } });
  return (
    <AbsoluteFill style={{ backgroundColor: "#080706", justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: V4.font, fontWeight: 600, fontSize: 58, color: "rgba(237,231,219,0.75)", opacity: Math.min(1, s1 * 1.3), transform: `translateY(${(1 - s1) * 14}px)` }}>
          For decades, the edge
        </div>
        <div style={{ fontFamily: V4.font, fontWeight: 800, fontSize: 86, color: "#EDE7DB", marginTop: 10, opacity: Math.min(1, s2 * 1.3), transform: `translateY(${(1 - s2) * 14}px)` }}>
          belonged to <span style={{ color: V4.orange }}>them.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CostToll: React.FC = () => {
  const frame = useCurrentFrame();
  const landFrame = 46; // count-up finishes here
  const out = interpolate(frame, [DUR.c7 - 14, DUR.c7 - 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // soft heavy thud on landing — a slow dark pulse, not a snap
  const thud = interpolate(frame, [landFrame, landFrame + 5, landFrame + 26], [0, 0.35, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 140, opacity: out }}>
      <div style={{ position: "absolute", left: "20%", right: "20%", top: "0%", height: "48%", filter: "blur(70px)", pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundColor: "#000", opacity: thud }} />
      </div>
      <CountUp
        from={2_000_000}
        to={10_000_000}
        startFrame={8}
        durationFrames={landFrame - 8}
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
      <Handheld>
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
            <ArchivalFootage slotKey="trading-floor-panic" durLocal={DUR.c3} />
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
            <ArchivalFootage slotKey="bank-exit" durLocal={DUR.c4} />
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
            <ArchivalFootage slotKey="press-podium" durLocal={DUR.c5} />
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
              lines={["Their algorithms saw it coming —", "and they bet against your street."]}
              from={14}
              accentWord="your street."
            />
            <BroadcastChrome />
          </Cut>
        </Sequence>

        {/* c7 — who paid: foreclosures. THE EMOTIONAL CORE — held longest. */}
        <Sequence from={T.c7} durationInFrames={DUR.c7}>
          <Cut dur={DUR.c7}>
            <ArchivalFootage slotKey="foreclosure-door" durLocal={DUR.c7} />
            <ForeclosureSigns />
            <CostToll />
            <Subtitle lines={["Every point they won", "was somebody's front door."]} from={54} accentWord="front door." soft />
            <BroadcastChrome />
          </Cut>
        </Sequence>

        {/* c8 — the toll: $19.2T / 8.8M jobs */}
        <Sequence from={T.c8} durationInFrames={DUR.c8}>
          <Cut dur={DUR.c8}>
            <WealthToll />
            <Subtitle
              lines={["A lifetime of work,", "erased in a quarter."]}
              from={64}
              accentWord="erased"
              soft
            />
            <BroadcastChrome />
          </Cut>
        </Sequence>

        {/* c9 — the thesis. Quiet held black — no chrome, no HUD, just the line. */}
        <Sequence from={T.c9} durationInFrames={DUR.c9}>
          <Cut dur={DUR.c9}>
            <Edge />
          </Cut>
        </Sequence>
      </Handheld>
    </AgedTV>
  </AbsoluteFill>
);
