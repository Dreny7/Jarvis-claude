// Ecelon V4 tokens — real product values (decoded app CSS + brand book).
// STRICT palette: white / orange / near-black only. No green/red anywhere.

export const V4 = {
  bg: "#0A0A0B",
  bgDeep: "#08080A",
  panel: "#0E0E11",
  panelBorder: "rgba(245,245,247,0.09)",

  orange: "#FF6B2C", // core
  orangeDeep: "#FF4B00", // CTA / emphasis
  orangeHi: "#FF7A3D", // highlight / rim
  neon: "#FF4B00", // FLAT brand field — never a gradient

  white: "#F5F5F7",
  dim: "rgba(245,245,247,0.55)",
  faint: "rgba(245,245,247,0.30)",

  font: "'Plus Jakarta Sans', -apple-system, 'Segoe UI', sans-serif",
  mono: "'Courier New', ui-monospace, monospace",
} as const;

// Deterministic pseudo-random (render must be pure).
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
