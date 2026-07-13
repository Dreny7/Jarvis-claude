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
import { FacetMark } from "../components/FacetMark";

// PRODUCT MONTAGE — quick, driving beats. Flat orange gradients only (no sheens).

const ORANGE_GRAD = `linear-gradient(140deg, ${V4.orangeHi}, ${V4.orangeDeep})`;

const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      backgroundColor: V4.panel,
      border: `1px solid ${V4.panelBorder}`,
      borderRadius: 22,
      boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
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
  const s = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 270, mass: 0.6 } });
  return (
    <div style={{ opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * from}px)`, ...style }}>
      {children}
    </div>
  );
};

/* ---------------- p1 — the money shot ---------------- */

const PROMPT = "Trade momentum on large-caps. Cap my risk at 2% a day.";
const TYPE_END = 40;
const BT_START = 46;
const DEPLOY = 104;
const FEED = [
  { agent: "Alpha Trader", txt: "opened NVDA @ $142.80", tag: "BUY", when: "2m" },
  { agent: "Mean Reversion", txt: "closed SPY ▲ +1.2%", tag: "SELL", when: "14m" },
  { agent: "Risk Agent", txt: "flagged beta at 1.34", tag: "FLAG", when: "22m" },
  { agent: "Macro Research", txt: "published a dovish Fed brief", tag: "BRIEF", when: "31m" },
];

const Composer: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, DUR.p1], [1.0, 1.05]);
  const deployed = frame >= DEPLOY;

  const N = 56;
  const pts: string[] = [];
  let y = 300;
  for (let i = 0; i < N; i++) {
    const r = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
    y += ((r - Math.floor(r)) - 0.56) * 34;
    y = Math.max(70, Math.min(330, y));
    pts.push(`${(i / (N - 1)) * 880},${y}`);
  }
  const draw = interpolate(frame, [BT_START, BT_START + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const len = 1400;

  return (
    <AbsoluteFill style={{ backgroundColor: V4.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `scale(${zoom})` }}>
        <Panel style={{ width: 1440, padding: 44 }}>
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
            <TypeOn text={PROMPT} startFrame={4} charsPerFrame={1.6} />
          </div>

          <div style={{ display: "flex", gap: 30, marginTop: 30, opacity: interpolate(frame, [BT_START - 4, BT_START + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ position: "relative", width: 920, height: 360, overflow: "hidden", borderRadius: 14, border: "1px solid rgba(245,245,247,0.08)" }}>
              <PlusGrid opacity={0.07} cell={56} />
              <svg width={920} height={360} viewBox="0 0 920 380" style={{ position: "absolute", left: 20, top: 10 }}>
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
                { k: "Win rate", v: "68%", d: BT_START + 34 },
                { k: "Max drawdown", v: "−4.2%", d: BT_START + 39 },
                { k: "Risk cap honored", v: "2% / day", d: BT_START + 44 },
              ].map((m) => (
                <Pop key={m.k} delay={m.d}>
                  <div style={{ width: 380, padding: "18px 26px", borderRadius: 14, border: "1px solid rgba(245,245,247,0.10)", backgroundColor: "rgba(245,245,247,0.03)" }}>
                    <div style={{ fontFamily: V4.font, fontSize: 21, color: V4.dim }}>{m.k}</div>
                    <div style={{ fontFamily: V4.font, fontWeight: 800, fontSize: 40, color: V4.white, marginTop: 2 }}>{m.v}</div>
                  </div>
                </Pop>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 26 }}>
            {FEED.map((f, i) => (
              <Pop key={f.agent} delay={DEPLOY + 6 + i * 7} from={18}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "12px 20px",
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

/* ---------------- p2 — trust counterpunch ---------------- */

const LIMITS = [
  { k: "Max position size", v: "8% of book", hard: false, d: 24 },
  { k: "Daily loss cap", v: "2%", hard: false, d: 34 },
  { k: "Withdraw funds", v: "NEVER ALLOWED", hard: true, d: 44 },
];
const TRUST = ["Approvals stay with you", "Hard limits, enforced", "Every action logged"];

const Trust: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: V4.bg, justifyContent: "center", alignItems: "center" }}>
    <div style={{ position: "absolute", top: 84, width: "100%", textAlign: "center" }}>
      <KineticLine text="Their algorithms answer to no one." delay={2} stagger={2} fontSize={50} fontWeight={600} color={V4.dim} />
      <div style={{ height: 10 }} />
      <KineticLine text="{orange:Yours} answer to you." delay={12} stagger={2} fontSize={70} fontWeight={800} punchy />
    </div>

    <Pop delay={18}>
      <Panel style={{ width: 900, padding: 40, marginTop: 120 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 18,
              background: ORANGE_GRAD,
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

        <div style={{ marginTop: 26, borderTop: "1px solid rgba(245,245,247,0.08)", paddingTop: 8 }}>
          {LIMITS.map((l) => (
            <Pop key={l.k} delay={l.d} from={16}>
              <div style={{ display: "flex", alignItems: "center", padding: "15px 6px", borderBottom: "1px solid rgba(245,245,247,0.06)" }}>
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

    <div style={{ position: "absolute", bottom: 70, display: "flex", gap: 22 }}>
      {TRUST.map((t, i) => (
        <Pop key={t} delay={62 + i * 5}>
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

/* ---------------- p3 — 71% proof ---------------- */

const Proof: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: V4.bg, justifyContent: "center", alignItems: "center" }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: V4.font, fontSize: 30, letterSpacing: "0.2em", color: V4.dim }}>TOP AGENT WIN RATE</div>
      <div
        style={{
          fontFamily: V4.font,
          fontWeight: 800,
          fontSize: 280,
          lineHeight: 1,
          color: V4.white,
          letterSpacing: "-0.04em",
          textShadow: "0 0 80px rgba(255,75,0,0.35)",
        }}
      >
        <CountUp to={71} startFrame={4} durationFrames={30} overshoot format={(v) => `${Math.round(v)}%`} />
      </div>
      <Pop delay={44}>
        <div
          style={{
            marginTop: 30,
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 28px",
            borderRadius: 999,
            border: "1.5px solid rgba(255,107,44,0.45)",
            backgroundColor: "rgba(255,75,0,0.08)",
            fontFamily: V4.font,
            fontWeight: 700,
            fontSize: 24,
            color: V4.orange,
            whiteSpace: "nowrap",
          }}
        >
          ✓ Broker-linked & verified — track records, not screenshots
        </div>
      </Pop>
    </div>
  </AbsoluteFill>
);

/* ---------------- p4 — every market, one direct link ---------------- */

const MARKETS = ["Stocks", "ETFs", "Crypto", "Memecoins", "Prediction markets", "Metals", "Futures"];
const BROKERS = ["Alpaca", "Binance", "Coinbase", "Robinhood", "Kraken", "eToro"];

const Markets: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: V4.bg, justifyContent: "center", alignItems: "center" }}>
    <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center" }}>
      <KineticLine text="Every market. {orange:One} direct link." delay={2} stagger={2.5} fontSize={78} fontWeight={800} punchy />
    </div>

    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, width: 1300, marginTop: 40 }}>
      {MARKETS.map((m, i) => (
        <Pop key={m} delay={16 + i * 4}>
          <div
            style={{
              fontFamily: V4.font,
              fontWeight: 700,
              fontSize: 34,
              color: i % 3 === 1 ? V4.orange : V4.white,
              padding: "20px 38px",
              borderRadius: 18,
              border: `1.5px solid ${i % 3 === 1 ? "rgba(255,107,44,0.55)" : "rgba(245,245,247,0.16)"}`,
              backgroundColor: i % 3 === 1 ? "rgba(255,75,0,0.10)" : "rgba(245,245,247,0.04)",
            }}
          >
            {m}
          </div>
        </Pop>
      ))}
    </div>

    <Pop delay={54} style={{ position: "absolute", bottom: 120, textAlign: "center", width: "100%" }}>
      <div style={{ fontFamily: V4.font, fontSize: 26, color: V4.dim, marginBottom: 18 }}>
        Direct to your brokers &amp; exchanges — read-only keys, your custody
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        {BROKERS.map((b, i) => (
          <Pop key={b} delay={60 + i * 3}>
            <div style={{ fontFamily: V4.font, fontWeight: 700, fontSize: 25, color: V4.white, padding: "12px 24px", borderRadius: 12, border: "1px solid rgba(245,245,247,0.14)", backgroundColor: "rgba(245,245,247,0.04)" }}>
              {b}
            </div>
          </Pop>
        ))}
      </div>
    </Pop>
  </AbsoluteFill>
);

export const Act4: React.FC = () => (
  <>
    <Sequence from={T.p1} durationInFrames={DUR.p1}>
      <Composer />
    </Sequence>
    <Sequence from={T.p2} durationInFrames={DUR.p2}>
      <Trust />
    </Sequence>
    <Sequence from={T.p3} durationInFrames={DUR.p3}>
      <Proof />
    </Sequence>
    <Sequence from={T.p4} durationInFrames={DUR.p4}>
      <Markets />
    </Sequence>
  </>
);
