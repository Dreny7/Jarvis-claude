/**
 * Register an embedded (data-URI) font WITHOUT a delayRender handle.
 * We inject a plain @font-face; Remotion already waits on document.fonts.ready
 * before capturing each frame, and a data-URI face parses near-instantly — so
 * there is no render handle that can hang the way @remotion/fonts' loadFont did
 * in the shared multi-composition bundle.
 */
export const injectFont = (family: string, dataUri: string, weight = "400") => {
  if (typeof document === "undefined") return;
  const id = `ff-${family.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent =
    `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};` +
    `font-display:block;src:url(${dataUri}) format('woff2');}`;
  document.head.appendChild(style);
  // nudge the browser to start parsing (fire-and-forget; no await, no handle)
  try {
    (document as unknown as { fonts: { load: (s: string) => Promise<unknown> } }).fonts
      .load(`1em '${family}'`)
      .catch(() => {});
  } catch {
    /* ignore */
  }
};
