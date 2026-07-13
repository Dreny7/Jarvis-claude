// Single source of truth. 30fps · 2280f = 76.0s.
// LONG CRASH (31s, heart-first) → SLAM (music flip + boom) → HIGH-DOPAMINE
// PRODUCT (iOS-sleek, dense animation) → OUTRO.

export const FPS = 30;

export const T = {
  // THE ARCHIVE — recreated 2008, escalating
  c1: 0, //    "2008."
  c2: 70, //   it started in the housing market (rollover chart)
  c3: 180, //  DOW −777.68 crash day
  c4: 290, //  real-ticker collapse board
  c5: 400, //  wire headlines (Lehman / AIG / $700B bailout)
  c6: 510, //  the funds made billions (diverge)
  c7: 610, //  foreclosures + 10M homes
  c8: 730, //  $19.2T wealth erased · 8.8M jobs lost
  c9: 850, //  "For decades, the edge belonged to them."

  // FLIP
  slam: 930, //   boom + NOT ANYMORE. (HTH enters)
  reveal: 1000, // silhouette + lockup on orange
  built: 1090, // "We built the algorithm for everyone else."
  how1: 1170,
  how2: 1210,
  how3: 1250,

  // PRODUCT — fast, dense
  p1: 1290, //   composer money shot (iOS-sleek)
  agents: 1470, // your agent desk (6 archetypes, 2 modes)
  p2: 1590, //   hard limits / trust
  p3: 1740, //   71%
  p4: 1830, //   every market, one direct link

  // OUTRO
  a5: 1980,
  end: 2280,
} as const;

export const DUR = {
  c1: T.c2 - T.c1,
  c2: T.c3 - T.c2,
  c3: T.c4 - T.c3,
  c4: T.c5 - T.c4,
  c5: T.c6 - T.c5,
  c6: T.c7 - T.c6,
  c7: T.c8 - T.c7,
  c8: T.c9 - T.c8,
  c9: T.slam - T.c9,
  slam: T.reveal - T.slam,
  reveal: T.built - T.reveal,
  built: T.how1 - T.built,
  how1: T.how2 - T.how1,
  how2: T.how3 - T.how2,
  how3: T.p1 - T.how3,
  p1: T.agents - T.p1,
  agents: T.p2 - T.agents,
  p2: T.p3 - T.p2,
  p3: T.p4 - T.p3,
  p4: T.a5 - T.p4,
  a5: T.end - T.a5,
} as const;
