import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Headline } from "../components/Headline";
import { GlassCard, Pop } from "../components/ui";
import { colors } from "../theme";

const PROMPT = "Run a mean-reversion strategy on large-caps";
const TYPE_START = 14;
const CHARS_PER_FRAME = 1.6; // fast, confident typing

// Deterministic upward-drifting price line
const N = 60;
const pts = Array.from({ length: N }, (_, i) => {
  const t = i / (N - 1);
  const wave =
    Math.sin(i * 0.55) * 16 + Math.sin(i * 0.23 + 2) * 26 + Math.sin(i * 1.3) * 6;
  return { x: 120 + t * 1680, y: 560 - t * 150 + wave };
});
const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

const TRADES = [
  { at: 0.3, label: "NVDA · $140.50", sub: "Relative-strength breakout" },
  { at: 0.56, label: "ETH · $3,420.50", sub: "Oversold on 4H RSI — entered" },
  { at: 0.82, label: "BTC · $97,240", sub: "ETF inflows — position added" },
];

export const Strategy: React.FC = () => {
  const frame = useCurrentFrame();

  const typed = Math.min(
    PROMPT.length,
    Math.max(0, Math.floor((frame - TYPE_START) * CHARS_PER_FRAME)),
  );
  const typeDone = typed >= PROMPT.length;
  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  // chart draws right after typing completes
  const drawStart = TYPE_START + PROMPT.length / CHARS_PER_FRAME + 6;
  const draw = interpolate(frame, [drawStart, drawStart + 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pathLen = 1900;

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 96 }}>
      <Headline text="Describe the strategy. {orange:Agents} do the rest." fontSize={80} />

      <Pop delay={8} distance={30} style={{ marginTop: 60, width: 1240 }}>
        <GlassCard
          accent={typeDone}
          style={{
            padding: "26px 36px",
            display: "flex",
            alignItems: "center",
            gap: 18,
            borderRadius: 18,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: colors.orange,
              boxShadow: `0 0 14px ${colors.orange}`,
              opacity: typeDone ? 1 : 0.45,
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 500, color: colors.text, letterSpacing: "-0.01em" }}>
            {PROMPT.slice(0, typed)}
            <span
              style={{
                display: "inline-block",
                width: 3,
                height: 32,
                marginLeft: 3,
                verticalAlign: "-4px",
                backgroundColor: colors.orange,
                opacity: cursorOn && !typeDone ? 1 : typeDone ? 0 : 0.2,
              }}
            />
          </div>
        </GlassCard>
      </Pop>

      {/* Chart: draws on with glow; agents place trades as it passes */}
      <svg
        width={1920}
        height={760}
        viewBox="0 320 1920 760"
        style={{ position: "absolute", bottom: 0 }}
      >
        <defs>
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.orangeDeep} />
            <stop offset="60%" stopColor={colors.orange} />
            <stop offset="100%" stopColor={colors.orangeHot} />
          </linearGradient>
          <linearGradient id="fill-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,92,0,0.13)" />
            <stop offset="100%" stopColor="rgba(255,92,0,0)" />
          </linearGradient>
        </defs>
        {/* area fill under the drawn portion */}
        <path
          d={`${pathD} L${120 + draw * 1680},700 L120,700 Z`}
          fill="url(#fill-grad)"
          opacity={draw}
          style={{ clipPath: `inset(0 ${(1 - draw) * 100}% 0 0)` }}
        />
        <path
          d={pathD}
          fill="none"
          stroke="url(#line-grad)"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={pathLen}
          strokeDashoffset={pathLen * (1 - draw)}
          style={{ filter: "drop-shadow(0 0 14px rgba(255,92,0,0.75))" }}
        />
        {/* leading dot */}
        {draw > 0.01 && draw < 1 && (
          <circle
            cx={pts[Math.floor(draw * (N - 1))].x}
            cy={pts[Math.floor(draw * (N - 1))].y}
            r={10}
            fill={colors.orangeHot}
            style={{ filter: "drop-shadow(0 0 16px rgba(255,123,36,1))" }}
          />
        )}
        {TRADES.map((t, i) => {
          const p = pts[Math.floor(t.at * (N - 1))];
          return draw >= t.at ? (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={8}
              fill={colors.orange}
              stroke="#fff"
              strokeWidth={2.5}
              style={{ filter: "drop-shadow(0 0 12px rgba(255,92,0,0.9))" }}
            />
          ) : null;
        })}
      </svg>

      {/* Trade callout cards pop as the line reaches them */}
      {TRADES.map((t, i) => {
        const p = pts[Math.floor(t.at * (N - 1))];
        return (
          <Pop
            key={i}
            delay={drawStart + t.at * 38 + 2}
            from="up"
            distance={26}
            style={{
              position: "absolute",
              left: Math.min(p.x - 150, 1480),
              top: p.y + 46,
            }}
          >
            <GlassCard style={{ padding: "18px 26px", borderRadius: 16, width: 320 }}>
              <div style={{ fontSize: 27, fontWeight: 700, color: colors.text }}>{t.label}</div>
              <div style={{ fontSize: 20, color: colors.textDim, marginTop: 4 }}>{t.sub}</div>
            </GlassCard>
          </Pop>
        );
      })}
    </AbsoluteFill>
  );
};
