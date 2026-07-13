import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { V4, rand } from "../theme";

const COLS = 7;
const ROWS = 26;
const ROW_H = 44;

/** Inhuman-speed order-flow wall — deterministic, scroll accelerates. */
export const DataWall: React.FC<{
  /** rows per second at local frame 0 */
  baseSpeed?: number;
  /** extra rows/sec gained per second (acceleration) */
  accel?: number;
  opacity?: number;
}> = ({ baseSpeed = 4, accel = 2.5, opacity = 0.5 }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const offset = (baseSpeed * t + 0.5 * accel * t * t) * ROW_H;

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 60px",
          maskImage:
            "linear-gradient(180deg, transparent 4%, black 22%, black 78%, transparent 96%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 4%, black 22%, black 78%, transparent 96%)",
        }}
      >
        {Array.from({ length: COLS }, (_, c) => {
          const colSpeed = 0.7 + rand(c * 17) * 0.7;
          const colOffset = (offset * colSpeed) % (ROWS * ROW_H);
          return (
            <div key={c} style={{ position: "relative", width: 220 }}>
              {Array.from({ length: ROWS * 2 }, (_, r) => {
                const row = r % ROWS;
                const yy = r * ROW_H - colOffset;
                if (yy < -ROW_H || yy > 1120) return null;
                const price = (80 + rand(c * 100 + row) * 400).toFixed(2);
                const size = Math.floor(rand(c * 313 + row * 7) * 9000 + 100).toLocaleString("en-US");
                const hot = rand(c * 71 + row * 13) > 0.86;
                const side = rand(c * 41 + row * 29) > 0.5 ? "▲" : "▼";
                return (
                  <div
                    key={r}
                    style={{
                      position: "absolute",
                      top: yy,
                      left: 0,
                      fontFamily: V4.mono,
                      fontSize: 21,
                      fontVariantNumeric: "tabular-nums",
                      whiteSpace: "nowrap",
                      color: hot ? V4.orange : "rgba(245,245,247,0.42)",
                      fontWeight: hot ? 700 : 400,
                    }}
                  >
                    {side} {price} <span style={{ opacity: 0.55 }}>× {size}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Microsecond clock — the "machines live below human time" cue. */
export const MicroClock: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const us = frame * 33333 + 137; // ~1/30s per frame in µs
  const s = 34 + Math.floor(us / 1e6);
  const rem = us % 1e6;
  const txt = `09:30:${String(s).padStart(2, "0")}.${String(rem).padStart(6, "0")}`;
  return (
    <div
      style={{
        fontFamily: V4.mono,
        fontVariantNumeric: "tabular-nums",
        color: V4.faint,
        letterSpacing: 2,
        ...style,
      }}
    >
      {txt}
    </div>
  );
};

/** Whipping seeded price polyline for Act 2c. */
export const WhipChart: React.FC<{ seed: number; draw: number; opacity?: number }> = ({
  seed,
  draw,
  opacity = 0.8,
}) => {
  const N = 48;
  let y = 560 + rand(seed) * 120;
  const pts: string[] = [];
  for (let i = 0; i < N; i++) {
    y += (rand(seed * 100 + i) - 0.48) * 110;
    y = Math.max(180, Math.min(920, y));
    pts.push(`${(i / (N - 1)) * 1920},${y}`);
  }
  const len = 2600;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity }}>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={V4.orange}
        strokeWidth={3.5}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - Math.min(1, draw))}
        style={{ filter: "drop-shadow(0 0 10px rgba(255,75,0,0.6))" }}
      />
    </svg>
  );
};
