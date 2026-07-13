import React from "react";
import { AbsoluteFill } from "remotion";
import { Headline } from "../components/Headline";
import { GlassCard, IconTile, Pop, StatusBadge } from "../components/ui";
import {
  BoltIcon,
  ChartIcon,
  GlobeIcon,
  PieIcon,
  ShieldIcon,
} from "../components/icons";
import { colors } from "../theme";

const AGENTS = [
  { name: "Market Analyst", sub: "Equities · live scanning", badge: "ACTIVE", tone: "orange" as const, icon: <ChartIcon /> },
  { name: "Trading Agent", sub: "Order routing & execution", badge: "LIVE", tone: "orange" as const, icon: <BoltIcon /> },
  { name: "Risk Management", sub: "Exposure guardrails", badge: "OK", tone: "green" as const, icon: <ShieldIcon /> },
  { name: "Macro Research", sub: "Macro & rates", badge: "LIVE", tone: "orange" as const, icon: <GlobeIcon /> },
  { name: "Portfolio Manager", sub: "Allocation & rebalancing", badge: "OK", tone: "green" as const, icon: <PieIcon /> },
];

export const Agents: React.FC = () => {
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 96 }}>
      <Headline text="Five specialists. {orange:Zero} downtime." fontSize={88} />

      <div
        style={{
          marginTop: 64,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          width: 1060,
        }}
      >
        {AGENTS.map((a, i) => (
          <Pop key={a.name} delay={14 + i * 5} from={i % 2 === 0 ? "left" : "right"} distance={70}>
            <GlassCard
              accent={i === 0}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "22px 34px",
              }}
            >
              <IconTile>{a.icon}</IconTile>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", color: colors.text }}>
                  {a.name}
                </div>
                <div style={{ fontSize: 23, color: colors.textDim, marginTop: 4 }}>{a.sub}</div>
              </div>
              <StatusBadge label={a.badge} tone={a.tone} pulseDelay={i * 7} />
            </GlassCard>
          </Pop>
        ))}
      </div>
    </AbsoluteFill>
  );
};
