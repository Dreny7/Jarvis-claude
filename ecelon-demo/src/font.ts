import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Inter variable font, bundled locally in public/fonts (no network at render time).
loadFont({
  family: "Inter",
  url: staticFile("fonts/Inter-latin.woff2"),
  weight: "100 900",
});

export const inter = "'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
