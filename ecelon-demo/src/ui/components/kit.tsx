import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { U, hash } from "../theme";

/* ============================ God-ray background ============================ */
/** Signature onboarding backdrop — 56 rays fanning from just above top-center,
 *  slow rotate + breathe + origin bloom. Pure function of frame. */
export const Rays: React.FC<{ intensity?: number; appear?: number }> = ({ intensity = 1, appear = 1 }) => {
  const frame = useCurrentFrame();
  const rot = Math.sin(frame / 190) * 2;
  const breathe = 1 + Math.sin(frame / 90) * 0.02;
  const RAYS = 56;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0A", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translateY(-6%) rotate(${rot}deg) scale(${breathe})`,
          transformOrigin: "50% 0%",
          opacity: appear,
        }}
      >
        {Array.from({ length: RAYS }, (_, i) => {
          const a = -85 + (i / (RAYS - 1)) * 170 + (hash(i) - 0.5) * 2.4;
          const op = (0.05 + hash(i * 3.3) * 0.17) * intensity;
          const w = 1 + hash(i * 7.7) * 3;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                width: w,
                height: "150%",
                background: `linear-gradient(180deg, ${U.orange} 0%, rgba(201,128,60,0.5) 30%, transparent 78%)`,
                opacity: op,
                transformOrigin: "50% 0%",
                transform: `rotate(${a}deg)`,
                mixBlendMode: "screen",
              }}
            />
          );
        })}
      </AbsoluteFill>
      {/* origin bloom */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "-16%",
          width: 1400,
          height: 900,
          transform: "translateX(-50%)",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      >
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: U.orange, opacity: 0.16 * intensity * appear }} />
      </div>
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

/** Fine animated grain — kills banding on dark gradients. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.04 }) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "screen", opacity, pointerEvents: "none" }}>
      <filter id="ui-grain">
        <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} seed={frame % 8} stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0.4 0.4 0 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#ui-grain)" />
    </svg>
  );
};

/** Soft drifting orange glow field for dark product screens. */
export const GlowField: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const x1 = 24 + Math.sin(frame / 55) * 8;
  const y1 = 26 + Math.cos(frame / 67) * 7;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -200, filter: "blur(130px)" }}>
        <div style={{ position: "absolute", left: `${x1}%`, top: `${y1}%`, width: 820, height: 640, borderRadius: "50%", backgroundColor: U.orangeDeep, opacity: 0.12 * intensity, transform: "translate(-50%,-50%)" }} />
        <div style={{ position: "absolute", right: "8%", bottom: "6%", width: 700, height: 560, borderRadius: "50%", backgroundColor: U.orangeHi, opacity: 0.08 * intensity }} />
      </div>
    </AbsoluteFill>
  );
};

/* ============================ Motion helpers ============================ */
export const useRise = (delay: number, from = 26, cfg = { damping: 15, stiffness: 260, mass: 0.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: cfg });
  return { opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * from}px) scale(${0.94 + s * 0.06})`, s };
};

export const Rise: React.FC<{ delay: number; from?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, from = 26, children, style }) => {
  const r = useRise(delay, from);
  return <div style={{ opacity: r.opacity, transform: r.transform, ...style }}>{children}</div>;
};

/** Typewriter — returns the visible slice + caret flag. */
export const useType = (text: string, startFrame: number, cps = 2.2) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - startFrame) * cps)));
  const done = n >= text.length;
  const caret = frame >= startFrame && Math.floor(frame / 8) % 2 === 0;
  return { shown: text.slice(0, n), done, caret, n };
};

export const CountUp: React.FC<{ to: number; from?: number; start: number; dur: number; format?: (v: number) => string; style?: React.CSSProperties }> = ({ to, from = 0, start, dur, format, style }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + dur], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const fmt = format ?? ((x: number) => Math.round(x).toLocaleString("en-US"));
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{fmt(v)}</span>;
};

/* ============================ Primitives ============================ */
export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; radius?: number; glass?: boolean }> = ({ children, style, radius = 20, glass = false }) => (
  <div
    style={{
      backgroundColor: glass ? "rgba(20,20,26,0.72)" : U.surface,
      backdropFilter: glass ? "blur(28px)" : undefined,
      border: `1px solid ${U.hairline}`,
      borderRadius: radius,
      boxShadow: U.elevCard,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{ label: string; active?: boolean; size?: number }> = ({ label, active, size = 22 }) => (
  <div
    style={{
      fontFamily: U.font,
      fontWeight: 700,
      fontSize: size,
      padding: `${size * 0.55}px ${size * 1.1}px`,
      borderRadius: 999,
      color: active ? U.ink : U.text2,
      backgroundColor: active ? U.pureWhite : "rgba(255,255,255,0.06)",
      border: active ? "none" : `1px solid ${U.hairline}`,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </div>
);

export const CtaButton: React.FC<{ label: string; style?: React.CSSProperties; glow?: boolean }> = ({ label, style, glow = true }) => (
  <div
    style={{
      fontFamily: U.font,
      fontWeight: 700,
      fontSize: 22,
      color: "#fff",
      backgroundColor: U.orangeCta,
      padding: "16px 40px",
      borderRadius: 999,
      boxShadow: glow ? U.glowCta : undefined,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {label}
  </div>
);

export const GhostButton: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ fontFamily: U.font, fontWeight: 700, fontSize: 22, color: U.white, backgroundColor: "rgba(255,255,255,0.08)", padding: "16px 34px", borderRadius: 999, whiteSpace: "nowrap" }}>
    {label}
  </div>
);

export const Badge: React.FC<{ label: string; tone?: "orange" | "neutral"; size?: number }> = ({ label, tone = "orange", size = 13 }) => (
  <span
    style={{
      fontFamily: U.font,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "0.08em",
      padding: `${size * 0.35}px ${size * 0.8}px`,
      borderRadius: 999,
      color: tone === "orange" ? U.orange : U.text2,
      border: `1.5px solid ${tone === "orange" ? "rgba(255,106,44,0.5)" : U.hairline}`,
      backgroundColor: tone === "orange" ? "rgba(255,106,44,0.10)" : "transparent",
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

export const Dot: React.FC<{ color?: string; size?: number; pulse?: boolean }> = ({ color = U.orange, size = 10, pulse }) => {
  const frame = useCurrentFrame();
  const o = pulse ? 0.5 + 0.5 * Math.abs(Math.sin(frame / 12)) : 1;
  return <span style={{ width: size, height: size, borderRadius: 999, backgroundColor: color, boxShadow: `0 0 10px ${color}`, opacity: o, display: "inline-block", flexShrink: 0 }} />;
};

/** Onboarding modal shell — rays bg + STEP label + heading + slot + buttons. */
export const StepShell: React.FC<{ step?: number; heading: string; children?: React.ReactNode; back?: boolean; primary?: string; headDelay?: number }> = ({ step, heading, children, back = true, primary = "Continue", headDelay = 2 }) => {
  const h = useRise(headDelay, 20);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 44, right: 52, width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: U.text2, fontSize: 22 }}>×</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 720 }}>
        {step ? <div style={{ fontFamily: U.font, fontWeight: 600, fontSize: 13, letterSpacing: "0.18em", color: U.text3, marginBottom: 18, opacity: h.opacity }}>STEP {step} OF 8</div> : null}
        <div style={{ fontFamily: U.font, fontWeight: 800, fontSize: 46, letterSpacing: "-0.02em", color: U.pureWhite, textAlign: "center", opacity: h.opacity, transform: h.transform }}>{heading}</div>
        {children ? <div style={{ marginTop: 40, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>{children}</div> : null}
        {primary ? (
          <div style={{ marginTop: 40, display: "flex", gap: 14 }}>
            {back ? <GhostButton label="Back" /> : null}
            <CtaButton label={primary} />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
