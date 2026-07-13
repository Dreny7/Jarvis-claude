// Single source of truth for the V4 edit. 30fps · 1860f = 62.0s.
// Non-uniform by design: holds (Acts 1, 3) vs bursts (Acts 2, 4).

export const FPS = 30;

export const T = {
  // ACT 1 — the hook (near-silence, letterboxed, heavy grain)
  a1a: 0, //   "2008." types on
  a1b: 85, //  house silhouette, window light dies
  a1c: 205, // foreclosure notice document
  a1d: 270, // odometer → "Nobody saw it coming." (extended so both beats hold)

  // ACT 2 — the reveal (music slams in)
  a2a: 360, // "Someone did." + scan-grid face
  a2b: 470, // "algorithms made billions."
  a2c: 560, // "Hedge funds have run on algorithms for decades."
  a2d: 650, // faster. smarter. invisible. (riser)

  // ACT 3 — the pivot (silence, hold, first facet ignites)
  a3: 750,
  a3Ignite: 850, // facet + letterbox retract begins

  // ACT 4 — the product burst
  a4a: 900, //  strategy composer money shot
  a4b: 1080, // trust counterpunch (Alpha Trader limits)
  a4c: 1230, // 71% + brokers + verified card
  a4d: 1365, // five facets, five layers

  // ACT 5 — brand / CTA (calm resolve, no cuts)
  a5: 1500,
  end: 1860,
} as const;

export const DUR = {
  a1a: T.a1b - T.a1a,
  a1b: T.a1c - T.a1b,
  a1c: T.a1d - T.a1c,
  a1d: T.a2a - T.a1d,
  a2a: T.a2b - T.a2a,
  a2b: T.a2c - T.a2b,
  a2c: T.a2d - T.a2c,
  a2d: T.a3 - T.a2d,
  a3: T.a4a - T.a3,
  a4a: T.a4b - T.a4a,
  a4b: T.a4c - T.a4b,
  a4c: T.a4d - T.a4c,
  a4d: T.a5 - T.a4d,
  a5: T.end - T.a5,
} as const;
