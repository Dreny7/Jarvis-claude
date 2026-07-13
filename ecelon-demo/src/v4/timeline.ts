// Single source of truth for the V4 edit. 30fps · 1830f = 61.0s.
// CRASH (fast aged-broadcast cuts, "The Way" driving section)
// → ORANGE SLAM (Highway to Hell kicks in) → PRODUCT MONTAGE → OUTRO.

export const FPS = 30;

export const T = {
  // CRASH — recreated 2008 archive, fast cuts
  c1: 0, //    "2008." title card
  c2: 70, //   DOW −777.68 crash chart + banks
  c3: 165, //  real-ticker collapse board
  c4: 260, //  market falls / funds rise
  c5: 350, //  foreclosures + 10M homes lost
  c6: 440, //  "For decades, the edge belonged to them."

  // ECELON INTRO — high energy, music flips to HTH at slam
  slam: 540, //   NOT ANYMORE. (black on orange)
  reveal: 610, // silhouette + lockup (reference-photo frame)
  built: 700, //  "We built the algorithm for everyone else."
  how1: 780, //   Type your strategy.
  how2: 820, //   Agents backtest it.
  how3: 860, //   They execute — live.

  // PRODUCT MONTAGE — quick
  p1: 900, //  strategy composer money shot
  p2: 1080, // Alpha Trader hard limits
  p3: 1200, // 71% proof
  p4: 1290, // every market, one direct link (brokers/exchanges)

  // OUTRO
  a5: 1440,
  end: 1830,
} as const;

export const DUR = {
  c1: T.c2 - T.c1,
  c2: T.c3 - T.c2,
  c3: T.c4 - T.c3,
  c4: T.c5 - T.c4,
  c5: T.c6 - T.c5,
  c6: T.slam - T.c6,
  slam: T.reveal - T.slam,
  reveal: T.built - T.reveal,
  built: T.how1 - T.built,
  how1: T.how2 - T.how1,
  how2: T.how3 - T.how2,
  how3: T.p1 - T.how3,
  p1: T.p2 - T.p1,
  p2: T.p3 - T.p2,
  p3: T.p4 - T.p3,
  p4: T.a5 - T.p4,
  a5: T.end - T.a5,
} as const;
