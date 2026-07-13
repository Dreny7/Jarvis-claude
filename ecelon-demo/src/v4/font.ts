import { loadFont } from "@remotion/fonts";
import { pjsWoff2DataUri } from "./pjs-data";

// Plus Jakarta Sans variable (real product font), embedded as a data URI —
// zero network at render time so delayRender can never hang a worker.
loadFont({
  family: "Plus Jakarta Sans",
  url: pjsWoff2DataUri,
  format: "woff2",
  weight: "200 800",
});
