import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V4 } from "../theme";
import { T, DUR } from "../timeline";
import { TypeOn, KineticLine, CountUp } from "../components/text";
import { PlusGrid } from "../components/vfx";
import { FacetMark } from "../components/FacetMark";
import { Glass, GlowField, Segmented, Rise, Pill, ORANGE_GRAD } from "../components/ios";
import { AGENTS, HERO_AGENT, LIVE_FEED, STRATEGY_PROMPT, WIN_RATE, agent } from "../config/agents";
import { beatPulse } from "../config/beatmap";

// PRODUCT MONTAGE — iOS-sleek: frosted glass, hairline strokes, pill controls,
// a living glow field behind everything, and something moving on every frame.
// v5: every stage gets a slow camera push and a beat-synced pulse so nothing
// ever sits dead still, and a fast orange wipe hands off between scenes
// instead of a flat cut.

const Stage: React.FC<{ children: React.ReactNode; pushTo?: number }> = ({ children, pushTo = 1.05 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const push = interpolate(frame, [0, durationInFrames], [1, pushTo], { extrapolateRight: "clamp" });
  // NOTE: the camera push lives on THIS SAME flex container, not a nested
  // AbsoluteFill — an inner wrapper here previously ate the flex centering
  // every scene's main panel relies on (marginTop offsets assumed a
  // flex-centered baseline), which silently threw Trust's card and headline
  // on top of each other. transform doesn't break flex layout of children.
  return (
    <AbsoluteFill style={{ backgroundColor: V4.bg, justifyContent: "center", alignItems: "center", overflow: "hidden", transform: `scale(${push})` }}>
      <GlowField />
      {children}
      <Wipe />
    </AbsoluteFill>
  );
};

/** Fast orange wipe on entrance/exit — a whip transition instead of a flat cut. */
const Wipe: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inW = interpolate(frame, [0, 9], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outW = interpolate(frame, [durationInFrames - 9, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const w = Math.max(inW, outW);
  if (w <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: V4.neon,
        clipPath: `polygon(0 0, ${w * 100 + 12}% 0, ${w * 100 - 12}% 100%, 0 100%)`,
      }}
    />
  );
};

/* ---------------- p1 — the money shot ---------------- */

const PROMPT = STRATEGY_PROMPT;
const TYPE_END = 26;
const BT_START = 30;
const DEPLOY = 82;
const FEED = LIVE_FEED;

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
  // live dot rides the drawing tip
  const tipI = Math.min(N - 1, Math.floor(draw * (N - 1)));
  const [tipX, tipY] = pts[tipI].split(",").map(Number);

  return (
    <Stage>
      <div style={{ transform: `scale(${zoom})` }}>
        <Glass style={{ width: 1440, padding: 44 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <FacetMark width={54} facetProgress={[1, 1, 1, 1, 1]} />
            <span style={{ fontFamily: V4.font, fontWeight: 600, fontSize: 24, color: V4.dim }}>
              ecelon — new strategy
            </span>
            <div style={{ marginLeft: "auto" }}>
              <Pill
                text={frame < BT_START ? "DRAFT" : deployed ? "DEPLOYED · LIVE — PAPER" : "BACKTESTING…"}
                on={frame >= BT_START}
              />
            </div>
          </div>

          <div
            style={{
              border: `1.5px solid ${frame >= TYPE_END && frame < TYPE_END + 8 ? V4.orange : "rgba(255,255,255,0.12)"}`,
              borderRadius: 18,
              padding: "24px 28px",
              backgroundColor: "rgba(255,255,255,0.04)",
              fontFamily: V4.font,
              fontWeight: 500,
              fontSize: 31,
              color: V4.white,
              minHeight: 92,
            }}
          >
            <TypeOn text={PROMPT} startFrame={2} charsPerFrame={2.4} />
          </div>

          <div style={{ display: "flex", gap: 30, marginTop: 30, opacity: interpolate(frame, [BT_START - 4, BT_START + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ position: "relative", width: 920, height: 360, overflow: "hidden", borderRadius: 18, border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(0,0,0,0.25)" }}>
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
                {draw > 0.02 && draw < 1 && (
                  <circle cx={tipX} cy={tipY} r={7} fill={V4.orangeHi} style={{ filter: "drop-shadow(0 0 10px rgba(255,122,61,0.9))" }} />
                )}
              </svg>
              <div style={{ position: "absolute", left: 24, top: 18, fontFamily: V4.mono, fontSize: 17, letterSpacing: 2, color: V4.faint }}>
                BACKTEST · 2019 → 2025 · HISTORICAL MARKET DATA
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, justifyContent: "center" }}>
              {[
                { k: "Win rate", v: `${WIN_RATE}%`, d: BT_START + 34 },
                { k: "Max drawdown", v: "−4.2%", d: BT_START + 39 },
                { k: "Risk cap honored", v: "2% / day", d: BT_START + 44 },
              ].map((m) => (
                <Rise key={m.k} delay={m.d}>
                  <div style={{ width: 380, padding: "18px 26px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.10)", backgroundColor: "rgba(255,255,255,0.05)" }}>
                    <div style={{ fontFamily: V4.font, fontSize: 21, color: V4.dim }}>{m.k}</div>
                    <div style={{ fontFamily: V4.font, fontWeight: 800, fontSize: 40, color: V4.white, marginTop: 2 }}>{m.v}</div>
                  </div>
                </Rise>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 26 }}>
            {FEED.map((f, i) => (
              <Rise key={f.key} delay={DEPLOY + 6 + i * 7} from={18}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "12px 20px",
                    borderRadius: 16,
                    marginBottom: 8,
                    backgroundColor: i === 0 ? "rgba(255,75,0,0.10)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${i === 0 ? "rgba(255,75,0,0.35)" : "rgba(255,255,255,0.07)"}`,
                  }}
                >
                  <span style={{ fontFamily: V4.font, fontWeight: 700, fontSize: 23, color: V4.white }}>{agent(f.key).name}</span>
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
                      borderRadius: 999,
                      padding: "4px 14px",
                    }}
                  >
                    {f.tag}
                  </span>
                  <span style={{ fontFamily: V4.font, fontSize: 20, color: V4.faint, width: 52, textAlign: "right" }}>{f.when}</span>
                </div>
              </Rise>
            ))}
          </div>
        </Glass>
      </div>
    </Stage>
  );
};

/* ---------------- agents — your desk of specialists ---------------- */

const DESK = AGENTS;

const AgentDesk: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = beatPulse(T.agents + frame);
  return (
    <Stage>
      <div style={{ position: "absolute", top: 92, width: "100%", textAlign: "center" }}>
        <KineticLine text="A {orange:desk} of specialists." delay={2} stagger={2.5} fontSize={76} fontWeight={800} punchy />
        <div style={{ marginTop: 16, opacity: interpolate(frame, [14, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontFamily: V4.font, fontSize: 30, color: V4.dim }}>
          Working your strategy around the clock.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 440px)", gap: 22, marginTop: 100 }}>
        {DESK.map((a, i) => (
          <Rise key={a.key} delay={20 + i * 5}>
            <Glass
              radius={24}
              style={{
                padding: "24px 26px",
                display: "flex",
                alignItems: "center",
                gap: 20,
                boxShadow: i === 0 ? `0 40px 110px rgba(0,0,0,0.55), 0 0 ${30 + pulse * 26}px rgba(255,75,0,${0.25 + pulse * 0.25})` : undefined,
              }}
            >
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 18,
                  background: i === 0 ? ORANGE_GRAD : "rgba(255,255,255,0.08)",
                  border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: V4.font,
                  fontWeight: 800,
                  fontSize: 22,
                  color: i === 0 ? "#fff" : V4.dim,
                  flexShrink: 0,
                }}
              >
                {a.initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: V4.font, fontWeight: 700, fontSize: 27, color: V4.white, whiteSpace: "nowrap" }}>{a.name}</div>
                <div style={{ fontFamily: V4.font, fontSize: 20, color: V4.dim, marginTop: 3, whiteSpace: "nowrap" }}>{a.oneLiner}</div>
              </div>
              <span
                style={{
                  marginLeft: "auto",
                  width: 11,
                  height: 11,
                  borderRadius: 999,
                  backgroundColor: V4.orange,
                  boxShadow: "0 0 10px rgba(255,75,0,0.9)",
                  opacity: 0.55 + 0.45 * Math.abs(Math.sin((frame + i * 9) / 11)),
                  flexShrink: 0,
                }}
              />
            </Glass>
          </Rise>
        ))}
      </div>

      <Rise delay={62} style={{ position: "absolute", bottom: 86 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontFamily: V4.font, fontSize: 25, color: V4.dim }}>Run them</span>
          <Segmented options={["Autonomous", "Copilot"]} selected={1} switchAt={84} width={430} />
          <span style={{ fontFamily: V4.font, fontSize: 25, color: V4.dim }}>— you approve every trade.</span>
        </div>
      </Rise>
    </Stage>
  );
};

/* ---------------- p2 — trust counterpunch ---------------- */

const LIMITS = [
  { k: "Max position size", v: "8% of book", hard: false, d: 24 },
  { k: "Daily loss cap", v: "2%", hard: false, d: 34 },
  { k: "Withdraw funds", v: "NEVER ALLOWED", hard: true, d: 44 },
];
const TRUST = ["Approvals stay with you", "Hard limits, enforced", "Every action logged"];

const Trust: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = beatPulse(T.p2 + frame);
  return (
  <Stage>
    <div style={{ position: "absolute", top: 84, width: "100%", textAlign: "center" }}>
      <KineticLine text="Their algorithms answer to no one." delay={2} stagger={2} fontSize={50} fontWeight={600} color={V4.dim} />
      <div style={{ height: 10 }} />
      <KineticLine text="{orange:Yours} answer to you." delay={12} stagger={2} fontSize={70} fontWeight={800} punchy />
    </div>

    <Rise delay={24}>
      <Glass style={{ width: 900, padding: 40, marginTop: 120, boxShadow: `0 40px 110px rgba(0,0,0,0.55), 0 0 ${24 + pulse * 20}px rgba(255,75,0,${0.12 + pulse * 0.18})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 20,
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
            {HERO_AGENT.initials}
          </div>
          <div>
            <div style={{ fontFamily: V4.font, fontWeight: 700, fontSize: 34, color: V4.white }}>{HERO_AGENT.name}</div>
            <div style={{ fontFamily: V4.font, fontSize: 22, color: V4.dim, marginTop: 2 }}>Autonomous · Tape reading</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Pill text="LIVE — PAPER" size={18} />
          </div>
        </div>

        <div style={{ marginTop: 26, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 8 }}>
          {LIMITS.map((l, li) => (
            <Rise key={l.k} delay={l.d} from={16}>
              <div style={{ display: "flex", alignItems: "center", padding: "15px 6px", borderBottom: li < LIMITS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
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
            </Rise>
          ))}
        </div>
      </Glass>
    </Rise>

    <div style={{ position: "absolute", bottom: 70, display: "flex", gap: 22 }}>
      {TRUST.map((t, i) => (
        <Rise key={t} delay={62 + i * 5}>
          <div
            style={{
              fontFamily: V4.font,
              fontWeight: 600,
              fontSize: 24,
              color: V4.white,
              padding: "14px 26px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.16)",
              backgroundColor: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
            }}
          >
            {t}
          </div>
        </Rise>
      ))}
    </div>
  </Stage>
  );
};

/* ---------------- p3 — 71% proof ---------------- */

const Proof: React.FC = () => {
  const frame = useCurrentFrame();
  const ringDraw = interpolate(frame, [4, 40], [0, WIN_RATE / 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const C = 2 * Math.PI * 300;
  const pulse = frame > 40 ? beatPulse(T.p3 + frame) : 0;
  return (
    <Stage>
      <svg width={720} height={720} viewBox="0 0 720 720" style={{ position: "absolute" }}>
        <circle cx={360} cy={360} r={300} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={10} />
        <circle
          cx={360}
          cy={360}
          r={300}
          fill="none"
          stroke={V4.orange}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - ringDraw)}
          transform="rotate(-90 360 360)"
          style={{ filter: `drop-shadow(0 0 ${16 + pulse * 14}px rgba(255,75,0,${0.5 + pulse * 0.3}))` }}
        />
      </svg>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: V4.font, fontSize: 30, letterSpacing: "0.2em", color: V4.dim }}>TOP AGENT WIN RATE</div>
        <div
          style={{
            fontFamily: V4.font,
            fontWeight: 800,
            fontSize: 250,
            lineHeight: 1,
            color: V4.white,
            letterSpacing: "-0.04em",
            textShadow: "0 0 80px rgba(255,75,0,0.35)",
          }}
        >
          <CountUp to={WIN_RATE} startFrame={4} durationFrames={30} overshoot format={(v) => `${Math.round(v)}%`} />
        </div>
      </div>
      <Rise delay={44} style={{ position: "absolute", bottom: 110 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 28px",
            borderRadius: 999,
            border: "1.5px solid rgba(255,107,44,0.45)",
            backgroundColor: "rgba(255,75,0,0.08)",
            backdropFilter: "blur(20px)",
            fontFamily: V4.font,
            fontWeight: 700,
            fontSize: 24,
            color: V4.orange,
            whiteSpace: "nowrap",
          }}
        >
          ✓ Broker-linked &amp; verified — track records, not screenshots
        </div>
      </Rise>
    </Stage>
  );
};

/* ---------------- p4 — every market, one direct link ---------------- */

const MARKETS = ["Stocks", "ETFs", "Crypto", "Memecoins", "Prediction markets", "Metals", "Futures"];
const BROKERS = ["Alpaca", "Binance", "Coinbase", "Robinhood", "Kraken", "eToro"];

const Markets: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = beatPulse(T.p4 + frame);
  return (
  <Stage>
    <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center" }}>
      <KineticLine text="Every market. {orange:One} direct link." delay={2} stagger={2.5} fontSize={78} fontWeight={800} punchy />
    </div>

    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, width: 1300, marginTop: 40 }}>
      {MARKETS.map((m, i) => (
        <Rise key={m} delay={16 + i * 4}>
          <div
            style={{
              fontFamily: V4.font,
              fontWeight: 700,
              fontSize: 34,
              color: i % 3 === 1 ? V4.orange : V4.white,
              padding: "20px 40px",
              borderRadius: 999,
              border: `1.5px solid ${i % 3 === 1 ? "rgba(255,107,44,0.55)" : "rgba(255,255,255,0.14)"}`,
              backgroundColor: i % 3 === 1 ? "rgba(255,75,0,0.10)" : "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              boxShadow: i % 3 === 1 ? `0 0 ${18 + pulse * 16}px rgba(255,75,0,${0.25 + pulse * 0.3})` : undefined,
            }}
          >
            {m}
          </div>
        </Rise>
      ))}
    </div>

    <Rise delay={54} style={{ position: "absolute", bottom: 120, textAlign: "center", width: "100%" }}>
      <div style={{ fontFamily: V4.font, fontSize: 26, color: V4.dim, marginBottom: 18 }}>
        Direct to your brokers &amp; exchanges — read-only keys, your custody
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        {BROKERS.map((b, i) => (
          <Rise key={b} delay={60 + i * 3}>
            <div style={{ fontFamily: V4.font, fontWeight: 700, fontSize: 25, color: V4.white, padding: "12px 26px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.05)" }}>
              {b}
            </div>
          </Rise>
        ))}
      </div>
    </Rise>
  </Stage>
  );
};

export const Act4: React.FC = () => (
  <>
    <Sequence from={T.p1} durationInFrames={DUR.p1}>
      <Composer />
    </Sequence>
    <Sequence from={T.agents} durationInFrames={DUR.agents}>
      <AgentDesk />
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
