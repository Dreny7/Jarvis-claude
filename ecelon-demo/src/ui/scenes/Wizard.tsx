import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { U, USER, AGENT } from "../theme";
import { StepShell, Pill, Rise, useType, useRise, Card } from "../components/kit";

/* ---- Ignite: the invitation over the rays ---- */
export const Ignite: React.FC = () => {
  const r = useRise(4, 20, { damping: 18, stiffness: 160, mass: 0.9 });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: U.font, fontWeight: 800, fontSize: 60, letterSpacing: "-0.02em", color: U.pureWhite, opacity: r.opacity, transform: r.transform }}>
        {USER.first}, let's create your agent.
      </div>
    </AbsoluteFill>
  );
};

const Field: React.FC<{ children: React.ReactNode; w?: number; muted?: boolean; h?: number }> = ({ children, w = 640, muted, h }) => (
  <div style={{ width: w, minHeight: h ?? 62, borderRadius: 16, padding: "18px 24px", backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${U.hairline}`, fontFamily: U.font, fontSize: 24, color: muted ? U.text3 : U.white, display: "flex", alignItems: h ? "flex-start" : "center" }}>
    {children}
  </div>
);

const SelectCard: React.FC<{ title: string; body: string; selected?: boolean; delay: number }> = ({ title, body, selected, delay }) => {
  const r = useRise(delay, 20);
  return (
    <div style={{ width: 320, opacity: r.opacity, transform: r.transform }}>
      <div style={{ borderRadius: 18, padding: "24px 26px", height: 150, backgroundColor: "rgba(20,20,26,0.6)", backdropFilter: "blur(20px)", border: `1.5px solid ${selected ? U.orange : U.hairline}`, boxShadow: selected ? U.glowSelect : undefined }}>
        <div style={{ fontFamily: U.font, fontWeight: 800, fontSize: 26, color: U.white }}>{title}</div>
        <div style={{ fontFamily: U.font, fontSize: 17, color: U.text2, marginTop: 10, lineHeight: 1.4 }}>{body}</div>
      </div>
    </div>
  );
};

export const Step1: React.FC = () => (
  <StepShell step={1} heading="Choose what kind of agent you want" primary="">
    <div style={{ display: "flex", gap: 24 }}>
      <SelectCard title="Autonomous" body="Trades a strategy you write, inside hard limits. Paper funds, live prices." selected delay={10} />
      <SelectCard title="Consulting" body="A specialist that researches and advises in chat. It never places orders." delay={16} />
    </div>
  </StepShell>
);

export const Step2: React.FC = () => {
  const t = useType(AGENT.name, 12, 1.1);
  return (
    <StepShell step={2} heading="Name your agent">
      <Field>
        {t.shown}
        {t.caret && !t.done ? <span style={{ opacity: 0.7 }}>|</span> : null}
        {t.n === 0 ? <span style={{ color: U.text3 }}>Name your agent…</span> : null}
      </Field>
    </StepShell>
  );
};

export const Step3: React.FC = () => {
  const strat = useType(AGENT.strategy, 20, 1.9);
  const sym = useType(AGENT.ticker, 6, 1.4);
  return (
    <StepShell step={3} heading="Write the strategy">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Field w={640}>
          {sym.n === 0 ? <span style={{ color: U.text3 }}>Search a symbol, like BTCUSDT</span> : sym.shown}
          {sym.caret && !sym.done ? <span style={{ opacity: 0.6 }}>|</span> : null}
        </Field>
        <Field w={640} h={140}>
          <span style={{ fontSize: 22, lineHeight: 1.5 }}>
            {strat.shown}
            {strat.caret && !strat.done ? <span style={{ opacity: 0.7 }}>|</span> : null}
          </span>
        </Field>
        <div style={{ display: "flex", gap: 10 }}>
          <Pill label="Guided" size={18} />
          <Pill label="Expert" active size={18} />
        </div>
      </div>
    </StepShell>
  );
};

const RISKS = ["Conservative", "Balanced", "Aggressive", "Maximum"];
export const Step4: React.FC = () => (
  <StepShell step={4} heading="Choose the risk level">
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ display: "flex", gap: 12 }}>
        {RISKS.map((r, i) => (
          <Rise key={r} delay={10 + i * 3}><Pill label={r} active={r === AGENT.risk} size={20} /></Rise>
        ))}
      </div>
      <div style={{ width: 560, textAlign: "center", fontFamily: U.font, fontSize: 17, color: U.text2, lineHeight: 1.5 }}>
        Sets the minimum confidence (0–100) the agent needs before executing a signal. It never changes your strategy's rules, direction, or size.
      </div>
    </div>
  </StepShell>
);

export const Step5: React.FC = () => {
  const cap = useType("10,000", 8, 1.4);
  return (
    <StepShell step={5} heading="Mode and capital">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Field w={640}>{cap.shown}{cap.caret && !cap.done ? <span style={{ opacity: 0.6 }}>|</span> : null}<span style={{ color: U.text3, marginLeft: 8 }}>USDT</span></Field>
        <div style={{ fontFamily: U.font, fontSize: 16, color: U.text3 }}>Your wallet holds 100,000 USDT.</div>
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <Pill label="Auto" active size={18} />
          <Pill label="Manual" size={18} />
        </div>
      </div>
    </StepShell>
  );
};

const Row: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div style={{ display: "flex", padding: "14px 4px", borderBottom: `1px solid ${U.hairlineSoft}` }}>
    <span style={{ fontFamily: U.font, fontSize: 21, color: U.text2 }}>{k}</span>
    <span style={{ marginLeft: "auto", fontFamily: U.font, fontWeight: 700, fontSize: 21, color: U.white }}>{v}</span>
  </div>
);

export const Step6: React.FC = () => (
  <StepShell step={6} heading="Review your agent" primary="Next">
    <Rise delay={8}>
      <Card glass style={{ width: 640, padding: "16px 34px" }}>
        <Row k="Name" v={AGENT.name} />
        <Row k="Ticker" v={AGENT.ticker} />
        <Row k="Risk" v={AGENT.risk} />
        <Row k="Capital" v={AGENT.capital} />
        <div style={{ display: "flex", padding: "14px 4px" }}>
          <span style={{ fontFamily: U.font, fontSize: 21, color: U.text2 }}>Approvals</span>
          <span style={{ marginLeft: "auto", fontFamily: U.font, fontWeight: 700, fontSize: 21, color: U.white }}>{AGENT.approvals}</span>
        </div>
      </Card>
    </Rise>
  </StepShell>
);

const QA: React.FC<{ q: string; a: string; delay: number }> = ({ q, a, delay }) => {
  const r = useRise(delay, 18);
  return (
    <div style={{ width: 700, opacity: r.opacity, transform: r.transform }}>
      <div style={{ fontFamily: U.font, fontSize: 18, color: U.text2, lineHeight: 1.5, marginBottom: 10 }}>{q}</div>
      <Field w={700}>{a}</Field>
    </div>
  );
};

export const Step7: React.FC = () => (
  <StepShell step={7} heading="Hmm, I have some questions.">
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <QA delay={10} q="The strategy needs a technical entry condition while price is below the range. Which signal should trigger the entry?" a="When RSI(14) drops below 30." />
      <QA delay={20} q="Confirm the exit: close the position when RSI(14) crosses back above 50?" a="Yes, close above 50." />
    </div>
  </StepShell>
);

export const Step8: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [16, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const done = p >= 1;
  const bloom = done ? interpolate(frame, [66, 74, 90], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const R = 62;
  const C = 2 * Math.PI * R;
  const headR = useRise(2, 18);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 720 }}>
        <div style={{ fontFamily: U.font, fontWeight: 600, fontSize: 13, letterSpacing: "0.18em", color: U.text3, marginBottom: 16, opacity: headR.opacity }}>STEP 8 OF 8</div>
        <div style={{ fontFamily: U.font, fontWeight: 800, fontSize: 44, color: U.pureWhite, opacity: headR.opacity, transform: headR.transform }}>Ready to deploy?</div>
        <Rise delay={8} style={{ marginTop: 30 }}>
          <Card glass style={{ width: 560, padding: "10px 30px" }}>
            <Row k="Name" v={AGENT.name} />
            <Row k="Ticker" v={AGENT.ticker} />
            <Row k="Risk" v={AGENT.risk} />
            <div style={{ display: "flex", padding: "12px 4px" }}>
              <span style={{ fontFamily: U.font, fontSize: 19, color: U.text2 }}>Approvals</span>
              <span style={{ marginLeft: "auto", fontFamily: U.font, fontWeight: 700, fontSize: 19, color: U.white }}>{AGENT.approvals}</span>
            </div>
          </Card>
        </Rise>

        {/* hold to deploy */}
        <div style={{ marginTop: 34, position: "relative", width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {bloom > 0 && <div style={{ position: "absolute", inset: -40, borderRadius: "50%", backgroundColor: U.orange, filter: "blur(50px)", opacity: bloom * 0.8 }} />}
          <svg width={160} height={160} style={{ position: "absolute", inset: 0 }}>
            <circle cx={80} cy={80} r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={4} />
            <circle cx={80} cy={80} r={R} fill="none" stroke={U.orange} strokeWidth={4} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} transform="rotate(-90 80 80)" style={{ filter: "drop-shadow(0 0 12px rgba(255,106,44,0.7))" }} />
          </svg>
          <div style={{ width: 132, height: 132, borderRadius: "50%", backgroundColor: done ? U.orangeCta : "rgba(10,10,12,0.6)", border: `1px solid ${U.hairline}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: U.font, fontWeight: 700, fontSize: 19, color: "#fff", textAlign: "center", transform: `scale(${1 + bloom * 0.06})` }}>
            {done ? "Deployed" : "Hold to\ndeploy".split("\n").map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
