import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { U, AGENT, hash } from "../theme";
import { Frame } from "../components/chrome";
import { Card, Badge, Dot, Rise, useRise, CountUp } from "../components/kit";

/* Agent shell: back + name, sub-nav, Suspend/Emergency, content slot. */
const SUBNAV = ["Overview", "Agent Logic", "Trading Graph", "Activity", "Settings"];
const AgentShell: React.FC<{ active: string; children: React.ReactNode }> = ({ active, children }) => (
  <AbsoluteFill style={{ padding: "24px 34px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: U.surface, border: `1px solid ${U.hairline}`, display: "flex", alignItems: "center", justifyContent: "center", color: U.text2, fontSize: 20 }}>‹</div>
      <div style={{ fontFamily: U.font, fontWeight: 700, fontSize: 20, color: U.ink, backgroundColor: U.pureWhite, padding: "8px 22px", borderRadius: 999 }}>{AGENT.name}</div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        <div style={{ fontFamily: U.font, fontWeight: 700, fontSize: 16, color: U.white, backgroundColor: U.surface, border: `1px solid ${U.hairline}`, padding: "12px 20px", borderRadius: 999 }}>■ Suspend agent</div>
        <div style={{ fontFamily: U.font, fontWeight: 700, fontSize: 16, color: U.orange, border: `1px solid rgba(255,106,44,0.5)`, padding: "12px 20px", borderRadius: 999 }}>⏻ Emergency stop</div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 26, marginTop: 22, height: 880 }}>
      <div style={{ width: 250, flexShrink: 0 }}>
        <Card style={{ padding: "14px 14px" }}>
          {SUBNAV.map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderRadius: 12, backgroundColor: s === active ? U.pureWhite : "transparent", color: s === active ? U.ink : U.text2, fontFamily: U.font, fontWeight: 600, fontSize: 18 }}>{s}</div>
          ))}
          <div style={{ fontFamily: U.font, fontSize: 13, color: U.text3, padding: "14px 16px 6px", lineHeight: 1.4 }}>Paper trading. Ecelon never holds your funds.</div>
        </Card>
      </div>
      <div style={{ flex: 1, position: "relative" }}>{children}</div>
    </div>
  </AbsoluteFill>
);

/* ---------------- Agent Logic — node graph ---------------- */
const NODES = [
  { id: "Strategy", tag: "Your words", x: 20, y: 250, w: 300, rows: ["Go long when RSI(14)", "drops below 30 · 5m"] },
  { id: "Signal Engine", tag: "Compiled rules", x: 420, y: 120, w: 320, rows: ["rsi_long · 5m candles", "close > RSI(14) 50"] },
  { id: "Risk Engine", tag: "L3 gates", x: 880, y: 300, w: 300, rows: ["position cap 8%", "daily loss 2% · kill 20%"] },
  { id: "Execution", tag: "Venue & mode", x: 1290, y: 500, w: 300, rows: ["Binance · Crypto", "Paper · Manual"] },
];

const port = (n: typeof NODES[number], side: "l" | "r") => ({ x: side === "l" ? n.x : n.x + n.w, y: n.y + 66 });

const NodeCard: React.FC<{ n: typeof NODES[number]; delay: number }> = ({ n, delay }) => {
  const r = useRise(delay, 18);
  return (
    <div style={{ position: "absolute", left: n.x, top: n.y, width: n.w, opacity: r.opacity, transform: r.transform }}>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: `1px solid ${U.hairlineSoft}` }}>
          <Dot pulse /><span style={{ fontFamily: U.font, fontWeight: 700, fontSize: 19, color: U.white }}>{n.id}</span>
        </div>
        <div style={{ padding: "14px 18px" }}>
          {n.rows.map((row, j) => (
            <div key={j} style={{ fontFamily: U.mono, fontSize: 15, color: U.text2, marginBottom: 4 }}>{row}</div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const AgentLogic: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Frame active="agents" page="Agents">
      <AgentShell active="Agent Logic">
        <AbsoluteFill>
          {/* dotted canvas */}
          <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "26px 26px", borderRadius: 20, border: `1px solid ${U.hairlineSoft}` }} />
          {/* wires */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
            {NODES.slice(0, -1).map((n, i) => {
              const a = port(n, "r"), b = port(NODES[i + 1], "l");
              const d = `M ${a.x} ${a.y} C ${a.x + 90} ${a.y}, ${b.x - 90} ${b.y}, ${b.x} ${b.y}`;
              const app = interpolate(frame, [10 + i * 8, 30 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const len = 700;
              // traveling pulse
              const pt = ((frame + i * 20) % 60) / 60;
              const px = a.x + (b.x - a.x) * pt;
              const py = a.y + (b.y - a.y) * (pt * pt * (3 - 2 * pt));
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke={U.orange} strokeWidth={2.5} strokeDasharray={len} strokeDashoffset={len * (1 - app)} style={{ filter: "drop-shadow(0 0 6px rgba(255,106,44,0.5))" }} />
                  {app >= 1 && <circle cx={px} cy={py} r={5} fill={U.orangeHi} style={{ filter: "drop-shadow(0 0 8px rgba(255,122,60,0.9))" }} />}
                </g>
              );
            })}
          </svg>
          {/* nodes */}
          {NODES.map((n, i) => (
            <NodeCard key={n.id} n={n} delay={6 + i * 5} />
          ))}
          {/* legend */}
          <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 12 }}>
            {NODES.map((n) => (
              <div key={n.id} style={{ textAlign: "center", padding: "10px 18px", borderRadius: 14, backgroundColor: U.surface, border: `1px solid ${U.hairline}` }}>
                <div style={{ fontFamily: U.font, fontWeight: 700, fontSize: 15, color: U.white }}>{n.id.split(" ")[0]}</div>
                <div style={{ fontFamily: U.font, fontSize: 12, color: U.text3 }}>{n.tag}</div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </AgentShell>
    </Frame>
  );
};

/* ---------------- Trading Graph — candlestick build ---------------- */
const CANDLES = 64;
const series = (() => {
  let price = 340;
  const arr: { o: number; c: number; h: number; l: number }[] = [];
  for (let i = 0; i < CANDLES; i++) {
    const drift = i < 20 ? 2 : i < 40 ? -6 : -1;
    const o = price;
    const c = o + drift + (hash(i) - 0.5) * 14;
    const h = Math.max(o, c) + hash(i * 3) * 8;
    const l = Math.min(o, c) - hash(i * 7) * 8;
    arr.push({ o, c, h, l });
    price = c;
  }
  return arr;
})();
const CH_W = 1520, CH_H = 500, PAD = 30;
const allV = series.flatMap((c) => [c.h, c.l]);
const vMin = Math.min(...allV), vMax = Math.max(...allV);
const yOf = (v: number) => PAD + (1 - (v - vMin) / (vMax - vMin)) * (CH_H - 2 * PAD);
const sma = series.map((_, i) => { const w = series.slice(Math.max(0, i - 5), i + 1); return w.reduce((a, c) => a + c.c, 0) / w.length; });

export const TradingGraph: React.FC = () => {
  const frame = useCurrentFrame();
  const built = Math.floor(interpolate(frame, [8, 78], [0, CANDLES], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const cw = CH_W / CANDLES;
  return (
    <Frame active="agents" page="Agents">
      <AgentShell active="Trading Graph">
        <AbsoluteFill>
          <Rise delay={2} style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 14 }}>
            <span style={{ fontFamily: U.font, fontWeight: 800, fontSize: 30, color: U.white }}>{AGENT.ticker}</span>
            <span style={{ fontFamily: U.font, fontWeight: 800, fontSize: 30, color: U.white }}>$<CountUp to={65771.99} start={6} dur={22} format={(v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /></span>
            <span style={{ fontFamily: U.font, fontSize: 18, color: U.text2 }}>−0.73%</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              {["1H", "4H", "12H", "1D"].map((tf) => <span key={tf} style={{ fontFamily: U.font, fontWeight: 700, fontSize: 15, padding: "7px 15px", borderRadius: 999, color: tf === "4H" ? U.ink : U.text2, backgroundColor: tf === "4H" ? U.pureWhite : "rgba(255,255,255,0.05)" }}>{tf}</span>)}
            </div>
          </Rise>
          <Rise delay={4} style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {["SMA 20", "EMA 9", "EMA 21", "VWAP", "Bands", "RSI", "MACD"].map((ind) => <span key={ind} style={{ fontFamily: U.font, fontWeight: 600, fontSize: 14, padding: "6px 14px", borderRadius: 999, color: ind === "SMA 20" ? U.ink : U.text2, backgroundColor: ind === "SMA 20" ? U.pureWhite : "rgba(255,255,255,0.05)" }}>{ind}</span>)}
          </Rise>
          <Card style={{ padding: 16, height: 540 }}>
            <svg width="100%" viewBox={`0 0 ${CH_W} ${CH_H}`} preserveAspectRatio="none" style={{ display: "block" }}>
              {series.slice(0, built).map((c, i) => {
                const x = i * cw + cw / 2;
                const up = c.c >= c.o;
                const col = up ? U.orange : "rgba(245,245,247,0.35)";
                return (
                  <g key={i}>
                    <line x1={x} x2={x} y1={yOf(c.h)} y2={yOf(c.l)} stroke={col} strokeWidth={1.4} />
                    <rect x={x - cw * 0.32} width={cw * 0.64} y={yOf(Math.max(c.o, c.c))} height={Math.max(1, Math.abs(yOf(c.o) - yOf(c.c)))} fill={col} />
                  </g>
                );
              })}
              {built > 2 && (
                <polyline points={sma.slice(0, built).map((v, i) => `${i * cw + cw / 2},${yOf(v)}`).join(" ")} fill="none" stroke={U.orangeHi} strokeWidth={2.5} style={{ filter: "drop-shadow(0 0 6px rgba(255,122,60,0.5))" }} />
              )}
            </svg>
          </Card>
          <div style={{ display: "flex", gap: 24, marginTop: 18 }}>
            <Rise delay={70} style={{ flex: 1 }}><Card style={{ padding: 22 }}><div style={{ fontFamily: U.font, fontSize: 13, letterSpacing: "0.06em", color: U.text2, textTransform: "uppercase" }}>Top agent win rate</div><div style={{ fontFamily: U.font, fontWeight: 800, fontSize: 40, color: U.white, marginTop: 6 }}><CountUp to={AGENT.winRate} start={72} dur={20} format={(v) => `${Math.round(v)}%`} /></div></Card></Rise>
            <Rise delay={74} style={{ flex: 1 }}><Card style={{ padding: 22 }}><div style={{ fontFamily: U.font, fontSize: 13, letterSpacing: "0.06em", color: U.text2, textTransform: "uppercase" }}>Max drawdown</div><div style={{ fontFamily: U.font, fontWeight: 800, fontSize: 40, color: U.white, marginTop: 6 }}>−4.2%</div></Card></Rise>
            <Rise delay={78} style={{ flex: 1 }}><Card style={{ padding: 22, display: "flex", flexDirection: "column", justifyContent: "center" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Badge label="PAPER" /><span style={{ fontFamily: U.font, fontSize: 16, color: U.text2 }}>Broker-linked · verified</span></div></Card></Rise>
          </div>
        </AbsoluteFill>
      </AgentShell>
    </Frame>
  );
};

/* ---------------- Activity ---------------- */
const LOG = [
  { info: false, t: "Watched the market. Entry conditions not met yet" },
  { info: true, t: "Checked the market for a long entry" },
  { info: false, t: "RSI(14) crossed below 30 — signal armed" },
  { info: true, t: "Checked the market for a long entry" },
  { info: false, t: "Confidence 71% ≥ threshold — long BTCUSDT" },
  { info: true, t: "Position opened · risk within 2% daily cap" },
  { info: false, t: "Watched the market. Entry conditions not met yet" },
  { info: true, t: "Checked the market for a long entry" },
];

export const Activity: React.FC = () => (
  <Frame active="agents" page="Agents">
    <AgentShell active="Activity">
      <AbsoluteFill>
        <Rise delay={2} style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <span style={{ fontFamily: U.font, fontWeight: 700, fontSize: 15, padding: "8px 18px", borderRadius: 999, color: U.ink, backgroundColor: U.pureWhite }}>All</span>
          <span style={{ fontFamily: U.font, fontWeight: 600, fontSize: 15, padding: "8px 18px", borderRadius: 999, color: U.text2, backgroundColor: "rgba(255,255,255,0.05)" }}>Executed</span>
          <span style={{ fontFamily: U.font, fontWeight: 600, fontSize: 15, padding: "8px 18px", borderRadius: 999, color: U.text2, backgroundColor: "rgba(255,255,255,0.05)" }}>Skipped</span>
        </Rise>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {LOG.map((l, i) => (
            <Rise key={i} delay={8 + i * 5} from={14}>
              <Card style={{ padding: "16px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                {l.info ? <Badge label="INFO" tone="neutral" /> : <Badge label="FLAG" />}
                <span style={{ fontFamily: U.font, fontSize: 18, color: l.info ? U.text2 : U.white }}>{l.t}</span>
                {!l.info && <span style={{ fontFamily: U.font, fontSize: 16, color: U.orangeHi }}>Why?</span>}
                <span style={{ marginLeft: "auto", fontFamily: U.font, fontSize: 15, color: U.text3 }}>5h</span>
              </Card>
            </Rise>
          ))}
        </div>
      </AbsoluteFill>
    </AgentShell>
  </Frame>
);
