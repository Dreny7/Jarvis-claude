// Ecelon design tokens — V3. Hotter orange, true-black stage, glassy surfaces.

export const colors = {
  // Stage
  bg: "#050506",
  bgLift: "#0B0B0D",

  // Brand orange — pushed hotter & more saturated than V2
  orange: "#FF5C00",
  orangeHot: "#FF7B24",
  orangeSoft: "#FFA35C",
  orangeDeep: "#D93E00",

  // Text
  text: "#F7F6F4",
  textDim: "rgba(247, 246, 244, 0.55)",
  textFaint: "rgba(247, 246, 244, 0.32)",

  // Surfaces
  card: "rgba(255, 255, 255, 0.045)",
  cardBorder: "rgba(255, 255, 255, 0.09)",
  cardTopSheen: "rgba(255, 255, 255, 0.14)",

  // Semantic
  green: "#2FE39A",
} as const;

export const orangeGradient = `linear-gradient(135deg, ${colors.orangeHot} 0%, ${colors.orange} 55%, ${colors.orangeDeep} 100%)`;

export const glow = (size: number, alpha = 0.5) =>
  `0 0 ${size}px rgba(255, 92, 0, ${alpha})`;

export const fontStack =
  "'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

// Shared card look — the "sleek" surface used across scenes.
export const cardStyle: React.CSSProperties = {
  backgroundColor: colors.card,
  border: `1px solid ${colors.cardBorder}`,
  borderRadius: 22,
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.10), 0 24px 60px rgba(0,0,0,0.55)",
};
