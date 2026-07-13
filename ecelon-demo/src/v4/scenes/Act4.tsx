import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { V4 } from "../theme";
import { T, DUR } from "../timeline";
import { TypeOn, KineticLine, CountUp } from "../components/text";
import { PlusGrid } from "../components/vfx";
import { SingleFacet, FacetMark, FACETS } from "../components/FacetMark";

// ACT 4 — the product burst. Real facts only (§1 of the brief).

const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      backgroundColor: V4.panel,
      border: `1px solid ${V4.panelBorder}`,
      borderRadius: 22,
      boxShadow: "inset 0 1px 0 rgba(245,245,247,0.06), 0 30px 80px rgba(0,0,0,0.6)",
      ...style,
    }}
  >
    {children}
  </div>
);

const Pop: React.FC<{ delay: number; children: React.ReactNode; from?: number; style?: React.CSSProperties }> = ({
  delay,
  children,
  from = 26,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 17, stiffness: 240, mass: 0.7 } });
  return (
    <div style={{ opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * from}px)`, ...style }}>
      {children}
    </div>
  );
};

/* ---------------- 4a — the money shot ---------------- */

const PROMPT = "Trade momentum on large-caps. Cap my risk at 2% a day.";
const TYPE_END = 52; // prompt finishes typing
const BT_START = 60; // backtest sweep
const DEPLOY = 122; // status flips
const FEED = [
  { agent: "Alpha Trader", txt: "opened NVDA @ $142.80", tag: "BUY", when: "2m" },
  { agent: "Mean Reversion", txt: "closed SPY ▲ +1.2%", tag: "SELL", when: "14m" },
  { agent: "Risk Agent", txt: "flagged beta at 1.34", tag: "FLAG", when: "22m" },
  { agent: "Macro Research", txt: "published a dovish Fed brief", tag: "BRIEF", when: "31m" },
];

const Composer: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, DUR.a4a], [1.0, 1.05]);
  const deployed = frame >= DEPLOY;

  // seeded equity curve, gently upward
  const N = 56;
  const pts: string[] = [];
  let y = 300;
  for (let i = 0; i < N; i++) {
    const r = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
    y += ((r - Math.floor(r)) - 0.56) * 34;
    y = Math.max(70, Math.min(330, y));
    pts.push(`${(i / (N - 1)) * 880},${y}`);
  }
  const draw = interpolate(frame, [BT_START, BT_START + 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const len = 1400;

  return (
    <AbsoluteFill style={{ backgroundColor: V4.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `scale(${zoom})` }}>
        <Panel style={{ width: 1440, padding: 44 }}>
          {/* header — full five-facet mark in-product (brand review finding) */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <FacetMark width={54} facetProgress={[1, 1, 1, 1, 1]} />
            <span style={{ fontFamily: V4.font, fontWeight: 600, fontSize: 24, color: V4.dim }}>
              ecelon — new strategy
            </span>
            <div
              style={{
                marginLeft: "auto",
                fontFamily: V4.font,
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: "0.08em",
                padding: "8px 18px",
                borderRadius: 999,
                color: deployed ? V4.orangeDeep : V4.dim,
                border: `1.5px solid ${deployed ? V4.orangeDeep : "rgba(245,245,247,0.25)"}`,
                backgroundColor: deployed ? "rgba(255,75,0,0.12)" : "transparent",
              }}
            >
              {frame < BT_START ? "DRAFT" : deployed ? "DEPLOYED · LIVE — PAPER" : "BACKTESTING…"}
            </div>
          </div>

          {/* strategy input */}
          <div
            style={{
              border: `1.5px solid ${frame >= TYPE_END && frame < TYPE_END + 8 ? V4.orange : "rgba(245,245,247,0.14)"}`,
              borderRadius: 14,
              padding: "24px 28px",
              fontFamily: V4.font,
              fontWeight: 500,
              fontSize: 31,
              color: V4.white,
              minHeight: 92,
            }}
          >
            <TypeOn text={PROMPT} startFrame={6} charsPerFrame={1.25} />
          </div>

          {/* backtest area */}
          <div style={{ display: "flex", gap: 30, marginTop: 30, opacity: interpolate(frame, [BT_START - 4, BT_START + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ position: "relative", width: 920, height: 380, overflow: "hidden", borderRadius: 14, border: "1px solid rgba(245,245,247,0.08)" }}>
              <PlusGrid opacity={0.07} cell={56} />
              <svg width={920} height={380} viewBox="0 0 920 380" style={{ position: "absolute", left: 20, top: 10 }}>
                <polyline
                  points={pts.join(" ")}
                  fill="none"
                  stroke={V4.orange}
                  strokeWidth={4}
                  strokeDasharray={len}
                  strokeDashoffset={len * (1 - draw)}
                  style={{ filter: "drop-shadow(0 0 8px rgba(255,75,0,0.55))" }}
                />
              </svg>
              <div style={{ position: "absolute", left: 24, top: 18, fontFamily: V4.mono, fontSize: 17, letterSpacing: 2, color: V4.faint }}>
                BACKTEST · 2019 → 2025 · HISTORICAL MARKET DATA
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, justifyContent: "center" }}>
              {[
                { k: "Win rate", v: "68%", d: BT_START + 42 },
                { k: "Max drawdown", v: "−4.2%", d: BT_START + 48 },
                { k: "Risk cap honored", v: "2% / day", d: BT_START + 54 },
              ].map((m) => (
                <Pop key={m.k} delay={m.d}>
                  <div style={{ width: 380, padding: "20px 26px", borderRadius: 14, border: "1px solid rgba(245,245,247,0.10)", backgroundColor: "rgba(245,245,247,0.03)" }}>
                    <div style={{ fontFamily: V4.font, fontSize: 21, color: V4.dim }}>{m.k}</div>
                    <div style={{ fontFamily: V4.font, fontWeight: 800, fontSize: 42, color: V4.white, marginTop: 2 }}>{m.v}</div>
                  </div>
                </Pop>
              ))}
            </div>
          </div>

          {/* live feed */}
          <div style={{ marginTop: 28 }}>
            {FEED.map((f, i) => (
              <Pop key={f.agent} delay={DEPLOY + 8 + i * 9} from={18}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "13px 20px",
                    borderRadius: 12,
                    marginBottom: 8,
                    backgroundColor: i === 0 ? "rgba(255,75,0,0.09)" : "rgba(245,245,247,0.03)",
                    border: `1px solid ${i === 0 ? "rgba(255,75,0,0.35)" : "rgba(245,245,247,0.07)"}`,
                  }}
                >
                  <span style={{ fontFamily: V4.font, fontWeight: 700, fontSize: 23, color: V4.white }}>{f.agent}</span>
                  <span style={{ fontFamily: V4.font, fontSize: 23, color: V4.dim }}>{f.txt}</span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: V4.font,
                      fontWeight: 800,
                      fontSize: 17,
                      letterSpacing: "0.1em",
                      color: i === 0 ? V4.orange : V4.dim,
                      border: `1.5px solid ${i === 0 ? V4.orange : "rgba(245,245,247,0.25)"}`,
                      borderRadius: 8,
                      padding: "4px 12px",
                    }}
                  >
                    {f.tag}
                  </span>
                  <span style={{ fontFamily: V4.font, fontSize: 20, color: V4.faint, width: 52, textAlign: "right" }}>{f.when}</span>
                </div>
              </Pop>
            ))}
          </div>
        </Panel>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 4b — trust counterpunch ---------------- */

const LIMITS = [
  { k: "Max position size", v: "8% of book", hard: false, d: 34 },
  { k: "Daily loss cap", v: "2%", hard: false, d: 46 },
  { k: "Withdraw funds", v: "NEVER ALLOWED", hard: true, d: 58 },
];
const TRUST = ["Approvals stay with you", "Hard limits, enforced", "Every action logged"];

const Trust: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: V4.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center" }}>
        <KineticLine text="Their algorithms answer to no one." delay={2} fontSize={54} fontWeight={600} color={V4.dim} />
        <div style={{ height: 10 }} />
        <KineticLine text="{orange:Yours} answer to you." delay={16} fontSize={72} fontWeight={800} punchy />
      </div>

      <Pop delay={26}>
        <Panel style={{ width: 900, padding: 40, marginTop: 130 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 18,
                background: `linear-gradient(140deg, ${V4.orangeHi}, ${V4.orangeDeep})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: V4.font,
                fontWeight: 800,
                fontSize: 26,
                color: "#fff",
              }}
            >
              AT
            </div>
            <div>
              <div style={{ fontFamily: V4.font, fontWeight: 700, fontSize: 34, color: V4.white }}>Alpha Trader</div>
              <div style={{ fontFamily: V4.font, fontSize: 22, color: V4.dim, marginTop: 2 }}>Autonomous · Momentum</div>
            </div>
            <div
              style={{
                marginLeft: "auto",
                fontFamily: V4.font,
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: "0.1em",
                color: V4.orange,
                border: `1.5px solid rgba(255,107,44,0.5)`,
                borderRadius: 999,
                padding: "7px 16px",
              }}
            >
              LIVE — PAPER
            </div>
          </div>

          <div style={{ marginTop: 28, borderTop: "1px solid rgba(245,245,247,0.08)", paddingTop: 10 }}>
            {LIMITS.map((l) => (
              <Pop key={l.k} delay={l.d} from={16}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px 6px",
                    borderBottom: "1px solid rgba(245,245,247,0.06)",
                  }}
                >
                  <span style={{ fontFamily: V4.font, fontSize: 27, color: V4.dim }}>{l.k}</span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: V4.font,
                      fontWeight: 800,
                      fontSize: 27,
                      letterSpacing: l.hard ? "0.06em" : undefined,
                      color: l.hard ? V4.orangeDeep : V4.white,
                    }}
                  >
                    {l.hard ? (
                      <svg width={22} height={26} viewBox="0 0 20 24" style={{ marginRight: 10, verticalAlign: "-3px" }}>
                        <rect x="2" y="10" width="16" height="12" rx="2.5" fill={V4.orangeDeep} />
                        <path d="M 5.5 10 v -3 a 4.5 4.5 0 0 1 9 0 v 3" stroke={V4.orangeDeep} strokeWidth="2.6" fill="none" />
                      </svg>
                    ) : (
                      "✓ "
                    )}
                    {l.v}
                  </span>
                </div>
              </Pop>
            ))}
          </div>
        </Panel>
      </Pop>

      <div style={{ position: "absolute", bottom: 84, display: "flex", gap: 22 }}>
        {TRUST.map((t, i) => (
          <Pop key={t} delay={92 + i * 7}>
            <div
              style={{
                fontFamily: V4.font,
                fontWeight: 600,
                fontSize: 24,
                color: V4.white,
                padding: "14px 26px",
                borderRadius: 999,
                border: "1.5px solid rgba(245,245,247,0.18)",
                backgroundColor: "rgba(245,245,247,0.04)",
              }}
            >
              {t}
            </div>
          </Pop>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 4c — proof: 71% + brokers + verified ---------------- */

const BROKERS = ["Alpaca", "Binance", "Coinbase", "Robinhood", "Kraken", "eToro"];

const Proof: React.FC = () => {
  const frame = useCurrentFrame();
  const statLift = interpolate(frame, [52, 70], [0, -120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const statScale = interpolate(frame, [52, 70], [1, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: V4.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `translateY(${statLift}px) scale(${statScale})` }}>
        <div style={{ fontFamily: V4.font, fontSize: 30, letterSpacing: "0.2em", color: V4.dim }}>
          TOP AGENT WIN RATE
        </div>
        <div
          style={{
            fontFamily: V4.font,
            fontWeight: 800,
            fontSize: 260,
            lineHeight: 1,
            color: V4.white,
            letterSpacing: "-0.04em",
            textShadow: "0 0 80px rgba(255,75,0,0.35)",
          }}
        >
          <CountUp to={71} startFrame={6} durationFrames={40} overshoot format={(v) => `${Math.round(v)}%`} />
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 250, display: "flex", gap: 18 }}>
        {BROKERS.map((b, i) => (
          <Pop key={b} delay={62 + i * 5}>
            <div
              style={{
                fontFamily: V4.font,
                fontWeight: 700,
                fontSize: 28,
                color: V4.white,
                padding: "16px 30px",
                borderRadius: 16,
                border: "1px solid rgba(245,245,247,0.14)",
                backgroundColor: "rgba(245,245,247,0.04)",
              }}
            >
              {b}
            </div>
          </Pop>
        ))}
      </div>

      <Pop delay={96}>
        <div
          style={{
            position: "absolute",
            bottom: 90,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 28px",
            borderRadius: 999,
            border: "1.5px solid rgba(255,107,44,0.45)",
            backgroundColor: "rgba(255,75,0,0.08)",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontFamily: V4.font, fontWeight: 700, fontSize: 24, color: V4.orange }}>
            ✓ Broker-linked & verified
          </span>
          <span style={{ fontFamily: V4.font, fontSize: 24, color: V4.dim }}>
            track records — not screenshots · +47.20% top annual ROI
          </span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

/* ---------------- 4d — five facets, five layers ---------------- */

const Layers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: V4.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 86, alignItems: "flex-end", perspective: 1200 }}>
        {FACETS.map((f, i) => {
          const s = spring({ frame: frame - 8 - i * 9, fps, config: { damping: 15, stiffness: 170, mass: 0.9 } });
          return (
            <div
              key={f.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 26,
                opacity: Math.min(1, s * 1.4),
                transform: `translateY(${(1 - s) * 60}px) rotateY(${(1 - s) * 45}deg)`,
              }}
            >
              <div style={{ height: 120, display: "flex", alignItems: "center" }}>
                <SingleFacet index={i} width={i === 2 ? 96 : 100} glow={0.25} />
              </div>
              <div
                style={{
                  fontFamily: V4.font,
                  fontWeight: 600,
                  fontSize: 25,
                  color: V4.dim,
                  whiteSpace: "nowrap",
                }}
              >
                {f.label}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 130 }}>
        <KineticLine text="Five layers. {orange:One} desk." delay={62} fontSize={64} fontWeight={800} />
      </div>
    </AbsoluteFill>
  );
};

export const Act4: React.FC = () => (
  <>
    <Sequence from={T.a4a} durationInFrames={DUR.a4a}>
      <Composer />
    </Sequence>
    <Sequence from={T.a4b} durationInFrames={DUR.a4b}>
      <Trust />
    </Sequence>
    <Sequence from={T.a4c} durationInFrames={DUR.a4c}>
      <Proof />
    </Sequence>
    <Sequence from={T.a4d} durationInFrames={DUR.a4d}>
      <Layers />
    </Sequence>
  </>
);
