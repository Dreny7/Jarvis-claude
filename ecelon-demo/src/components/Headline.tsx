import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

/**
 * Kinetic headline: words slam in with a fast spring stagger.
 * Wrap accent words in {orange:...} — e.g. "Five specialists. {orange:Zero} downtime."
 */
export const Headline: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  stagger?: number;
}> = ({ text, delay = 0, fontSize = 84, stagger = 3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ").map((w) => {
    const m = w.match(/^\{orange:(.+)\}$/);
    return m ? { word: m[1], orange: true } : { word: w, orange: false };
  });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: "0.28em",
        fontSize,
        fontWeight: 700,
        letterSpacing: "-0.035em",
        lineHeight: 1.08,
        textAlign: "center",
      }}
    >
      {words.map((w, i) => {
        const s = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: { damping: 16, stiffness: 240, mass: 0.6 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: w.orange ? colors.orange : colors.text,
              textShadow: w.orange ? "0 0 42px rgba(255,92,0,0.65)" : "none",
              opacity: Math.min(1, s * 1.4),
              transform: `translateY(${(1 - s) * 46}px) scale(${0.92 + s * 0.08})`,
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};
