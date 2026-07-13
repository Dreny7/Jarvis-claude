import { loadFont } from "@remotion/fonts";
import { interWoff2DataUri } from "./inter-data";

// Inter variable font, embedded as a data URI — zero network at render time,
// so the font delayRender can never hang a worker.
loadFont({
  family: "Inter",
  url: interWoff2DataUri,
  format: "woff2",
  weight: "100 900",
});

export const inter = "'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
