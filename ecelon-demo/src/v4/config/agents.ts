// Single source of truth for the agent roster — a prop-desk of trading
// specialists (order flow, smart money/ICT, news, structure, liquidity,
// volume). Referenced by Phone.tsx and Act4.tsx so a rename only happens
// here. WIN_RATE is likewise the one number every "win rate" mention reads.

export type Agent = {
  key: string;
  name: string;
  initials: string;
  oneLiner: string;
};

export const AGENTS: Agent[] = [
  { key: "of", name: "Order Flow", initials: "OF", oneLiner: "Follows institutional size on the tape." },
  { key: "sm", name: "Smart Money", initials: "SM", oneLiner: "Fair-value gaps, liquidity, killzones." },
  { key: "nd", name: "News Desk", initials: "ND", oneLiner: "Prices the headline before the room reacts." },
  { key: "ms", name: "Market Structure", initials: "MS", oneLiner: "Maps the trend's higher highs and lows." },
  { key: "lq", name: "Liquidity", initials: "LQ", oneLiner: "Hunts stops, sweeps, and voids." },
  { key: "vp", name: "Volume Profile", initials: "VP", oneLiner: "Finds where price wants to trade." },
];

export const agent = (key: string): Agent => AGENTS.find((a) => a.key === key)!;

/** The hero agent — spotlighted on the guardrails/trust card. */
export const HERO_AGENT = AGENTS[0];

/** One win-rate number, read everywhere it's quoted. */
export const WIN_RATE = 71;

export const STRATEGY_PROMPT = "Long ES on order-flow reversals. Cap my risk at 2% a day.";

export const LIVE_FEED: { key: string; txt: string; tag: "BUY" | "SELL" | "FLAG"; when: string }[] = [
  { key: "of", txt: "absorbed sell-side at 5,183 · LONG", tag: "BUY", when: "2m" },
  { key: "sm", txt: "filled the 5,142 FVG · LONG", tag: "BUY", when: "14m" },
  { key: "nd", txt: "faded the CPI spike · +0.9%", tag: "SELL", when: "22m" },
  { key: "ms", txt: "BOS confirmed on 4H · trend up", tag: "FLAG", when: "31m" },
];

export const COMMUNITY_POST = {
  user: "jade.d",
  pct: "+12.4%",
  quote: `ES order-flow reversals, 2% daily cap — ${WIN_RATE}% win rate, broker-verified.`,
};
