import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { U, MARKETS } from "../theme";
import { Rays, GlowField, Grain, Card, Dot, useRise, CountUp } from "../components/kit";
import { Frame } from "../components/chrome";
import { FacetMark, Wordmark } from "../../v4/components/FacetMark";

/* ============ Scene 1 — PROBLEM: the missed 3AM trade ============ */
const CANDLES = 52;
const pser = (() => {
  let p = 300;
  const a: { o: number; c: number; h: number; l: number }[] = [];
  for (let i = 0; i < CANDLES; i++) {
    // dip to an oversold long-setup around i=22, then run up hard
    const drift = i < 22 ? -5 : i === 22 ? 0 : 7.5;
    const o = p;
    const r = Math.sin(i * 12.9898) * 43758.5453;
    const c = o + drift + ((r - Math.floor(r)) - 0.5) * 9;
    const h = Math.max(o, c) + (Math.sin(i * 3.1) * 0.5 + 0.5) * 6;
    const l = Math.min(o, c) - (Math.sin(i * 7.7) * 0.5 + 0.5) * 6;
    a.push({ o, c, h, l });
    p = c;
  }
  return a;
})();
const ENTRY = 23;
const CW = 1400, CH = 560, PAD = 40;
const vals = pser.flatMap((c) => [c.h, c.l]);
const vmin = Math.min(...vals), vmax = Math.max(...vals);
const yOf = (v: number) => PAD + (1 - (v - vmin) / (vmax - vmin)) * (CH - 2 * PAD);

export const ProblemChart: React.FC = () => {
  const frame = useCurrentFrame();
  const built = Math.floor(interpolate(frame, [4, 64], [0, CANDLES], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const push = interpolate(frame, [0, 90], [1, 1.04]);
  const cw = CW / CANDLES;
  const markerOn = built > ENTRY;
  const pulse = markerOn ? 0.5 + 0.5 * Math.abs(Math.sin((frame - 40) / 6)) : 0;
  const ex = ENTRY * cw + cw / 2, ey = yOf(pser[ENTRY].l) + 24;
  return (
    <AbsoluteFill style={{ backgroundColor: U.bg, justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
      <GlowField intensity={0.5} />
      <div style={{ transform: `scale(${push})`, width: CW }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 10, opacity: interpolate(frame, [2, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: U.font, fontWeight: 800, fontSize: 26, color: U.white }}>BTCUSDT</span>
          <span style={{ fontFamily: U.mono, fontSize: 20, color: U.text3, letterSpacing: 2 }}>3:14 AM</span>
          <span style={{ marginLeft: "auto", fontFamily: U.font, fontSize: 18, color: U.text3 }}>5m · live</span>
        </div>
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ display: "block" }}>
          {pser.slice(0, built).map((c, i) => {
            const x = i * cw + cw / 2;
            const up = c.c >= c.o;
            const col = up ? U.orange : "rgba(245,245,247,0.32)";
            return (
              <g key={i}>
                <line x1={x} x2={x} y1={yOf(c.h)} y2={yOf(c.l)} stroke={col} strokeWidth={1.4} />
                <rect x={x - cw * 0.3} width={cw * 0.6} y={yOf(Math.max(c.o, c.c))} height={Math.max(1, Math.abs(yOf(c.o) - yOf(c.c)))} fill={col} />
              </g>
            );
          })}
          {markerOn && (
            <g>
              <circle cx={ex} cy={ey} r={9 + pulse * 5} fill="none" stroke={U.orange} strokeWidth={2} opacity={0.9 - pulse * 0.4} />
              <circle cx={ex} cy={ey} r={5} fill={U.orange} />
              <text x={ex} y={ey + 40} fill={U.orangeHi} fontFamily={U.font} fontSize={17} fontWeight={700} textAnchor="middle">LONG setup</text>
            </g>
          )}
        </svg>
      </div>
      <Grain opacity={0.04} />
    </AbsoluteFill>
  );
};

/* ============ Scene 2 — TENSION: two failing options ============ */
const ProblemCard: React.FC<{ delay: number; title: string; body: string; icon: "box" | "wallet"; glitch?: boolean }> = ({ delay, title, body, icon, glitch }) => {
  const r = useRise(delay, 26, { damping: 13, stiffness: 280, mass: 0.6 });
  const frame = useCurrentFrame();
  const gx = glitch && frame > delay + 20 && frame < delay + 26 ? (Math.sin(frame * 9) * 4) : 0;
  return (
    <div style={{ width: 460, opacity: r.opacity, transform: `${r.transform} translateX(${gx}px)` }}>
      <Card style={{ padding: 34, height: 300, display: "flex", flexDirection: "column" }}>
        <div style={{ width: 68, height: 68, borderRadius: 18, border: `1.5px solid ${U.hairline}`, backgroundColor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          {icon === "box" ? (
            <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={U.text2} strokeWidth={1.6}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M4 4l16 16" stroke={U.orangeHi} /></svg>
          ) : (
            <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={U.text2} strokeWidth={1.6}><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M16 12h3" /></svg>
          )}
        </div>
        <div style={{ fontFamily: U.font, fontWeight: 800, fontSize: 30, color: U.white, letterSpacing: "-0.02em" }}>{title}</div>
        <div style={{ fontFamily: U.font, fontSize: 20, color: U.text2, marginTop: 14, lineHeight: 1.45 }}>{body}</div>
      </Card>
    </div>
  );
};

export const TensionCards: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: U.bg, justifyContent: "center", alignItems: "center" }}>
    <GlowField intensity={0.6} />
    <div style={{ display: "flex", gap: 30 }}>
      <ProblemCard delay={4} icon="box" title="A black box." body="Bots you can't see inside. You never know why they trade." />
      <ProblemCard delay={10} icon="wallet" title="Your funds, gone." body="Bots that hold your money — and hope you trust them." glitch />
    </div>
    <Grain opacity={0.04} />
  </AbsoluteFill>
);

/* ============ Scene 3 — BRAND reveal ============ */
export const BrandReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = spring({ frame: frame - 4, fps, config: { damping: 13, stiffness: 220, mass: 0.8 } });
  const tag = useRise(20, 16);
  const chipsIn = interpolate(frame, [34, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Rays intensity={1} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: Math.min(1, mark * 1.5), transform: `scale(${0.85 + mark * 0.15})` }}>
          <FacetMark width={120} facetProgress={[1, 1, 1, 1, 1]} color="#FFFFFF" />
          <Wordmark fontSize={96} color="#FFFFFF" />
        </div>
        <div style={{ marginTop: 28, fontFamily: U.font, fontWeight: 700, fontSize: 34, color: U.white, opacity: tag.opacity, transform: tag.transform }}>
          Build intelligence. <span style={{ color: U.orange }}>Keep control.</span>
        </div>
        <div style={{ marginTop: 30, display: "flex", gap: 14 }}>
          {MARKETS.map((m, i) => (
            <div key={m} style={{ opacity: interpolate(chipsIn, [i / MARKETS.length, (i + 1) / MARKETS.length], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontFamily: U.font, fontWeight: 600, fontSize: 20, color: U.text2, padding: "10px 24px", borderRadius: 999, border: `1px solid ${U.hairline}`, backgroundColor: "rgba(255,255,255,0.04)" }}>{m}</div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============ Scene 11 — Connections (custody) ============ */
export const Connections: React.FC = () => {
  const frame = useCurrentFrame();
  const shield = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Frame active="agents" page="Agents">
      <AbsoluteFill style={{ padding: "40px 60px", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <Dot pulse />
          <span style={{ fontFamily: U.font, fontWeight: 800, fontSize: 34, color: U.white }}>Connections</span>
          <span style={{ marginLeft: "auto", fontFamily: U.font, fontSize: 18, color: U.text3 }}>Paper venues</span>
        </div>
        <div style={{ fontFamily: U.font, fontSize: 22, color: U.text2, marginBottom: 26, maxWidth: 1100, lineHeight: 1.5 }}>
          Agents read data from and trade through your own venues.{" "}
          <span style={{ color: U.white, position: "relative" }}>
            Ecelon never holds your funds.
            <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={U.orange} strokeWidth={1.8} style={{ verticalAlign: "-6px", marginLeft: 12, filter: `drop-shadow(0 0 ${shield * 10}px rgba(255,106,44,0.7))`, opacity: shield }}>
              <path d="M12 2l8 3v6c0 5-3.5 8-8 11-4.5-3-8-6-8-11V5l8-3z" strokeDasharray={60} strokeDashoffset={60 * (1 - shield)} />
              <path d="M8.5 12l2.5 2.5 4.5-5" strokeDasharray={14} strokeDashoffset={14 * (1 - Math.max(0, shield * 2 - 1))} />
            </svg>
          </span>
        </div>
        <Card style={{ padding: 34 }}>
          <div style={{ fontFamily: U.font, fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", color: U.text3, marginBottom: 18 }}>LINKED</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, backgroundColor: "#F0B90B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: U.font, fontWeight: 800, fontSize: 26, color: "#0A0A0B" }}>B</div>
            <div>
              <div style={{ fontFamily: U.font, fontWeight: 700, fontSize: 26, color: U.white }}>Binance</div>
              <div style={{ fontFamily: U.font, fontSize: 18, color: U.text2, marginTop: 2 }}>read + trade scope</div>
            </div>
            <div style={{ marginLeft: "auto", fontFamily: U.font, fontWeight: 700, fontSize: 18, color: U.orange, border: `1.5px solid rgba(255,106,44,0.5)`, padding: "12px 28px", borderRadius: 999 }}>Revoke</div>
          </div>
        </Card>
      </AbsoluteFill>
    </Frame>
  );
};
