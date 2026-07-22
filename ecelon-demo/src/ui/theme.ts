// Ecelon UI-video tokens. STRICT white / orange / near-black (user locked —
// no green/red; product semantic colors mapped into the brand palette).
// Values are calibrated estimates from the product screenshots.

export const U = {
  bg: "#0A0A0B",
  bgPanel: "#0E0E11",
  surface: "#161619",
  surface2: "rgba(255,255,255,0.045)",
  surface3: "rgba(255,255,255,0.08)",
  hairline: "rgba(255,255,255,0.10)",
  hairlineSoft: "rgba(255,255,255,0.06)",

  orange: "#FF6A2C", // lines, wires, ring, accents
  orangeCta: "#FF5A1F", // primary buttons
  orangeHi: "#FF7A3C", // links, hints
  orangeDeep: "#F0531E",

  white: "#F5F5F7",
  pureWhite: "#FFFFFF", // selected pill fill, headings on rays
  text2: "rgba(245,245,247,0.62)",
  text3: "rgba(245,245,247,0.38)",
  ink: "#0A0A0B", // text on white/orange fills

  font: "'Plus Jakarta Sans', -apple-system, 'Segoe UI', sans-serif",
  mono: "'Courier New', ui-monospace, monospace",

  // elevation / glow
  elevCard: "0 20px 60px rgba(0,0,0,0.45)",
  elevFloat: "0 40px 110px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
  glowCta: "0 0 40px rgba(255,90,31,0.45)",
  glowSelect: "0 0 30px rgba(255,106,44,0.30)",
} as const;

// Placeholder identity (never the real user's name).
export const USER = { name: "Alex Rivera", first: "Alex", handle: "@alexrivera", initials: "AR" };

// Canonical demo agent — one consistent dataset on every screen.
export const AGENT = {
  name: "Nova",
  ticker: "BTCUSDT",
  venue: "Binance",
  market: "Crypto",
  type: "Autonomous",
  strategy: "Go long when RSI(14) drops below 30 on 5m candles. Close when RSI(14) crosses above 50.",
  risk: "Balanced",
  capital: "10,000 USDT",
  approvals: "Manual",
  winRate: 71,
};

export const hash = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
