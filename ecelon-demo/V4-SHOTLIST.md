# Ecelon V4 — Shot list (locked before scene code)

62.0s · 1860 frames @ 30fps · 1920×1080 · strict white/orange/black · Plus Jakarta Sans.
Sourcing note: stock/AI-gen APIs are unreachable in this build environment (egress-blocked,
no keys), so every Act 1–2 "photographic" brief routes to **original Remotion work** —
graphic, stylized cinematography (silhouettes, documents, letterboxed + heavy grain),
per `shot-recreation-workflow`'s routing table. This also fully satisfies §4 guardrails:
nothing is or resembles real news footage or real identifiable people.

Recurring motifs: (a) the five logo facets (= Trust / AI Agents / Social / Data
Intelligence / Education layers, canonical map from brand book pp.3–7), seeded in Act 3,
labeled in Act 4d, assembled in Act 5; (b) the orange "+" scan-grid, introduced on the
Act 2 face, reused behind the Act 4 backtest chart and the Act 5 CTA.

| # | Frames | Dur | Beat / technical brief | Route | Grade/VFX |
|---|---|---|---|---|---|
| 1a | 0–85 | 2.8s | Black. "2008." types on, typewriter cadence, small centered white. Sub-line fades: "Ten million homes were lost." | remotion (TypeOn) | letterbox 2.39:1, grain 0.10, vignette heavy |
| 1b | 85–205 | 4.0s | Wide: suburban house silhouette at night, one dim warm window; slow push-in; window light dies at ~f165. Yard sign silhouette "FOR SALE / BANK OWNED". | remotion (SVG scene, Ken Burns) | same; near-monochrome, desaturated warmth |
| 1c | 205–290 | 2.8s | Close: taped notice on a door — "NOTICE OF FORECLOSURE" document, harsh top light, slow drift. | remotion (CSS document) | same |
| 1d | 290–360 | 2.3s | Black. Odometer ticks homes lost upward (quiet dread count-up), then line: "Nobody saw it coming." | remotion (Odometer + TypeOn) | same |
| 2a | 360–470 | 3.7s | HARD CUT + music drop: "Someone did." Rim-lit profile silhouette vs orange-to-black gradient; orange "+" scan-grid sweeps across the face, telemetry labels pop. First orange in the film. | remotion (ScanFace SVG) | letterbox stays, grain 0.07 |
| 2b | 470–560 | 3.0s | Data wall: scrolling order-book columns, ms timestamps. Kinetic type: "While families lost everything —" → "algorithms made billions." (impact + shake on 'billions') | remotion (DataWall + KineticLine) | same |
| 2c | 560–650 | 3.0s | Line chart whipping, faster columns. Type: "Hedge funds have run on algorithms & HFT for decades." | remotion | same |
| 2d | 650–750 | 3.3s | Tempo peak: fragments flash "faster." / "smarter." / "invisible." over accelerating data; riser SFX → hard cut to black. | remotion | same, cuts ~0.8s |
| 3 | 750–900 | 5.0s | THE PIVOT. Silence + black (12f). Line holds: "So we built the algorithm for everyone else." At ~f850: first facet (Trust) ignites orange with impact; letterbox bars retract — documentary becomes product. | remotion (FacetMark partial) | grain drops to 0.04 |
| 4a | 900–1080 | 6.0s | MONEY SHOT, one continuous UI: strategy composer — user types "Trade momentum on large-caps. Cap my risk at 2% a day." → Enter → backtest sweep (equity curve draws over faint "+" grid, stamps "Win rate 68% · Max drawdown −4.2%") → status flips "DEPLOYED · LIVE — PAPER" → real feed rows stream (Alpha Trader NVDA @142.80 BUY 2m; Mean Reversion SPY +1.2% SELL 14m…). | remotion | full-frame, subtle grain, UI glow restrained |
| 4b | 1080–1230 | 5.0s | Trust counterpunch. Head: "Their algorithms answer to no one. Yours answer to you." Alpha Trader card: limits stamp in — Max position 8% of book ✓ / Daily loss cap 2% ✓ / Withdraw funds — NEVER ALLOWED (lock, impact). Trust chips: Approvals stay with you · Hard limits, enforced · Every action logged. | remotion | orange = "enforced/live" only |
| 4c | 1230–1365 | 4.5s | Proof burst: "71%" counts up huge (Top agent win rate — real hero stat) with overshoot; broker chips snap in: Alpaca · Binance · Coinbase · Robinhood · Kraken · eToro; verified-trader mini card ("Broker-linked & verified", "+47.20% Annual ROI"). | remotion | staggered pops, beat-synced |
| 4d | 1365–1500 | 4.5s | Five facets fly in left→right, each labeled: Trust · AI Agents · Social · Data Intelligence · Education. Line: "Five layers. One desk." | remotion (FacetMark labeled) | pseudo-3D fly-in (perspective), per 3d-design lighting logic |
| 5a | 1500–1620 | 4.0s | Facets snap into the full M mark (each lock = tick), wordmark "ecelon™" slides in, glow bloom. | remotion | one hero glow moment |
| 5b | 1620–1750 | 4.3s | Tagline: "The AI-Agent Operating System for Modern Investors." Callback: "They had the algorithms. Now you do." | remotion | calm, centered |
| 5c | 1750–1860 | 3.7s | CTA pill "Get started" + real disclosure line verbatim: "Ecelon Beta · Paper trading · Live markets, no real funds" · ecelon.ai. Faint "+" grid behind. Fade out. | remotion | grain 0.04, fade last 20f |

Audio map (`video-sound-design`): Act 1 = synthesized low drone + tick SFX only (near-silence);
music enters exactly at f360 aligned to an onset in the track (offset from energy analysis);
hard duck at f750–790 (pivot silence), swell back f790–850; SFX: whoosh on hard cuts,
impact on 'billions'/lock/facet-ignite, ticks on typewriter & facet locks; fade final 2s;
post-render `loudnorm` to −14 LUFS.

Cut-length rhythm check (`motion-design`): 2.8/4.0/2.8/2.3 (slow holds) → 3.7/3.0/3.0/3.3-with-
internal-0.8s-cuts (accelerating) → 5.0 hold (stillness-before-payoff) → 6.0 dense / 5.0 / 4.5 /
4.5 (burst) → 4.0/4.3/3.7 (resolve). Non-uniform by design; payoff every ≤5s throughout.
