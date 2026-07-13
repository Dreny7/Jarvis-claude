// Single source of truth. 30fps · 2330f = 77.7s.
// LONG CRASH (31s, heart-first) → CRT power-off + SLAM (music flip) →
// BEAT-SYNCED PRODUCT (every boundary sits on a Highway-to-Hell onset,
// measured from the file: chords at slam+66/+131/+164..., drums at +259).

export const FPS = 30;

const SLAM = 930;

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

  // FLIP — CRT power-off runs slam-14 → slam, chord 1 hits ON the slam
  slam: SLAM, //        neon shockwave + NOT ANYMORE.   (chord 1)
  reveal: SLAM + 66, // lockup on flat neon             (chord 2)
  built: SLAM + 131, // "We built the algorithm…"       (chord 3)
  punch: SLAM + 194, // Type it. Test it. Trade it.     (chords 4/5/6)

  // PRODUCT — beat-locked
  phone: SLAM + 259, // the phone flies in AS THE DRUMS ENTER
  p1: SLAM + 536, //    composer money shot
  agents: SLAM + 662, // your agent desk
  p2: SLAM + 786, //   hard limits / trust
  p3: SLAM + 896, //   71%
  p4: SLAM + 974, //   every market, one direct link

  // OUTRO
  a5: SLAM + 1098,
  end: 2330,
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
  built: T.punch - T.built,
  punch: T.phone - T.punch,
  phone: T.p1 - T.phone,
  p1: T.agents - T.p1,
  agents: T.p2 - T.agents,
  p2: T.p3 - T.p2,
  p3: T.p4 - T.p3,
  p4: T.a5 - T.p4,
  a5: T.end - T.a5,
} as const;
