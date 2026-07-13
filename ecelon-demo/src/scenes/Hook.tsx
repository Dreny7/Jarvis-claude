import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Headline } from "../components/Headline";
import { Pop } from "../components/ui";
import { colors } from "../theme";

const TICKER = [
  ["NVDA", "+3.42%"],
  ["BTC", "+2.34%"],
  ["ETH", "+4.10%"],
  ["SPY", "+0.82%"],
  ["TSLA", "+1.95%"],
  ["SOL", "+5.67%"],
  ["QQQ", "+1.12%"],
  ["AAPL", "+0.64%"],
];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = frame * 4.2;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <Headline text="Markets never {orange:sleep.}" fontSize={124} stagger={2} />
        <Pop delay={12} distance={28}>
          <div
            style={{
              fontSize: 46,
              fontWeight: 500,
              color: colors.textDim,
              letterSpacing: "-0.015em",
            }}
          >
            Now neither does your portfolio.
          </div>
        </Pop>
      </div>

      {/* live ticker strip — constant motion keeps the scene alive */}
      <Pop
        delay={18}
        from="up"
        distance={34}
        style={{ position: "absolute", bottom: 110, width: "100%", overflow: "hidden" }}
      >
        <div
          style={{
            display: "flex",
            gap: 18,
            transform: `translateX(${-((scroll % 1400))}px)`,
            width: "300%",
          }}
        >
          {[...TICKER, ...TICKER, ...TICKER].map(([sym, chg], i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 22px",
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: 24,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: colors.text }}>{sym}</span>
              <span style={{ color: colors.green }}>{chg}</span>
            </div>
          ))}
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
