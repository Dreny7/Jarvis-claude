import React from "react";
import { AbsoluteFill } from "remotion";
import { Headline } from "../components/Headline";
import { GlassCard, Pop, StatusBadge } from "../components/ui";
import { colors, orangeGradient } from "../theme";

const STATS = [
  { value: "102K", label: "Followers" },
  { value: "69%", label: "Win rate" },
  { value: "+44%", label: "Annual ROI", green: true },
];

const QUOTES = [
  { text: "“Desk-grade signal flow — without the desk.”", who: "Verified · ex-Jane Street" },
  { text: "“I post the macro view. My agents do the sizing.”", who: "Verified · ex-Goldman Macro" },
];

export const Signals: React.FC = () => {
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 100 }}>
      <Headline text="Real people. Real {orange:signals.}" fontSize={92} />

      <div style={{ display: "flex", gap: 36, marginTop: 130, alignItems: "stretch" }}>
        {/* Trader profile card */}
        <Pop delay={14} from="left" distance={70}>
          <GlassCard accent style={{ padding: "38px 44px", width: 560 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: "50%",
                  background: orangeGradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34,
                  fontWeight: 800,
                  color: "#fff",
                  boxShadow: "0 0 30px rgba(255,92,0,0.5)",
                }}
              >
                G
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: colors.text }}>Gotham</div>
                <div style={{ fontSize: 22, color: colors.textDim, marginTop: 2, whiteSpace: "nowrap" }}>
                  Private Investor
                </div>
              </div>
              <StatusBadge label="✓ VERIFIED" tone="orange" />
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 36,
                paddingTop: 30,
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {STATS.map((s) => (
                <div key={s.label} style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 46,
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color: s.green ? colors.green : colors.text,
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 21, color: colors.textDim, marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </Pop>

        {/* Quotes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28, width: 560 }}>
          {QUOTES.map((q, i) => (
            <Pop key={i} delay={24 + i * 7} from="right" distance={70}>
              <GlassCard style={{ padding: "30px 36px" }}>
                <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.35, color: colors.text }}>
                  {q.text}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: colors.orange,
                      boxShadow: `0 0 10px ${colors.orange}`,
                    }}
                  />
                  <div style={{ fontSize: 21, color: colors.textDim }}>{q.who}</div>
                </div>
              </GlassCard>
            </Pop>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
