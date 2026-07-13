// Single source of truth for the V4 edit. 30fps · 1830f = 61.0s.
// Restructured: aged-broadcast crash documentary → turn → product → brand.

export const FPS = 30;

export const T = {
  // ACT 1 — THE ARCHIVE (recreated 2008 broadcast, aged look, subtitles)
  a1_year: 0, //     "2008." over tape static
  a1_banks: 90, //   Dow crash + "banks gambled trillions..."
  a1_bailout: 220, //bailout board + "they were bailed out"
  a1_funds: 340, //  hedge-fund profit + "made billions betting against everyone"
  a1_cost: 460, //   human cost + "ten million families lost everything"

  // ACT 2 — THE TURN (scan-grid face → pivot → first facet ignites)
  a2_system: 600, // "The system was built for them."
  a2_pivot: 720, //  "So we built the algorithm for everyone else." + facet ignite

  // ACT 3 — THE PRODUCT
  a4a: 860, //  strategy composer money shot
  a4b: 1050, // trust / Alpha Trader hard limits
  a4c: 1200, // 71% + brokers + verified
  a4d: 1335, // five facets, five layers

  // ACT 4 — BRAND / CTA
  a5: 1470,
  end: 1830,
} as const;

export const DUR = {
  a1_year: T.a1_banks - T.a1_year,
  a1_banks: T.a1_bailout - T.a1_banks,
  a1_bailout: T.a1_funds - T.a1_bailout,
  a1_funds: T.a1_cost - T.a1_funds,
  a1_cost: T.a2_system - T.a1_cost,
  a2_system: T.a2_pivot - T.a2_system,
  a2_pivot: T.a4a - T.a2_pivot,
  a4a: T.a4b - T.a4a,
  a4b: T.a4c - T.a4b,
  a4c: T.a4d - T.a4c,
  a4d: T.a5 - T.a4d,
  a5: T.end - T.a5,
} as const;
