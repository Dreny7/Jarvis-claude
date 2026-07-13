import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { V4 } from "../theme";
import { T, DUR } from "../timeline";
import { TypeOn, CountUp } from "../components/text";

// ACT 1 — the hook. Wordless dread, documentary register.
// Near-monochrome by design: the only warmth is one dying window.

/** 1a — "2008." */
const Year: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [DUR.a1a - 10, DUR.a1a - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: out }}>
      <TypeOn
        text="2008."
        startFrame={8}
        charsPerFrame={0.24}
        style={{
          fontFamily: V4.font,
          fontWeight: 700,
          fontSize: 132,
          letterSpacing: "0.02em",
          color: V4.white,
        }}
      />
    </AbsoluteFill>
  );
};

/** 1b — house silhouette; the window light dies. */
const House: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, DUR.a1b], [1, 1.09]);
  // window flickers then dies at ~f80
  const flicker =
    frame < 72 ? 0.75 : frame < 76 ? 0.2 : frame < 80 ? 0.6 : frame < 84 ? 0.08 : 0;
  const out = interpolate(frame, [DUR.a1b - 10, DUR.a1b - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: out, justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `scale(${push})` }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          {/* dead night sky, barely lighter than black */}
          <rect width="1920" height="1080" fill="#0B0B0C" />
          <rect y="740" width="1920" height="340" fill="#070708" />
          {/* distant houses */}
          <path d="M 180 740 l 0 -90 l 90 -55 l 90 55 l 0 90 Z" fill="#0E0E0F" />
          <path d="M 1560 740 l 0 -80 l 80 -50 l 80 50 l 0 80 Z" fill="#0E0E0F" />
          {/* the house */}
          <g>
            <path d="M 760 740 l 0 -230 l 200 -120 l 200 120 l 0 230 Z" fill="#101011" />
            <path d="M 745 515 L 960 385 L 1175 515 L 1145 515 L 960 404 L 775 515 Z" fill="#141415" />
            {/* chimney */}
            <rect x="1060" y="400" width="34" height="90" fill="#101011" />
            {/* dark windows */}
            <rect x="800" y="580" width="70" height="88" fill="#060607" />
            <rect x="1050" y="580" width="70" height="88" fill="#060607" />
            {/* the lit window — dies */}
            <rect x="925" y="560" width="72" height="96" fill="#E8DCC2" opacity={flicker} />
            <rect
              x="905"
              y="540"
              width="112"
              height="136"
              fill="#E8DCC2"
              opacity={flicker * 0.12}
              style={{ filter: "blur(18px)" }}
            />
            {/* door */}
            <rect x="938" y="660" width="46" height="80" fill="#060607" />
          </g>
          {/* yard sign */}
          <g transform="translate(620 640) rotate(-2)">
            <rect x="-3" y="0" width="6" height="100" fill="#1A1A1B" />
            <rect x="-80" y="-52" width="160" height="58" rx="3" fill="#151516" stroke="#26262a" strokeWidth="1.5" />
            <text x="0" y="-30" textAnchor="middle" fontFamily={V4.font} fontWeight={700} fontSize="17" fill="rgba(245,245,247,0.5)" letterSpacing="2">
              FOR SALE
            </text>
            <g transform="rotate(-7)">
              <rect x="-72" y="-22" width="144" height="24" fill="none" stroke="rgba(245,245,247,0.65)" strokeWidth="2" />
              <text x="0" y="-4" textAnchor="middle" fontFamily={V4.font} fontWeight={800} fontSize="15" fill="rgba(245,245,247,0.7)" letterSpacing="3">
                BANK OWNED
              </text>
            </g>
          </g>
          {/* overgrown grass strokes, foreground */}
          {Array.from({ length: 60 }, (_, i) => {
            const x = 40 + i * 32 + ((i * 37) % 19);
            const h = 24 + ((i * 53) % 34);
            return (
              <path
                key={i}
                d={`M ${x} 1080 q ${(i % 2 ? 6 : -6)} ${-h * 0.7} ${(i % 3) - 1} ${-h}`}
                stroke="#0D0D0E"
                strokeWidth={3}
                fill="none"
              />
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/** 1c — the notice on the door. */
const Notice: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, DUR.a1c], [0, -14]);
  const scale = interpolate(frame, [0, DUR.a1c], [1.05, 1.0]);
  const inOp = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const out = interpolate(frame, [DUR.a1c - 8, DUR.a1c - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: inOp * out,
        // weathered door
        background: "linear-gradient(105deg, #101011 0%, #141416 45%, #0C0C0D 100%)",
      }}
    >
      <div
        style={{
          transform: `translateY(${drift}px) scale(${scale}) rotate(-1.6deg)`,
          width: 560,
          padding: "52px 54px 64px",
          backgroundColor: "#DDD9CF",
          boxShadow: "0 40px 90px rgba(0,0,0,0.85)",
          position: "relative",
        }}
      >
        {/* tape */}
        <div style={{ position: "absolute", top: -14, left: 60, width: 110, height: 30, background: "rgba(245,245,247,0.28)", transform: "rotate(-5deg)" }} />
        <div style={{ position: "absolute", top: -14, right: 60, width: 110, height: 30, background: "rgba(245,245,247,0.28)", transform: "rotate(4deg)" }} />
        <div style={{ fontFamily: V4.mono, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: "#141414", textAlign: "center" }}>
          NOTICE OF
        </div>
        <div style={{ fontFamily: V4.mono, fontWeight: 700, fontSize: 44, letterSpacing: 6, color: "#101010", textAlign: "center", marginTop: 6 }}>
          FORECLOSURE
        </div>
        <div style={{ height: 2, background: "#101010", margin: "26px 0 30px" }} />
        {/* greeked body lines */}
        {[92, 100, 96, 88, 99, 60, 0, 94, 97, 91, 42].map((w, i) =>
          w === 0 ? (
            <div key={i} style={{ height: 14 }} />
          ) : (
            <div key={i} style={{ height: 9, width: `${w}%`, background: "rgba(20,20,20,0.5)", marginBottom: 11 }} />
          ),
        )}
        <div
          style={{
            marginTop: 30,
            border: "3px solid #101010",
            display: "inline-block",
            padding: "8px 18px",
            transform: "rotate(-4deg)",
            fontFamily: V4.mono,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 5,
            color: "#101010",
          }}
        >
          FINAL NOTICE
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 1d — odometer of loss → "Nobody saw it coming."
 * 90 frames: count 2–32, HOLD the full 10,000,000 (32–48), fade, then the
 * hinge line holds ~1.2s — both beats must land (review finding).
 */
const Toll: React.FC = () => {
  const frame = useCurrentFrame();
  const counterOut = interpolate(frame, [48, 56], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineIn = interpolate(frame, [56, 66], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", opacity: counterOut, textAlign: "center" }}>
        <CountUp
          from={8_214_760}
          to={10_000_000}
          startFrame={2}
          durationFrames={30}
          style={{ fontSize: 110, fontWeight: 700, color: V4.white, letterSpacing: "-0.02em" }}
        />
        <div style={{ fontFamily: V4.font, fontSize: 30, color: V4.dim, marginTop: 14, letterSpacing: "0.14em" }}>
          HOMES LOST
        </div>
      </div>
      <div style={{ opacity: lineIn, fontFamily: V4.font, fontWeight: 600, fontSize: 58, color: V4.white, letterSpacing: "-0.02em" }}>
        Nobody saw it coming.
      </div>
    </AbsoluteFill>
  );
};

export const Act1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: V4.bgDeep }}>
    <Sequence from={T.a1a} durationInFrames={DUR.a1a}>
      <Year />
    </Sequence>
    <Sequence from={T.a1b} durationInFrames={DUR.a1b}>
      <House />
    </Sequence>
    <Sequence from={T.a1c} durationInFrames={DUR.a1c}>
      <Notice />
    </Sequence>
    <Sequence from={T.a1d} durationInFrames={DUR.a1d}>
      <Toll />
    </Sequence>
  </AbsoluteFill>
);
