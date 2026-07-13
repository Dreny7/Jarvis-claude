import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { V4 } from "../theme";
import { T, DUR } from "../timeline";
import { KineticLine } from "../components/text";
import { ScanFace } from "../components/ScanFace";
import { DataWall, MicroClock, WhipChart } from "../components/DataWall";

// ACT 2 — the reveal. First orange. Machines under the market.

/** 2a — "Someone did." + scan-grid face (brand OOH motif). */
const Someone: React.FC = () => {
  const frame = useCurrentFrame();
  const bg = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: V4.bgDeep }}>
      {/* saturated orange field behind the subject — brand photography direction */}
      <AbsoluteFill
        style={{
          opacity: bg,
          background:
            "radial-gradient(ellipse 62% 78% at 72% 50%, rgba(255,75,0,0.5) 0%, rgba(255,75,0,0.16) 45%, rgba(8,8,10,0) 75%)",
        }}
      />
      <ScanFace scanStart={20} scanDuration={70} />
      <div style={{ position: "absolute", left: "7%", top: "40%", width: 700 }}>
        <KineticLine text="Someone did." delay={10} fontSize={96} fontWeight={800} align="left" />
      </div>
    </AbsoluteFill>
  );
};

/** 2b — algorithms made billions. */
const Billions: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: V4.bgDeep }}>
    <DataWall baseSpeed={5} accel={3} opacity={0.4} />
    <MicroClock epochFrame={110} style={{ position: "absolute", top: "15.5%", right: 90, fontSize: 28 }} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 26 }}>
      <KineticLine text="While families lost everything —" delay={4} fontSize={62} fontWeight={600} color={V4.dim} />
      <KineticLine text="algorithms made {orange:billions.}" delay={30} fontSize={92} fontWeight={800} punchy />
    </AbsoluteFill>
  </AbsoluteFill>
);

/** 2c — decades of HFT. */
const Decades: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame < 45 ? 3 : 11; // chart re-whips mid-scene
  const draw = ((frame % 45) + 1) / 34;
  return (
    <AbsoluteFill style={{ backgroundColor: V4.bgDeep }}>
      <DataWall baseSpeed={8} accel={5} opacity={0.3} />
      <WhipChart seed={seed} draw={draw} opacity={0.55} />
      <MicroClock epochFrame={200} style={{ position: "absolute", top: "15.5%", right: 90, fontSize: 28 }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 200px" }}>
        <KineticLine
          text="Hedge funds have run on {orange:algorithms} for decades."
          delay={5}
          fontSize={76}
          fontWeight={700}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 2d — faster. smarter. invisible. (tempo peak, riser) */
const Fragments: React.FC = () => {
  const frame = useCurrentFrame();
  const words: { w: string; from: number; to: number }[] = [
    { w: "faster.", from: 0, to: 30 },
    { w: "smarter.", from: 30, to: 60 },
    { w: "invisible.", from: 60, to: DUR.a2d },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: V4.bgDeep }}>
      <DataWall baseSpeed={12} accel={14} opacity={0.34} />
      <MicroClock epochFrame={290} style={{ position: "absolute", top: "15.5%", right: 90, fontSize: 28 }} />
      {words.map(({ w, from, to }) => {
        if (frame < from || frame >= to) return null;
        const local = frame - from;
        const scale = interpolate(local, [0, to - from], [1, 1.12]);
        const isLast = w === "invisible.";
        return (
          <AbsoluteFill key={w} style={{ justifyContent: "center", alignItems: "center" }}>
            <div
              style={{
                fontFamily: V4.font,
                fontWeight: 800,
                fontSize: 150,
                letterSpacing: "-0.04em",
                color: isLast ? V4.orange : V4.white,
                textShadow: isLast ? "0 0 60px rgba(255,75,0,0.5)" : "none",
                transform: `scale(${scale})`,
                opacity: interpolate(local, [0, 3], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              {w}
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

export const Act2: React.FC = () => (
  <>
    <Sequence from={T.a2a} durationInFrames={DUR.a2a}>
      <Someone />
    </Sequence>
    <Sequence from={T.a2b} durationInFrames={DUR.a2b}>
      <Billions />
    </Sequence>
    <Sequence from={T.a2c} durationInFrames={DUR.a2c}>
      <Decades />
    </Sequence>
    <Sequence from={T.a2d} durationInFrames={DUR.a2d}>
      <Fragments />
    </Sequence>
  </>
);
