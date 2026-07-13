import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { V4 } from "../theme";

/**
 * Aged-broadcast / VHS treatment for the recreated 2008 archive footage.
 * Original graphics only — no real network branding. Warm near-monochrome,
 * scanlines, heavy corner vignette, roll bar, tracking noise, tape jitter.
 * Wrap scene content; overlays sit on top.
 */
export const AgedTV: React.FC<{
  children: React.ReactNode;
  /** 1 = full aged look, 0 = clean (used to dissolve the effect away) */
  amount?: number;
}> = ({ children, amount = 1 }) => {
  const frame = useCurrentFrame();
  // deterministic tape jitter — tiny vertical shift + rare horizontal tear
  const jitterY = noise2D("tvY", frame * 0.7, 0) * 2.2 * amount;
  const tearFrame = Math.floor(frame / 37) === frame / 37;
  const tearX = tearFrame ? noise2D("tear", frame, 0) * 14 * amount : 0;
  // roll bar sweeps down slowly
  const rollY = ((frame * 1.4) % 140) - 20;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050403" }}>
      {/* content, warm-graded + slightly soft, with jitter */}
      <AbsoluteFill
        style={{
          transform: `translate(${tearX}px, ${jitterY}px)`,
          filter: `sepia(${0.42 * amount}) saturate(${1 - 0.55 * amount}) contrast(${1 + 0.12 * amount}) brightness(${1 - 0.04 * amount})`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* scanlines */}
      <AbsoluteFill
        style={{
          opacity: 0.5 * amount,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, transparent 2px, transparent 4px)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />
      {/* CRT roll bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${rollY}%`,
          height: "14%",
          opacity: 0.06 * amount,
          background:
            "linear-gradient(180deg, transparent, rgba(255,240,220,0.9), transparent)",
          pointerEvents: "none",
        }}
      />
      {/* tracking-noise band near the bottom */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: `${(frame * 3) % 30}%`,
          height: 3,
          opacity: 0.12 * amount,
          background: "rgba(255,255,255,0.8)",
          filter: "blur(1px)",
          pointerEvents: "none",
        }}
      />
      {/* heavy black corner vignette (rounded) */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: amount,
          background:
            "radial-gradient(ellipse 68% 62% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 74%, rgba(0,0,0,0.95) 100%)",
        }}
      />
      {/* faint warm bloom center, like a hot old tube */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: 0.5 * amount,
          background:
            "radial-gradient(ellipse 60% 55% at 50% 48%, rgba(255,170,90,0.05), transparent 60%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Broadcast-style subtitle caption near the bottom. */
export const Subtitle: React.FC<{
  lines: string[];
  /** local frame the caption appears */
  from?: number;
  accentWord?: string;
}> = ({ lines, from = 6, accentWord }) => {
  const frame = useCurrentFrame();
  const on = interpolate(frame, [from, from + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const renderLine = (ln: string, key: number) => {
    if (!accentWord) return <span key={key}>{ln}</span>;
    const parts = ln.split(new RegExp(`(${accentWord})`, "i"));
    return (
      <span key={key}>
        {parts.map((p, i) =>
          p.toLowerCase() === accentWord.toLowerCase() ? (
            <span key={i} style={{ color: V4.orange }}>
              {p}
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </span>
    );
  };
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: 92,
        paddingTop: 130,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 4,
        opacity: on,
        transform: `translateY(${(1 - on) * 12}px)`,
        // scrim so captions never fight the board/graphics behind them
        background: "linear-gradient(180deg, transparent 0%, rgba(4,3,2,0.82) 55%)",
      }}
    >
      {lines.map((ln, i) => (
        <div
          key={i}
          style={{
            fontFamily: V4.font,
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: "-0.01em",
            color: "#F2EEE6",
            textAlign: "center",
            padding: "2px 18px",
            textShadow: "0 2px 14px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.9)",
          }}
        >
          {renderLine(ln, i)}
        </div>
      ))}
    </div>
  );
};

/** Recreated (generic, non-network) broadcast chrome — corner REC + archive tag. */
export const BroadcastChrome: React.FC<{ tag?: string }> = ({ tag = "ARCHIVE · 2008" }) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 15) % 2 === 0;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 54,
          left: 72,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: V4.mono,
          fontSize: 24,
          letterSpacing: 2,
          color: "#F2EDE2",
          textShadow: "0 1px 8px rgba(0,0,0,0.9)",
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: V4.orange,
            opacity: blink ? 1 : 0.25,
          }}
        />
        REC
      </div>
      <div
        style={{
          position: "absolute",
          top: 56,
          right: 72,
          fontFamily: V4.mono,
          fontSize: 22,
          letterSpacing: 3,
          color: "#F2EDE2",
          opacity: 0.9,
          textShadow: "0 1px 8px rgba(0,0,0,0.9)",
        }}
      >
        {tag}
      </div>
    </>
  );
};

/** Generic red-less "MARKET ALERT" lower banner (orange/black, no network). */
export const AlertBanner: React.FC<{ text: string; from?: number }> = ({ text, from = 0 }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [from, from + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 52,
        bottom: 150,
        display: "flex",
        alignItems: "stretch",
        height: 46,
        overflow: "hidden",
        opacity: w > 0.02 ? 1 : 0,
      }}
    >
      {/* clip-reveal (no scaleX — that distorted the glyphs) */}
      <div style={{ display: "flex", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>
        <div
          style={{
            backgroundColor: V4.orangeDeep,
            color: "#0A0A0B",
            fontFamily: V4.font,
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
          }}
        >
          MARKET ALERT
        </div>
        <div
          style={{
            backgroundColor: "rgba(10,10,11,0.85)",
            color: "#F2EEE6",
            fontFamily: V4.font,
            fontWeight: 600,
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
