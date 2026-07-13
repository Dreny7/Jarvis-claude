import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline } from "../components/Headline";
import { LogoMark } from "../components/Logo";
import { colors } from "../theme";

const BROKERS = ["Alpaca", "IBKR", "Kalshi", "Coinbase", "Binance", "Tradier"];
const RADIUS = 620;

export const Brokers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 8, fps, config: { damping: 20, stiffness: 130, mass: 0.9 } });
  const rot = frame * 0.028; // brisk orbit

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 96 }}>
      <Headline text="Your brokers. {orange:One} hub." fontSize={92} />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          perspective: 1500,
        }}
      >
        {/* glowing ground ring */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 700 - 175,
            width: 1300,
            height: 350,
            transform: `translateX(-50%) scale(${enter})`,
            borderRadius: "50%",
            border: "2px solid rgba(255,92,0,0.35)",
            boxShadow:
              "0 0 80px rgba(255,92,0,0.25), inset 0 0 120px rgba(255,92,0,0.12)",
            opacity: enter,
          }}
        />
        {/* center mark */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 640,
            transform: `translate(-50%, -50%) scale(${enter})`,
            opacity: enter,
          }}
        >
          <LogoMark size={230} glowOpacity={1} />
        </div>

        {/* orbiting broker chips — ride the ring ellipse */}
        {BROKERS.map((name, i) => {
          const angle = rot + (i / BROKERS.length) * Math.PI * 2;
          const x = Math.sin(angle) * RADIUS;
          const z = Math.cos(angle); // -1 back … 1 front
          const scale = 0.72 + 0.28 * (z + 1) * 0.5;
          const opacity = (0.38 + 0.62 * (z + 1) * 0.5) * enter;
          return (
            <div
              key={name}
              style={{
                position: "absolute",
                left: "50%",
                top: 700 + z * 165,
                transform: `translate(-50%, -50%) translateX(${x * enter}px) scale(${scale * enter})`,
                zIndex: Math.round(100 + z * 100),
                opacity,
                padding: "20px 40px",
                borderRadius: 20,
                background:
                  z > 0.3
                    ? "linear-gradient(160deg, rgba(255,92,0,0.16) 0%, rgba(20,20,22,0.95) 55%)"
                    : "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(16,16,18,0.95) 60%)",
                border: `1px solid ${z > 0.3 ? "rgba(255,92,0,0.5)" : "rgba(255,255,255,0.10)"}`,
                boxShadow:
                  z > 0.3
                    ? "0 0 40px rgba(255,92,0,0.22), 0 24px 50px rgba(0,0,0,0.6)"
                    : "0 24px 50px rgba(0,0,0,0.6)",
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: z > 0.3 ? colors.text : colors.textDim,
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
