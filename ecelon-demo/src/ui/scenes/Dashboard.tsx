import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { U, USER, AGENT } from "../theme";
import { Frame } from "../components/chrome";
import { Card, Pill, Rise, CountUp, Dot, useRise } from "../components/kit";

const money = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Stat: React.FC<{ label: string; delay: number; children: React.ReactNode; sub: string }> = ({ label, delay, children, sub }) => (
  <Rise delay={delay} style={{ flex: 1 }}>
    <Card style={{ padding: 28, height: 150 }}>
      <div style={{ fontFamily: U.font, fontSize: 15, fontWeight: 600, letterSpacing: "0.06em", color: U.text2, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: U.font, fontWeight: 800, fontSize: 42, color: U.white, marginTop: 10, letterSpacing: "-0.02em" }}>{children}</div>
      <div style={{ fontFamily: U.font, fontSize: 16, color: U.text3, marginTop: 8 }}>{sub}</div>
    </Card>
  </Rise>
);

export const Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const hero = useRise(6, 24);
  return (
    <Frame active="dashboard" page="Dashboard">
      <AbsoluteFill style={{ padding: "28px 40px" }}>
        {/* tabs */}
        <Rise delay={2} style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <Pill label="Today" active size={18} />
          <Pill label="This Week" size={18} />
          <Pill label="This Month" size={18} />
          <div style={{ marginLeft: "auto" }}><Pill label="All agents" size={18} /></div>
        </Rise>

        {/* hero band */}
        <div
          style={{
            opacity: hero.opacity,
            transform: hero.transform,
            borderRadius: 24,
            padding: "34px 40px",
            height: 188,
            background: `radial-gradient(120% 180% at 12% 20%, ${U.orangeDeep} 0%, #7A3A17 46%, #1A0E08 100%)`,
            border: `1px solid rgba(255,120,60,0.25)`,
            boxShadow: U.elevCard,
          }}
        >
          <div style={{ fontFamily: U.font, fontWeight: 800, fontSize: 34, color: "#fff", letterSpacing: "-0.02em" }}>Hi {USER.first}, here's what your agents did this month.</div>
          <div style={{ fontFamily: U.font, fontSize: 18, color: "rgba(255,255,255,0.72)", marginTop: 10 }}>Your desk is carrying unrealized P&amp;L of</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 4 }}>
            <div style={{ fontFamily: U.font, fontWeight: 800, fontSize: 52, color: "#fff", letterSpacing: "-0.02em" }}>
              +<CountUp to={2318.4} start={10} dur={26} format={money} /> USDT
            </div>
            <div style={{ fontFamily: U.font, fontSize: 18, color: "rgba(255,255,255,0.72)" }}>+2.32% return · 1 agent</div>
          </div>
        </div>

        {/* stat cards */}
        <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
          <Stat label="Balance" delay={14} sub="Cash 102,318.40 USDT · 1 position"><CountUp to={102318.4} start={16} dur={26} format={money} /> USDT</Stat>
          <Stat label="P&L today" delay={19} sub="Since 00:00 UTC">+<CountUp to={418.2} start={20} dur={24} format={money} /> USDT</Stat>
          <Stat label="Signals today" delay={24} sub="Since 00:00 UTC"><CountUp to={167} start={24} dur={22} /> new</Stat>
        </div>

        {/* live agent row */}
        <Rise delay={30} style={{ marginTop: 24 }}>
          <Card style={{ padding: 22, display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(140deg, ${U.orangeHi}, ${U.orangeDeep})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: U.font, fontWeight: 800, fontSize: 20, color: "#fff" }}>N</div>
            <div>
              <div style={{ fontFamily: U.font, fontWeight: 700, fontSize: 22, color: U.white, display: "flex", alignItems: "center", gap: 10 }}>{AGENT.name} <Dot pulse /></div>
              <div style={{ fontFamily: U.font, fontSize: 16, color: U.text2, marginTop: 2 }}>{AGENT.ticker} · Autonomous · Live — Paper</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontFamily: U.font, fontWeight: 800, fontSize: 26, color: U.orange }}>+2.32%</div>
              <div style={{ fontFamily: U.font, fontSize: 15, color: U.text3 }}>this month</div>
            </div>
          </Card>
        </Rise>
      </AbsoluteFill>
    </Frame>
  );
};
