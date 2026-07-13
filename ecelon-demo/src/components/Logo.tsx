import React from "react";
import { colors } from "../theme";

// The ecelon "M" mark: a zigzag ribbon rendered as faceted segments,
// like the original but with a hotter gradient and crisper geometry.
type Pt = [number, number];

// Zigzag spine of the M (viewBox 0..200 x 0..120)
const SPINE: Pt[] = [
  [12, 112],
  [52, 22],
  [100, 86],
  [148, 22],
  [188, 112],
];

const WIDTH = 30; // ribbon thickness
const GAP = 2.5; // facet separation

const segmentQuad = (a: Pt, b: Pt): string => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  // perpendicular
  const px = -uy * (WIDTH / 2);
  const py = ux * (WIDTH / 2);
  // shrink ends slightly for the facet gap
  const ax = a[0] + ux * GAP;
  const ay = a[1] + uy * GAP;
  const bx = b[0] - ux * GAP;
  const by = b[1] - uy * GAP;
  return `${ax + px},${ay + py} ${bx + px},${by + py} ${bx - px},${by - py} ${ax - px},${ay - py}`;
};

export const LogoMark: React.FC<{
  size?: number;
  /** 0..1 per-facet build progress (1 = fully assembled) */
  build?: number;
  glowOpacity?: number;
}> = ({ size = 200, build = 1, glowOpacity = 0.9 }) => {
  const segs = SPINE.slice(0, -1).map((p, i) => segmentQuad(p, SPINE[i + 1]));

  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 200 120"
      style={{
        overflow: "visible",
        filter: `drop-shadow(0 0 ${size * 0.12}px rgba(255,92,0,${glowOpacity * 0.65})) drop-shadow(0 0 ${size * 0.3}px rgba(255,92,0,${glowOpacity * 0.35}))`,
      }}
    >
      <defs>
        <linearGradient id="ecelon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.orangeHot} />
          <stop offset="55%" stopColor={colors.orange} />
          <stop offset="100%" stopColor={colors.orangeDeep} />
        </linearGradient>
      </defs>
      {segs.map((points, i) => {
        // stagger facet assembly: each facet gets a slice of `build`
        const local = Math.min(1, Math.max(0, build * segs.length - i));
        const eased = 1 - Math.pow(1 - local, 3);
        return (
          <polygon
            key={i}
            points={points}
            fill="url(#ecelon-grad)"
            opacity={eased}
            style={{
              transformOrigin: "100px 66px",
              transform: `scale(${0.6 + 0.4 * eased}) translateY(${(1 - eased) * 14}px)`,
            }}
          />
        );
      })}
    </svg>
  );
};

export const Wordmark: React.FC<{ fontSize?: number }> = ({ fontSize = 96 }) => (
  <div
    style={{
      fontSize,
      fontWeight: 600,
      letterSpacing: "-0.03em",
      color: colors.text,
      lineHeight: 1,
    }}
  >
    ecelon
  </div>
);
