import React from "react";
import { V4 } from "../theme";

/**
 * The ecelon "M" mark — five facets, geometry derived from the brand book's
 * construction-grid page. Canonical facet→layer map (brand book pp.3–7):
 * left foot=Trust, left wing=AI Agents, center square=Social,
 * right wing=Data Intelligence, right foot=Education.
 */
export type Facet = { id: string; label: string; pts: [number, number][] };

export const FACETS: Facet[] = [
  { id: "trust", label: "Trust", pts: [[5, 63], [41, 47], [41, 79], [5, 97]] },
  { id: "agents", label: "AI Agents", pts: [[43, 3], [83, 22], [83, 66], [43, 40]] },
  { id: "social", label: "Social", pts: [[86.5, 61], [126.5, 61], [126.5, 100], [86.5, 100]] },
  { id: "data", label: "Data Intelligence", pts: [[127, 22], [167, 3], [167, 40], [127, 66]] },
  { id: "edu", label: "Education", pts: [[169, 47], [205, 63], [205, 97], [169, 79]] },
];

export const MARK_VB = { w: 210, h: 104 };

const centroid = (pts: [number, number][]) => {
  const x = pts.reduce((a, p) => a + p[0], 0) / pts.length;
  const y = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  return { x, y };
};

/**
 * Full mark with per-facet build progress (0 = away/hidden, 1 = locked).
 * Facets fly in from an outward explode offset and settle.
 */
export const FacetMark: React.FC<{
  width: number;
  facetProgress: number[]; // length 5
  color?: string;
  glow?: number; // 0..1
  explode?: number; // px (viewBox units) offset at progress 0
}> = ({ width, facetProgress, color = V4.orange, glow = 0, explode = 70 }) => {
  const height = (width * MARK_VB.h) / MARK_VB.w;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${MARK_VB.w} ${MARK_VB.h}`}
      style={{
        overflow: "visible",
        filter:
          glow > 0.01
            ? `drop-shadow(0 0 ${18 * glow}px rgba(255,75,0,${0.7 * glow})) drop-shadow(0 0 ${46 * glow}px rgba(255,107,44,${0.4 * glow}))`
            : undefined,
      }}
    >
      {FACETS.map((f, i) => {
        const p = Math.max(0, Math.min(1, facetProgress[i] ?? 0));
        if (p <= 0.001) return null;
        const c = centroid(f.pts);
        const dirX = (c.x - MARK_VB.w / 2) / (MARK_VB.w / 2); // outward
        const dx = dirX * explode * (1 - p);
        const dy = -14 * (1 - p);
        return (
          <polygon
            key={f.id}
            points={f.pts.map((pt) => pt.join(",")).join(" ")}
            fill={color}
            opacity={Math.min(1, p * 1.5)}
            style={{
              transformOrigin: `${c.x}px ${c.y}px`,
              transform: `translate(${dx}px, ${dy}px) scale(${0.75 + 0.25 * p})`,
            }}
          />
        );
      })}
    </svg>
  );
};

/** One facet alone (Act 3 shard, Act 4d labeled row). */
export const SingleFacet: React.FC<{
  index: number;
  width: number;
  color?: string;
  glow?: number;
  opacity?: number;
}> = ({ index, width, color = V4.orange, glow = 0, opacity = 1 }) => {
  const f = FACETS[index];
  const xs = f.pts.map((p) => p[0]);
  const ys = f.pts.map((p) => p[1]);
  const minX = Math.min(...xs) - 2;
  const minY = Math.min(...ys) - 2;
  const w = Math.max(...xs) - minX + 2;
  const h = Math.max(...ys) - minY + 2;
  return (
    <svg
      width={width}
      height={(width * h) / w}
      viewBox={`${minX} ${minY} ${w} ${h}`}
      style={{
        overflow: "visible",
        opacity,
        filter:
          glow > 0.01
            ? `drop-shadow(0 0 ${16 * glow}px rgba(255,75,0,${0.75 * glow})) drop-shadow(0 0 ${40 * glow}px rgba(255,107,44,${0.4 * glow}))`
            : undefined,
      }}
    >
      <polygon points={f.pts.map((pt) => pt.join(",")).join(" ")} fill={color} />
    </svg>
  );
};

export const Wordmark: React.FC<{ fontSize: number; color?: string }> = ({
  fontSize,
  color = V4.white,
}) => (
  <span
    style={{
      fontFamily: V4.font,
      fontWeight: 600,
      letterSpacing: "-0.02em",
      fontSize,
      color,
      lineHeight: 1,
    }}
  >
    ecelon
    <span style={{ fontSize: fontSize * 0.28, verticalAlign: "super", fontWeight: 500 }}>™</span>
  </span>
);
