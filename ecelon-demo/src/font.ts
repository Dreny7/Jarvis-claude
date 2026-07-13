import { injectFont } from "./safeFont";
import { interWoff2DataUri } from "./inter-data";

// V3 Inter, embedded — loaded via the hang-proof FontFace loader so it can
// never leave an open render handle in the shared bundle.
injectFont("Inter", interWoff2DataUri, "100 900");

export const inter = "'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
