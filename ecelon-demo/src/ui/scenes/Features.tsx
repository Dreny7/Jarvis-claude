import React from "react";
import { AbsoluteFill } from "remotion";
import { U, USER } from "../theme";
import { Frame } from "../components/chrome";
import { Card, Badge, Dot, Rise } from "../components/kit";

/* ---------------- Consulting chat ---------------- */
export const Consulting: React.FC = () => (
  <Frame active="chat" page="Agents">
    <AbsoluteFill style={{ padding: "24px 40px" }}>
      <Rise delay={2} style={{ fontFamily: U.font, fontSize: 16, color: U.text3, marginBottom: 18 }}>Agents / Macro research / Consulting chat</Rise>
      <Rise delay={4} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(140deg, ${U.orangeHi}, ${U.orangeDeep})` }} />
        <div>
          <div style={{ fontFamily: U.font, fontWeight: 700, fontSize: 22, color: U.white }}>Macro research</div>
          <div style={{ fontFamily: U.font, fontSize: 15, color: U.text2, display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}><Dot color={U.orangeHi} size={8} /> Consulting agent · Configured</div>
        </div>
      </Rise>

      {/* user bubble */}
      <Rise delay={8} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <div style={{ maxWidth: 720, backgroundColor: U.orangeCta, color: "#fff", fontFamily: U.font, fontSize: 20, padding: "18px 24px", borderRadius: 20, borderBottomRightRadius: 6 }}>
          What's on the economic calendar today?
        </div>
      </Rise>

      {/* agent bubble */}
      <Rise delay={18} style={{ display: "flex", justifyContent: "flex-start" }}>
        <div style={{ maxWidth: 900, backgroundColor: U.surface, border: `1px solid ${U.hairline}`, fontFamily: U.font, fontSize: 19, color: U.white, padding: "22px 26px", borderRadius: 20, borderBottomLeftRadius: 6, lineHeight: 1.6 }}>
          <div style={{ color: U.text2, marginBottom: 12 }}>Three high-impact prints today:</div>
          {[
            ["CPI m/m (CAD)", "expected −0.2%, prev 1.0%"],
            ["Median CPI y/y (CAD)", "steady at 2.1%"],
            ["CPI q/q (NZD)", "18:45 · forecast 1.4% vs 0.9%"],
          ].map(([k, v], i) => (
            <Rise key={k} delay={22 + i * 5} from={10} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ color: U.orangeHi }}>›</span><b>{k}:</b><span style={{ color: U.text2 }}>{v}</span>
            </Rise>
          ))}
          <div style={{ color: U.text3, fontSize: 15, marginTop: 14 }}>AI-generated for educational purposes · Ecelon does not place trades for consulting agents.</div>
        </div>
      </Rise>

      <div style={{ position: "absolute", left: 40, right: 40, bottom: 30, display: "flex", alignItems: "center", gap: 14, backgroundColor: U.surface, border: `1px solid ${U.hairline}`, borderRadius: 999, padding: "16px 24px" }}>
        <span style={{ fontFamily: U.font, fontSize: 18, color: U.text3 }}>Message Macro research…</span>
        <div style={{ marginLeft: "auto", width: 42, height: 42, borderRadius: 999, backgroundColor: U.orangeCta, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>➤</div>
      </div>
    </AbsoluteFill>
  </Frame>
);

/* ---------------- Feed ---------------- */
export const Feed: React.FC = () => (
  <Frame active="feed" page="Feed">
    <AbsoluteFill style={{ padding: "28px 40px", display: "flex", flexDirection: "row", gap: 32 }}>
      <div style={{ width: 760 }}>
        {/* poll composer */}
        <Rise delay={2}>
          <Card style={{ padding: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{ width: 42, height: 42, borderRadius: 999, backgroundColor: U.surface, border: `1px solid ${U.hairline}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: U.font, fontWeight: 800, fontSize: 14, color: U.white }}>{USER.initials}</div>
              <span style={{ fontFamily: U.font, fontWeight: 700, fontSize: 20, color: U.white }}>Question of the day</span>
            </div>
            <div style={{ borderRadius: 16, border: `1px solid rgba(255,106,44,0.4)`, backgroundColor: "rgba(255,106,44,0.06)", padding: 20 }}>
              <div style={{ fontFamily: U.font, fontSize: 19, color: U.white, marginBottom: 14 }}>On $SOL would you rather be…</div>
              {["Short", "Long"].map((o, i) => (
                <Rise key={o} delay={10 + i * 4} from={10}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${U.hairline}`, marginBottom: 10 }}>
                    <span style={{ width: 26, height: 26, borderRadius: 999, border: `1px solid ${U.hairline}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: U.font, fontSize: 14, color: U.text2 }}>{i + 1}</span>
                    <span style={{ fontFamily: U.font, fontSize: 18, color: U.white }}>{o}</span>
                  </div>
                </Rise>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 18 }}>
              <div style={{ fontFamily: U.font, fontSize: 15, color: U.text3 }}>Min 2 options · votes are anonymous</div>
              <div style={{ marginLeft: "auto", fontFamily: U.font, fontWeight: 700, fontSize: 18, color: "#fff", backgroundColor: U.orangeCta, padding: "12px 30px", borderRadius: 999 }}>Post</div>
            </div>
          </Card>
        </Rise>

        {/* feed tabs */}
        <Rise delay={20} style={{ display: "flex", gap: 10, margin: "22px 0" }}>
          <span style={{ fontFamily: U.font, fontWeight: 700, fontSize: 15, padding: "8px 18px", borderRadius: 999, color: U.ink, backgroundColor: U.pureWhite }}>For You</span>
          <span style={{ fontFamily: U.font, fontWeight: 600, fontSize: 15, padding: "8px 18px", borderRadius: 999, color: U.text2, backgroundColor: "rgba(255,255,255,0.05)" }}>Longing</span>
        </Rise>

        {/* post */}
        <Rise delay={26}>
          <Card style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: U.surface, border: `1px solid ${U.hairline}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: U.font, fontWeight: 800, fontSize: 15, color: U.white }}>{USER.initials}</div>
              <div>
                <div style={{ fontFamily: U.font, fontWeight: 700, fontSize: 19, color: U.white, display: "flex", alignItems: "center", gap: 10 }}>{USER.name} <Badge label="+2.3% ROI" /></div>
                <div style={{ fontFamily: U.font, fontSize: 15, color: U.text3 }}>{USER.handle}</div>
              </div>
            </div>
            <div style={{ fontFamily: U.font, fontSize: 20, color: U.white, marginTop: 16 }}>My agent is live. Deployed in under a minute.</div>
            <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 18 }}>
              <span style={{ fontFamily: U.font, fontSize: 16, color: U.text2 }}>♥ 12</span>
              <span style={{ fontFamily: U.font, fontSize: 16, color: U.text2 }}>💬 3</span>
              <span style={{ marginLeft: "auto", fontFamily: U.font, fontWeight: 700, fontSize: 16, color: U.orange }}>↗ 8 LONG</span>
            </div>
          </Card>
        </Rise>
      </div>

      {/* sidebar */}
      <Rise delay={16} style={{ flex: 1 }}>
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: U.font, fontWeight: 700, fontSize: 20, color: U.white, marginBottom: 16 }}>People you LONG</div>
          {["Dijar H · @dijarh", "Mara V · @maratrades", "Kaan · @kaanfx"].map((p, i) => (
            <Rise key={p} delay={20 + i * 4} from={10} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 999, background: `linear-gradient(140deg, ${U.orangeHi}, ${U.orangeDeep})` }} />
              <span style={{ fontFamily: U.font, fontSize: 17, color: U.white }}>{p.split(" · ")[0]}</span>
              <span style={{ fontFamily: U.font, fontSize: 14, color: U.text3 }}>{p.split(" · ")[1]}</span>
            </Rise>
          ))}
        </Card>
      </Rise>
    </AbsoluteFill>
  </Frame>
);
