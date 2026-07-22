import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { U } from "../theme";

/** Ken-Burns push-in + entrance focus-pull. Wraps a full-bleed scene to give
 *  it launch-video life: punches in slightly on the cut, then drifts. */
export const PushIn: React.FC<{ dur: number; from?: number; to?: number; drift?: number; children: React.ReactNode }> = ({ dur, from = 1.08, to = 1.05, drift = 10, children }) => {
  const f = useCurrentFrame();
  const punch = interpolate(f, [0, 9], [from, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slow = interpolate(f, [0, dur], [1.0, to]);
  const blur = interpolate(f, [0, 7], [5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dy = interpolate(f, [0, dur], [drift, -drift]);
  return (
    <AbsoluteFill style={{ transform: `scale(${punch * slow}) translateY(${dy}px)`, filter: blur > 0.1 ? `blur(${blur}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

/** Big kinetic lower-third tagline — the launch "voice". Orange accent word
 *  marked with {o:...}. Rises word-by-word on the beat over a scrim. */
export const Tagline: React.FC<{ text: string; delay?: number; size?: number }> = ({ text, delay = 4, size = 58 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ").map((w) => {
    const m = w.match(/^\{o:(.+?)\}(.*)$/); // accent word + any trailing punctuation
    return m ? { w: m[1] + m[2], o: true } : { w, o: false };
  });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", pointerEvents: "none" }}>
      <div style={{ height: 300, background: "linear-gradient(180deg, transparent, rgba(6,6,8,0.86) 62%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 74, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.26em", padding: "0 120px" }}>
        {words.map((wd, i) => {
          const s = spring({ frame: frame - delay - i * 2.5, fps, config: { damping: 14, stiffness: 280, mass: 0.6 } });
          return (
            <span key={i} style={{ fontFamily: U.font, fontWeight: 800, fontSize: size, letterSpacing: "-0.02em", color: wd.o ? U.orange : U.white, textShadow: wd.o ? "0 0 40px rgba(255,106,44,0.5)" : "0 2px 20px rgba(0,0,0,0.8)", opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 30}px)`, display: "inline-block" }}>
              {wd.w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Small persistent corner label for context during a shot. */
export const Chip: React.FC<{ text: string; delay?: number }> = ({ text, delay = 6 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 40, left: 96, opacity: o, fontFamily: U.font, fontWeight: 700, fontSize: 22, color: U.white, background: "rgba(10,10,12,0.55)", backdropFilter: "blur(10px)", border: `1px solid ${U.hairline}`, padding: "10px 22px", borderRadius: 999, display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ width: 9, height: 9, borderRadius: 999, backgroundColor: U.orange, boxShadow: `0 0 10px ${U.orange}` }} />
      {text}
    </div>
  );
};

/** Full-screen kinetic statement (hook / interstitial). */
export const Statement: React.FC<{ lines: { text: string; o?: boolean }[]; delay?: number; size?: number }> = ({ lines, delay = 6, size = 118 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 6 }}>
      {lines.map((ln, i) => {
        const s = spring({ frame: frame - delay - i * 10, fps, config: { damping: 13, stiffness: 260, mass: 0.7 } });
        return (
          <div key={i} style={{ fontFamily: U.font, fontWeight: 850, fontSize: size, letterSpacing: "-0.03em", lineHeight: 1.02, color: ln.o ? U.orange : U.pureWhite, textShadow: ln.o ? "0 0 60px rgba(255,106,44,0.5)" : undefined, opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * 40}px) scale(${0.94 + s * 0.06})` }}>
            {ln.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Lightweight floating "app window" for the hook tease montage (not a real
 *  scene — just an on-brand glassy panel that flies through). */
export const TeaseWindow: React.FC<{ x: number; y: number; rot: number; delay: number; children?: React.ReactNode }> = ({ x, y, rot, delay, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120, mass: 1 } });
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: `translate(-50%,-50%) rotate(${rot}deg) translateY(${(1 - s) * 120}px) scale(${0.8 + s * 0.2})`, opacity: Math.min(1, s * 1.5) }}>
      <div style={{ width: 420, height: 260, borderRadius: 18, backgroundColor: "rgba(20,20,26,0.8)", backdropFilter: "blur(20px)", border: `1px solid ${U.hairline}`, boxShadow: U.elevFloat, overflow: "hidden" }}>
        <div style={{ height: 40, borderBottom: `1px solid ${U.hairlineSoft}`, display: "flex", alignItems: "center", gap: 7, padding: "0 16px" }}>
          <span style={{ width: 9, height: 9, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.2)" }} />
          <span style={{ width: 9, height: 9, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.2)" }} />
          <span style={{ width: 9, height: 9, borderRadius: 999, backgroundColor: U.orange }} />
        </div>
        <div style={{ padding: 18 }}>{children}</div>
      </div>
    </div>
  );
};
