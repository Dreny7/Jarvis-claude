import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { U } from "../theme";
import { Rays, useType, useRise, Grain } from "../components/kit";
import { FacetMark, Wordmark } from "../../v4/components/FacetMark";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useType("ecelon.ai", 6, 1.1); // done ~frame 14
  const searchOut = interpolate(frame, [26, 36], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const searchY = interpolate(frame, [26, 36], [0, -40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const logo = useRise(34, 26, { damping: 14, stiffness: 200, mass: 0.8 });
  const tag = useRise(46, 16);
  const cta = useRise(56, 20, { damping: 12, stiffness: 240, mass: 0.7 });
  const ctaPulse = frame > 74 ? 1 + Math.sin((frame - 74) / 7) * 0.02 : 1;
  const bloom = interpolate(frame, [34, 46, 90], [0, 0.5, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Rays intensity={0.8} />
      {/* search bar */}
      {searchOut > 0.01 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: searchOut, transform: `translateY(${searchY}px)` }}>
          <div style={{ width: 760, height: 76, borderRadius: 999, backgroundColor: "rgba(20,20,24,0.85)", backdropFilter: "blur(20px)", border: `1px solid ${U.hairline}`, display: "flex", alignItems: "center", gap: 16, padding: "0 28px", boxShadow: U.elevFloat }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={U.text2} strokeWidth={1.8} strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <span style={{ fontFamily: U.font, fontSize: 28, color: U.white, letterSpacing: "0.01em" }}>
              {t.shown}
              {t.caret && !t.done ? <span style={{ opacity: 0.7 }}>|</span> : null}
              {t.done ? <span style={{ opacity: 0.7 }}>|</span> : null}
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* brand + waitlist */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "absolute", width: 900, height: 500, borderRadius: "50%", filter: "blur(120px)", backgroundColor: U.orange, opacity: bloom * 0.4, pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 30, opacity: logo.opacity, transform: logo.transform }}>
          <FacetMark width={110} facetProgress={[1, 1, 1, 1, 1]} color="#FFFFFF" />
          <Wordmark fontSize={92} color="#FFFFFF" />
        </div>
        <div style={{ marginTop: 26, fontFamily: U.font, fontWeight: 600, fontSize: 30, color: U.text2, opacity: tag.opacity, transform: tag.transform }}>
          The AI-Agent Operating System for Modern Investors
        </div>
        <div style={{ marginTop: 40, opacity: cta.opacity, transform: `${cta.transform} scale(${ctaPulse})` }}>
          <div style={{ fontFamily: U.font, fontWeight: 700, fontSize: 28, color: "#fff", backgroundColor: U.orangeCta, padding: "20px 56px", borderRadius: 999, boxShadow: U.glowCta }}>Join the waitlist</div>
        </div>
        <div style={{ marginTop: 20, fontFamily: U.font, fontSize: 22, color: U.text3, opacity: cta.opacity }}>ecelon.ai</div>
      </AbsoluteFill>
      <Grain opacity={0.04} />
    </AbsoluteFill>
  );
};
