import { injectFont } from "../safeFont";
import { pjsWoff2DataUri } from "./pjs-data";

// Plus Jakarta Sans (real product font), embedded as a data URI and loaded
// via a hang-proof FontFace loader.
injectFont("Plus Jakarta Sans", pjsWoff2DataUri, "200 800");
