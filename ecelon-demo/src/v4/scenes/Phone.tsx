import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { V4 } from "../theme";
import { T, DUR } from "../timeline";
import { FacetMark, Wordmark } from "../components/FacetMark";
import { GlowField } from "../components/ios";
import { AGENTS, LIVE_FEED, COMMUNITY_POST, STRATEGY_PROMPT, WIN_RATE, agent } from "../config/agents";
import { beatPulse } from "../config/beatmap";

// THE PHONE — flies up from the bottom AS THE DRUMS ENTER, does a full 180°
// flip (back → face), then scrolls the LIGHT-MODE beta app while the three
// how-captions land on riff onsets beside it.

const PHONE_W = 424;
const PHONE_H = 866;
const SCR_W = 392;
const SCR_H = 834;

// scroll pauses aligned to the caption onsets (rel frames 73 / 136 / 198)
const scrollY = (f: number) =>
  interpolate(f, [66, 106, 136, 172, 198, 238], [0, 620, 620, 1000, 1000, 1200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

const CAPTIONS = [
  { n: "01", line: "Type your strategy.", at: 73 },
  { n: "02", line: "Agents backtest it.", at: 136 },
  { n: "03", line: "They execute. Live.", at: 198 },
];

/* ---------- light-mode app screen (iOS grouped style) ---------- */

const LCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ backgroundColor: "#FFFFFF", borderRadius: 22, padding: "20px 22px", boxShadow: "0 2px 14px rgba(0,0,0,0.06)", ...style }}>
    {children}
  </div>
);

const Spark: React.FC = () => {
  const pts: string[] = [];
  let y = 66;
  for (let i = 0; i < 34; i++) {
    const r = Math.sin(i * 12.9898 + 7.7) * 43758.5453;
    y += ((r - Math.floor(r)) - 0.62) * 14;
    y = Math.max(10, Math.min(80, y));
    pts.push(`${(i / 33) * 330},${y}`);
  }
  return (
    <svg width={330} height={90} viewBox="0 0 330 90">
      <polyline points={pts.join(" ")} fill="none" stroke={V4.neon} strokeWidth={3.5} strokeLinecap="round" />
    </svg>
  );
};

const AGENT_ROWS = AGENTS.slice(0, 4);
const FEED_ROWS = LIVE_FEED.slice(0, 3);

const LightApp: React.FC<{ scroll: number }> = ({ scroll }) => {
  const F = V4.font;
  const label: React.CSSProperties = { fontFamily: F, fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", color: "#8E8E93", margin: "26px 4px 10px" };
  return (
    <div style={{ width: SCR_W, height: SCR_H, borderRadius: 48, overflow: "hidden", backgroundColor: "#F2F2F7", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-scroll}px)` }}>
        {/* status bar + header */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 28px 0", fontFamily: F, fontWeight: 700, fontSize: 16, color: "#0A0A0B" }}>
          <span>9:41</span>
          <span>●●●</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 22px 0" }}>
          <FacetMark width={34} facetProgress={[1, 1, 1, 1, 1]} color={V4.neon} />
          <Wordmark fontSize={26} color="#0A0A0B" />
          <span style={{ marginLeft: "auto", fontFamily: F, fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", color: V4.neon, border: `1.5px solid ${V4.neon}`, borderRadius: 999, padding: "4px 10px" }}>
            BETA
          </span>
        </div>

        <div style={{ padding: "0 16px 40px" }}>
          {/* portfolio */}
          <div style={label}>PAPER PORTFOLIO</div>
          <LCard>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 40, color: "#0A0A0B", letterSpacing: "-0.02em" }}>$104,392.18</div>
            <div style={{ display: "inline-block", marginTop: 8, fontFamily: F, fontWeight: 700, fontSize: 15, color: "#FFFFFF", backgroundColor: V4.neon, borderRadius: 999, padding: "5px 12px" }}>
              ▲ +4.2% this month
            </div>
            <div style={{ marginTop: 14 }}>
              <Spark />
            </div>
          </LCard>

          {/* agents */}
          <div style={label}>YOUR AGENTS</div>
          <LCard style={{ padding: "6px 0" }}>
            {AGENT_ROWS.map((a, i) => (
              <div key={a.key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderTop: i > 0 ? "1px solid #E5E5EA" : "none" }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: i === 0 ? V4.neon : "#F2F2F7", color: i === 0 ? "#fff" : "#0A0A0B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 800, fontSize: 15 }}>
                  {a.initials}
                </div>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 17, color: "#0A0A0B" }}>{a.name}</div>
                  <div style={{ fontFamily: F, fontSize: 14.5, color: "#6E6E73", marginTop: 1 }}>{a.oneLiner}</div>
                </div>
                <span style={{ marginLeft: "auto", width: 9, height: 9, borderRadius: 999, backgroundColor: V4.neon }} />
              </div>
            ))}
          </LCard>

          {/* composer */}
          <div style={label}>NEW STRATEGY</div>
          <LCard>
            <div style={{ fontFamily: F, fontSize: 16.5, color: "#0A0A0B", lineHeight: 1.5, border: "1.5px solid #E5E5EA", borderRadius: 14, padding: "14px 16px" }}>
              {STRATEGY_PROMPT}
            </div>
            <div style={{ marginTop: 14, fontFamily: F, fontWeight: 800, fontSize: 17, textAlign: "center", color: "#FFFFFF", backgroundColor: V4.neon, borderRadius: 999, padding: "13px 0" }}>
              Backtest
            </div>
          </LCard>

          {/* backtest result */}
          <div style={label}>BACKTEST · 2019 → 2025</div>
          <LCard>
            <Spark />
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              {[
                ["Win rate", `${WIN_RATE}%`],
                ["Drawdown", "−4.2%"],
                ["Risk cap", "2%/day"],
              ].map(([k, v]) => (
                <div key={k} style={{ flex: 1, backgroundColor: "#F2F2F7", borderRadius: 13, padding: "10px 12px" }}>
                  <div style={{ fontFamily: F, fontSize: 12.5, color: "#8E8E93" }}>{k}</div>
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 19, color: "#0A0A0B", marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </LCard>

          {/* live feed */}
          <div style={label}>LIVE — PAPER TRADING</div>
          <LCard style={{ padding: "6px 0" }}>
            {FEED_ROWS.map((r, i) => (
              <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 20px", borderTop: i > 0 ? "1px solid #E5E5EA" : "none" }}>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 15.5, color: "#0A0A0B" }}>{agent(r.key).name}</div>
                  <div style={{ fontFamily: F, fontSize: 14.5, color: "#6E6E73", marginTop: 1 }}>{r.txt}</div>
                </div>
                <span style={{ marginLeft: "auto", fontFamily: F, fontWeight: 800, fontSize: 12, letterSpacing: "0.08em", color: V4.neon, border: `1.5px solid ${V4.neon}`, borderRadius: 999, padding: "3px 10px" }}>
                  {r.tag}
                </span>
              </div>
            ))}
          </LCard>

          {/* community — the social layer */}
          <div style={label}>COMMUNITY</div>
          <LCard>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 999, backgroundColor: "#0A0A0B", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 800, fontSize: 15 }}>
                JD
              </div>
              <div>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: "#0A0A0B" }}>{COMMUNITY_POST.user}</div>
                <div style={{ fontFamily: F, fontSize: 14, color: "#6E6E73" }}>shared a strategy · 2h</div>
              </div>
              <span style={{ marginLeft: "auto", fontFamily: F, fontWeight: 800, fontSize: 15, color: "#0A0A0B" }}>{COMMUNITY_POST.pct}</span>
            </div>
            <div style={{ marginTop: 12, fontFamily: F, fontSize: 15.5, color: "#0A0A0B", lineHeight: 1.45 }}>
              “{COMMUNITY_POST.quote}”
            </div>
            <div style={{ marginTop: 14, fontFamily: F, fontWeight: 800, fontSize: 15.5, textAlign: "center", color: V4.neon, border: `1.5px solid ${V4.neon}`, borderRadius: 999, padding: "11px 0" }}>
              Copy strategy
            </div>
          </LCard>

          {/* markets */}
          <div style={label}>EVERY MARKET</div>
          <LCard>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Stocks", "ETFs", "Crypto", "Memecoins", "Predictions", "Metals", "Futures"].map((m, i) => (
                <span key={m} style={{ fontFamily: F, fontWeight: 700, fontSize: 14.5, color: i % 3 === 1 ? "#fff" : "#0A0A0B", backgroundColor: i % 3 === 1 ? V4.neon : "#F2F2F7", borderRadius: 999, padding: "8px 14px" }}>
                  {m}
                </span>
              ))}
            </div>
          </LCard>

          {/* CTA */}
          <div style={{ marginTop: 28, fontFamily: F, fontWeight: 800, fontSize: 19, textAlign: "center", color: "#FFFFFF", backgroundColor: "#0A0A0B", borderRadius: 999, padding: "16px 0" }}>
            Get started
          </div>
          <div style={{ marginTop: 12, textAlign: "center", fontFamily: F, fontSize: 13.5, color: "#6E6E73" }}>
            Ecelon Beta · Paper trading · Live markets, no real funds
          </div>
        </div>
      </div>

      {/* notch */}
      <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 120, height: 30, borderRadius: 999, backgroundColor: "#0A0A0B" }} />
    </div>
  );
};

/* ---------- the phone itself ---------- */

const PhoneBody: React.FC<{ rel: number }> = ({ rel }) => {
  const { fps } = useVideoConfig();
  // entrance: rise + full 180° flip over the first 60 frames (drum fill)
  const rise = spring({ frame: rel, fps, config: { damping: 16, stiffness: 90, mass: 1.1 } });
  const y = (1 - rise) * 1150;
  const flip = interpolate(rel, [0, 58], [180, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // after landing: a living sway so it never sits still
  const sway = rel > 58 ? Math.sin((rel - 58) / 34) * 5 - 7 : 0;
  const tiltX = rel > 58 ? Math.cos((rel - 58) / 41) * 3 : interpolate(rel, [0, 58], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const showBack = ((flip % 360) + 360) % 360 > 90 && ((flip % 360) + 360) % 360 < 270;

  return (
    <div style={{ perspective: 1700, transform: `translateY(${y}px)` }}>
      <div
        style={{
          width: PHONE_W,
          height: PHONE_H,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateY(${flip + sway}deg) rotateX(${tiltX}deg)`,
        }}
      >
        {/* FRONT */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 58,
            backgroundColor: "#1C1C1E",
            padding: (PHONE_W - SCR_W) / 2,
            boxShadow: "0 60px 140px rgba(0,0,0,0.65), inset 0 0 0 2px rgba(255,255,255,0.14)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <LightApp scroll={scrollY(rel)} />
          {/* moving glare */}
          <div
            style={{
              position: "absolute",
              inset: 16,
              borderRadius: 48,
              background: `linear-gradient(${115 + Math.sin(rel / 50) * 10}deg, rgba(255,255,255,0.14) 0%, transparent 28%)`,
              pointerEvents: "none",
            }}
          />
        </div>
        {/* BACK */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 58,
            backgroundColor: "#141416",
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: "0 60px 140px rgba(0,0,0,0.65), inset 0 0 0 2px rgba(255,255,255,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: showBack ? 1 : 0,
          }}
        >
          <div style={{ position: "absolute", top: 26, left: 26, width: 110, height: 110, borderRadius: 34, backgroundColor: "#0C0C0E", border: "1px solid rgba(255,255,255,0.10)" }} />
          <FacetMark width={92} facetProgress={[1, 1, 1, 1, 1]} color={V4.neon} />
        </div>
      </div>
    </div>
  );
};

const PhoneScene: React.FC = () => {
  const rel = useCurrentFrame();
  // slow push-in for the whole scene (a "camera move") + a beat-synced
  // scale-breath on the pedestal glow so the frame never sits dead still
  const push = interpolate(rel, [0, DUR.phone], [1, 1.045], { extrapolateRight: "clamp" });
  const pulse = beatPulse(T.phone + rel);
  return (
    <AbsoluteFill style={{ backgroundColor: V4.bg, justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <GlowField intensity={1.2} />
        {/* neon pedestal glow under the phone — breathes on the beat.
            Blurred solid ellipse, not a radial-gradient — the brief's #1
            banding complaint was specifically this glow. */}
        <div style={{ position: "absolute", bottom: -420, left: "50%", width: 1400, height: 800, transform: "translateX(-50%)", filter: "blur(110px)", pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              backgroundColor: V4.neon,
              opacity: 0.3 + pulse * 0.12,
              transform: `scale(${1 + pulse * 0.05})`,
            }}
          />
        </div>

        <div style={{ position: "absolute", left: 330, top: 104 }}>
          <PhoneBody rel={rel} />
        </div>

        {/* the three how-captions, each landing ON a riff onset */}
        <div style={{ position: "absolute", left: 950, top: 320, display: "flex", flexDirection: "column", gap: 74 }}>
          {CAPTIONS.map((c) => (
            <Caption key={c.n} n={c.n} line={c.line} at={c.at} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ n: string; line: string; at: number }> = ({ n, line, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 340, mass: 0.65 } }); // v5: snappier, more overshoot
  const active = frame >= at;
  const ringDraw = interpolate(frame - at, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const C = 2 * Math.PI * 32;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: active ? Math.min(1, s * 1.8) : 0, transform: `translateX(${(1 - s) * 70}px) scale(${0.85 + s * 0.15})` }}>
      <span
        style={{
          position: "relative",
          fontFamily: V4.mono,
          fontSize: 28,
          fontWeight: 700,
          color: V4.neon,
          width: 68,
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width={68} height={68} style={{ position: "absolute", inset: 0 }}>
          <circle cx={34} cy={34} r={32} fill="none" stroke="rgba(255,75,0,0.18)" strokeWidth={2} />
          <circle
            cx={34}
            cy={34}
            r={32}
            fill="none"
            stroke={V4.neon}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - ringDraw)}
            transform="rotate(-90 34 34)"
            style={{ filter: "drop-shadow(0 0 10px rgba(255,75,0,0.6))" }}
          />
        </svg>
        {n}
      </span>
      <span style={{ fontFamily: V4.font, fontWeight: 800, fontSize: 62, letterSpacing: "-0.025em", color: V4.white, whiteSpace: "nowrap" }}>{line}</span>
    </div>
  );
};

export const Phone: React.FC = () => (
  <Sequence from={T.phone} durationInFrames={DUR.phone}>
    <PhoneScene />
  </Sequence>
);
