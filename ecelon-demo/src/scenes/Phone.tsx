import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "../components/Headline";
import { GlassCard, IconTile, Pop, StatusBadge } from "../components/ui";
import { BoltIcon, NewsIcon, PieIcon, UsersIcon } from "../components/icons";
import { LogoMark } from "../components/Logo";
import { colors, orangeGradient } from "../theme";

const ASSETS = [
  { tag: "NVDA", name: "NVIDIA", price: "$140.50", chg: "+3.42%" },
  { tag: "BTC", name: "Bitcoin", price: "$97,240", chg: "+2.34%" },
  { tag: "ETH", name: "Ethereum", price: "$3,420", chg: "+4.10%" },
];

const CALLOUTS = [
  { side: "left" as const, top: 300, icon: <PieIcon size={24} />, title: "One portfolio", sub: "Stocks & crypto, one live feed" },
  { side: "left" as const, top: 560, icon: <NewsIcon size={24} />, title: "News, scored", sub: "Headline impact — what moved, why" },
  { side: "right" as const, top: 340, icon: <BoltIcon size={24} />, title: "Your agent team", sub: "Autonomous traders, always on" },
  { side: "right" as const, top: 600, icon: <UsersIcon size={24} />, title: "Verified signals", sub: "Follow performance, not promises" },
];

// mini sparkline for the app screen
const SPARK = Array.from({ length: 26 }, (_, i) => {
  const t = i / 25;
  return { x: t * 380, y: 54 - t * 30 + Math.sin(i * 0.9) * 7 + Math.sin(i * 0.35) * 5 };
});
const sparkD = SPARK.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

export const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneS = spring({ frame: frame - 6, fps, config: { damping: 19, stiffness: 150, mass: 0.9 } });
  const tilt = (1 - phoneS) * 24;

  const value = interpolate(frame, [16, 46], [61200, 68490.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sparkDraw = interpolate(frame, [20, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 78 }}>
      <Headline text="One portfolio. {orange:Every} market." fontSize={84} />

      {/* Device */}
      <div style={{ perspective: 1400, marginTop: 34 }}>
        <div
          style={{
            width: 420,
            height: 820,
            borderRadius: 56,
            padding: 12,
            background: "linear-gradient(160deg, #2A2A2E 0%, #121214 60%)",
            boxShadow:
              "0 0 90px rgba(255,92,0,0.22), 0 40px 90px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.18)",
            transform: `rotateY(${-tilt}deg) rotateX(${tilt * 0.35}deg) translateY(${(1 - phoneS) * 90}px)`,
            transformStyle: "preserve-3d",
            opacity: Math.min(1, phoneS * 1.5),
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 46,
              backgroundColor: "#0A0A0C",
              overflow: "hidden",
              padding: "26px 24px",
              position: "relative",
            }}
          >
            {/* notch */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                width: 110,
                height: 26,
                borderRadius: 999,
                backgroundColor: "#000",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            />
            {/* app header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 26 }}>
              <LogoMark size={44} glowOpacity={0.5} />
              <div style={{ fontSize: 24, fontWeight: 600, color: colors.text }}>ecelon</div>
              <div style={{ marginLeft: "auto" }}>
                <StatusBadge label="LIVE" tone="orange" />
              </div>
            </div>
            {/* portfolio value */}
            <div style={{ marginTop: 22, fontSize: 17, fontWeight: 600, letterSpacing: "0.12em", color: colors.textFaint }}>
              PORTFOLIO VALUE
            </div>
            <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.03em", color: colors.text, marginTop: 4 }}>
              ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, padding: "5px 12px", borderRadius: 999, backgroundColor: "rgba(47,227,154,0.12)", border: "1px solid rgba(47,227,154,0.35)", fontSize: 17, fontWeight: 700, color: colors.green }}>
              ▲ $2,058.80 today
            </div>
            {/* sparkline */}
            <svg width={380} height={64} viewBox="0 0 380 64" style={{ marginTop: 14 }}>
              <path
                d={sparkD}
                fill="none"
                stroke={colors.orange}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={460}
                strokeDashoffset={460 * (1 - sparkDraw)}
                style={{ filter: "drop-shadow(0 0 7px rgba(255,92,0,0.8))" }}
              />
            </svg>
            {/* assets */}
            {ASSETS.map((a, i) => (
              <Pop key={a.tag} delay={26 + i * 5} distance={22}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 16,
                    backgroundColor: "rgba(255,255,255,0.045)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    marginTop: 10,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: orangeGradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    {a.tag}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 19, fontWeight: 700, color: colors.text, whiteSpace: "nowrap" }}>
                      {a.name} · {a.price}
                    </div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: colors.green }}>{a.chg}</div>
                </div>
              </Pop>
            ))}
            {/* agents strip */}
            <Pop delay={44} distance={20}>
              <div style={{ marginTop: 16, fontSize: 15, fontWeight: 700, letterSpacing: "0.14em", color: colors.textFaint }}>
                AI AGENTS
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 16,
                  backgroundColor: "rgba(255,92,0,0.08)",
                  border: "1px solid rgba(255,92,0,0.35)",
                  marginTop: 8,
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: orangeGradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BoltIcon size={22} />
                </div>
                <div style={{ flex: 1, fontSize: 18, fontWeight: 700, color: colors.text, whiteSpace: "nowrap" }}>
                  Mean-Reversion Agent
                </div>
                <StatusBadge label="LIVE" tone="orange" pulseDelay={9} />
              </div>
            </Pop>
          </div>
        </div>
      </div>

      {/* Side feature callouts */}
      {CALLOUTS.map((c, i) => (
        <Pop
          key={c.title}
          delay={30 + i * 6}
          from={c.side === "left" ? "right" : "left"}
          distance={60}
          style={{
            position: "absolute",
            top: c.top,
            ...(c.side === "left" ? { left: 150 } : { right: 150 }),
          }}
        >
          <GlassCard
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "22px 28px",
              width: 430,
            }}
          >
            <IconTile size={52}>{c.icon}</IconTile>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: colors.text }}>{c.title}</div>
              <div style={{ fontSize: 20, color: colors.textDim, marginTop: 3 }}>{c.sub}</div>
            </div>
          </GlassCard>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};
