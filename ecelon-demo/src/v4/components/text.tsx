import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { V4 } from "../theme";

/** Typewriter reveal. startFrame is local to the enclosing Sequence. */
export const TypeOn: React.FC<{
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  caret?: boolean;
  style?: React.CSSProperties;
}> = ({ text, startFrame = 0, charsPerFrame = 0.55, caret = true, style }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - startFrame) * charsPerFrame)));
  const done = n >= text.length;
  const caretOn = Math.floor(frame / 9) % 2 === 0;
  return (
    <span style={{ whiteSpace: "pre-wrap", ...style }}>
      {text.slice(0, n)}
      {caret && !done && frame >= startFrame ? (
        <span style={{ opacity: caretOn ? 0.9 : 0.15 }}>▌</span>
      ) : null}
    </span>
  );
};

/**
 * Word-stagger kinetic line. Wrap accent words: "algorithms made {orange:billions.}"
 * Calm premium springs (no overshoot) unless punchy=true.
 */
export const KineticLine: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  fontSize?: number;
  fontWeight?: number;
  punchy?: boolean;
  align?: "center" | "left";
  color?: string;
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  stagger = 3,
  fontSize = 64,
  fontWeight = 700,
  punchy = false,
  align = "center",
  color = V4.white,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ").map((w) => {
    const m = w.match(/^\{orange:(.+)\}$/);
    return m ? { word: m[1], orange: true } : { word: w, orange: false };
  });
  const cfg = punchy
    ? { damping: 13, stiffness: 260, mass: 0.6 }
    : { damping: 22, stiffness: 190, mass: 0.85 };
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: "0.28em",
        fontSize,
        fontWeight,
        letterSpacing: "-0.03em",
        lineHeight: 1.12,
        textAlign: align,
        fontFamily: V4.font,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const s = spring({ frame: frame - delay - i * stagger, fps, config: cfg });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: w.orange ? V4.orange : color,
              textShadow: w.orange ? "0 0 40px rgba(255,75,0,0.55)" : "none",
              opacity: Math.min(1, s * 1.4),
              transform: `translateY(${(1 - s) * 34}px)`,
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};

/** Eased count-up with optional spring-overshoot settle (kinetic-animation recipe). */
export const CountUp: React.FC<{
  from?: number;
  to: number;
  startFrame: number;
  durationFrames: number;
  overshoot?: boolean;
  format?: (v: number) => string;
  style?: React.CSSProperties;
}> = ({ from = 0, to, startFrame, durationFrames, overshoot = false, format, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  let value = raw;
  if (overshoot && frame >= startFrame + durationFrames - 2) {
    const s = spring({
      frame: frame - (startFrame + durationFrames - 2),
      fps,
      config: { damping: 10, stiffness: 200 },
    });
    value = to * (1 + (1 - s) * 0.02);
  }
  const fmt = format ?? ((v: number) => Math.round(v).toLocaleString("en-US"));
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", fontFamily: V4.font, ...style }}>
      {fmt(value)}
    </span>
  );
};
