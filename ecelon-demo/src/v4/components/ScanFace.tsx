import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { V4 } from "../theme";

// Left-facing human profile silhouette (original bezier path), brand-book
// photography direction: near-total silhouette, thin orange rim light,
// orange "+" scan grid tracking across the face.
const PROFILE =
  "M 280 28" +
  " C 352 32, 422 96, 424 190" +
  " C 426 262, 412 322, 390 372" +
  " C 382 424, 404 484, 434 540" +
  " L 234 540" +
  " C 244 468, 250 428, 246 394" +
  " C 240 366, 222 348, 202 330" +
  " C 184 318, 168 308, 161 296" +
  " C 152 288, 150 278, 157 269" +
  " C 146 263, 146 252, 155 246" +
  " C 149 240, 151 231, 159 226" +
  " C 148 219, 139 209, 143 200" +
  " C 134 194, 137 183, 153 177" +
  " C 161 170, 165 161, 167 149" +
  " C 171 118, 196 56, 280 28 Z";

export const ScanFace: React.FC<{
  /** local frame the scan starts */
  scanStart?: number;
  scanDuration?: number;
}> = ({ scanStart = 18, scanDuration = 75 }) => {
  const frame = useCurrentFrame();
  const scanY = interpolate(frame, [scanStart, scanStart + scanDuration], [20, 520], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gridIn = interpolate(frame, [scanStart, scanStart + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enter = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const telemetry: { f: number; x: number; y: number; k: string; v: string }[] = [
    { f: scanStart + 16, x: 172, y: 148, k: "SUBJ", v: "RETAIL-7731" },
    { f: scanStart + 34, x: 148, y: 226, k: "REACTION", v: "412 ms" },
    { f: scanStart + 52, x: 196, y: 330, k: "EDGE", v: "NONE" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        right: "6%",
        top: "50%",
        transform: `translateY(-50%) translateX(${(1 - enter) * 60}px)`,
        opacity: enter,
      }}
    >
      <svg width={620} height={640} viewBox="0 0 520 540" style={{ overflow: "visible" }}>
        <defs>
          <clipPath id="v4-head-clip">
            <path d={PROFILE} />
          </clipPath>
          <linearGradient id="v4-rim" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="55%" stopColor="transparent" />
            <stop offset="100%" stopColor={V4.orangeHi} />
          </linearGradient>
          <pattern id="v4-scan-plus" width={36} height={36} patternUnits="userSpaceOnUse">
            <path d="M 18 12 v 12 M 12 18 h 12" stroke={V4.orange} strokeWidth={1.4} fill="none" />
          </pattern>
        </defs>

        {/* subject: near-black silhouette (face points left) */}
        <g>
          <path d={PROFILE} fill="#060607" />
          {/* rim light on the profile edge */}
          <path
            d={PROFILE}
            fill="none"
            stroke="url(#v4-rim)"
            strokeWidth={3.2}
            style={{ filter: "blur(1.6px)" }}
            opacity={0.95}
          />
          {/* scan grid clipped to the head */}
          <g clipPath="url(#v4-head-clip)">
            <rect
              x={0}
              y={0}
              width={520}
              height={scanY}
              fill="url(#v4-scan-plus)"
              opacity={gridIn * 0.8}
            />
            {/* sweeping scan line */}
            <rect
              x={0}
              y={scanY - 2}
              width={520}
              height={4}
              fill={V4.orangeHi}
              opacity={frame < scanStart + scanDuration + 6 ? 0.85 : 0}
              style={{ filter: "blur(2px)" }}
            />
          </g>
        </g>

        {/* telemetry labels pointing at the face's front edge */}
        {telemetry.map((t) => {
          const on = interpolate(frame, [t.f, t.f + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = t.x;
          return (
            <g key={t.k} opacity={on}>
              <line x1={x - 74} y1={t.y} x2={x - 16} y2={t.y} stroke={V4.orange} strokeWidth={1} opacity={0.7} />
              <circle cx={x - 12} cy={t.y} r={2.6} fill={V4.orangeHi} />
              <text
                x={x - 78}
                y={t.y - 7}
                textAnchor="end"
                fill={V4.faint}
                fontFamily={V4.mono}
                fontSize={13}
                letterSpacing={1.5}
              >
                {t.k}
              </text>
              <text
                x={x - 78}
                y={t.y + 13}
                textAnchor="end"
                fill={V4.orange}
                fontFamily={V4.mono}
                fontSize={16}
                fontWeight={700}
              >
                {t.v}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
