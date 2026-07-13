# Ecelon V4 — Build Brief for Fable 5

Copy everything below the line into a message to Fable 5 (`claude-fable-5`) in a
session that has this repository checked out. It is self-contained: it does
not assume Fable 5 has seen this conversation.

---

## 0. Who you are for this task and what's available to you

You are building **Ecelon V4**, a completely new launch-video concept for
Ecelon (an AI-agent trading platform), replacing the V3 video at
`ecelon-demo/`. This repo has ten Claude Code skills installed at
`.claude/skills/` — **use all of them**, invoked via the Skill tool at the
appropriate stage. They exist specifically so a video like this can be built
well instead of generically:

| Skill | Use it for |
|---|---|
| `launch-video-marketing` | The narrative arc below — hook/context/value/proof/brand/CTA structure, retention pacing, one-message discipline |
| `shot-recreation-workflow` | Turning "2008 crisis energy" and "Big Short energy" into an **original** shot list — real historical event, not copyrighted film footage (see §4 legal guardrails) |
| `motion-design` | Easing/timing choices, hold-vs-burst pacing rhythm, typography/color rules, transition taxonomy, composition |
| `kinetic-animation` | Kinetic typography (letter/word builds, count-ups), particle systems, fake-camera moves |
| `video-sound-design` | The score's emotional arc, ducking, SFX on cuts, loudness mastering |
| `cinematic-vfx` | Color grading, film grain, vignette — used to unify stock/generated/code-drawn footage into one graded look |
| `ai-video-generation` | Generating the hook and hedge-fund-algo sections' footage (see §4 for what's allowed) |
| `footage-libraries` | Licensed stock alternative/supplement to generated footage for the same sections |
| `3d-design` | Optional: a 3D hero moment for the logo mark if you use one (see §6) |
| `remotion` | Implementation and final compositing — read `reference/voiceover-captions.md` if you add narration |

Read each skill's `SKILL.md` before using it. Do not skip
`shot-recreation-workflow` and the legal guardrails in §4 — this video opens
on a real, sensitive historical event and that section must be built
correctly, not just fast.

---

## 1. Ground truth: what Ecelon actually is (do not invent facts)

Everything below is pulled directly from the real product (decoded app HTML)
and the official brand book — not assumptions. Build V4 on these facts.

**Tagline (use verbatim, it appears identically across landing pages and
brand book):** "The AI-Agent Operating System for Modern Investors" / short
form "The AI layer for modern investors." Secondary line: "Trade smarter.
Automate faster. Invest with agents."

**What it does:** Investors connect their real brokerage (read-only keys,
their own custody) and describe a strategy; specialized AI agents
research, backtest, and execute it within hard limits the investor sets.

**Critical accuracy requirement — this is currently a paper-trading beta.**
The real product is explicit about this everywhere: *"Every Ecelon account
trades a virtual balance against live market prices... no real money at
risk." "During the beta, accounts are paper-only. Agents send orders to a
virtual book; your brokerage balances never move."* **V4 must not depict or
imply real live capital execution without this context.** Work an honest
beat into the outro/fine-print — e.g. "Free during beta · Paper trading with
live market data" — the way the real landing page does. Don't hide this;
it's a real, current, factual constraint on what the product does today, and
misrepresenting it is a credibility risk for the client.

**Five platform layers (this is also literally what the five logo facets
represent — see §6):** Research, Trading, Portfolio monitoring, Risk,
Social investing.

**Real agent example — use this, not an invented one:**
"Alpha Trader — Autonomous · momentum — Max position size 8% of book — Daily
loss cap 2% — Withdraw funds: Never allowed — Publishes fills to feed."
Six agent archetypes total, each running in **autonomous** or **consulting**
mode.

**The actual trust/control pitch — this is the single most important
messaging pillar and V3 never used it. It is exactly what makes the "hedge
funds have secret algorithms, we don't" narrative land:**
- "Sensitive actions gated and approved by you"
- "Capital, risk and exposure limits enforced" (agents cannot cross them)
- "A transparent audit trail on every action"

**Real onboarding (3 steps):** 01 Connect your broker (Alpaca, Binance,
Coinbase, Robinhood — read-only keys, your custody) → 02 Set your limits
(position size, loss caps, approvals) → 03 Deploy your agents.

**Real connected brokers/exchanges:** Alpaca, Binance, Coinbase, Robinhood,
Kraken, eToro. (V3 incorrectly used Alpaca/IBKR/Kalshi/Coinbase/Binance/
Tradier — IBKR, Kalshi, and Tradier are not in the real product. Fix this.)

**Real flagship stat:** "Top agent win rate: 71%" — this is the number
featured on the landing hero itself, use it as the headline stat, not an
invented one.

**Real dashboard numbers usable for authenticity** (mobile app, populated
state): Total balance $12,540.18, +$278.40 (2.27%) today, "2 live" agents,
managed by 6 agents, $12.5K deployed, 3 autonomous / 3 consulting / 6 trades
/ 68% win rate, live feed examples: "Alpha Trader opened NVDA @ $142.80 BUY
2m," "Mean Reversion closed SPY +1.2% SELL 14m," "Risk Agent flagged beta at
1.34 22m," "Macro Research published a dovish Fed brief 31m."

**Real social/verified-trader layer:** profile card pattern — handle,
"Independent Trader · ex-[firm] Desk," follower count, "+X% Annual ROI,"
"$X Public AUM," "Broker-linked & verified" badge, a feed of specific
broker-verified trade posts. Use this shape (not necessarily these exact
names) if V4 touches the social layer.

**User's own product framing for this video (honor this explicitly in the
demo beat):** "You link up directly with your broker, you type in your
strategy, and it immediately starts backtesting and executing your
strategy." Use this as the money-shot product moment — grounded in the real
3-step onboarding above (this *is* step 03, described in the user's words).

---

## 2. Brand system — read this before writing a single line of scene code

**Logo:** The "M" mark is five angular facets in a zigzag. **This is not
decorative — each facet officially represents one of the five platform
layers**: Trust Layer, AI Agents Layer, Social Layer, Data Intelligence
Layer, Education Layer (in that left-to-right order per the brand book).
When you animate the logo assembling facet-by-facet, that build has real
meaning — consider a hero moment where each facet is briefly labeled as it
locks in, or at minimum know this when pacing the build. Wordmark is
lowercase "ecelon" with a registered trademark mark.

**Color — STRICT constraint for this video, no exceptions:** white, orange,
and black/near-black **only**. The real brand system does have a flexible
alt-colorway kit (indigo/purple, magenta) used for internal campaign
variety in the brand book, but the user has explicitly restricted this
video to white/orange/black — do not use the purple or magenta variants,
and do not use semantic red/green for gains/losses even though the live
product UI does (green #3FD98A/#1FAD66 for gains, red #FF6B61/#E5342B for
losses) — represent gains/losses through typography, iconography (▲/▼), or
motion instead of color for this video.

Real hex values (from the live product CSS, use these, not approximations):
- Orange core: `#FF6B2C` · Orange deep/CTA: `#FF4B00` · Orange highlight: `#FF7A3D`
- Near-black backgrounds: `#0A0A0B` / `#0E0E11` / `#08080A`
- White/off-white: `#FFFFFF` / `#F5F5F7`

**Typography — real product font, correct this from V3:** **Plus Jakarta
Sans**, not Inter. Verified directly from the shipped app's `@font-face`
declarations. Use `@remotion/fonts` with the font embedded as a data URI
(see §8 technical notes — this avoids the render-timeout issue V3 hit).

**Photography direction — pulled directly from the brand book, and directly
useful for this video's hook/reveal sections:**
1. Dramatic, high-contrast **rim-lit human silhouette portraits** against a
   saturated orange-to-black gradient — profile shots, moody, cinematic,
   almost entirely silhouette with a thin rim light tracing the edge.
2. A face overlaid with an **orange technical scanning/crosshair grid**
   pattern (small "+" marks in a grid across the face) — an "AI is
   analyzing/seeing" motif used in the brand's own OOH ad mockup, captioned
   "The AI layer for modern investors." **This is a strong, brand-native
   device for the hedge-fund-algorithm section** — the same visual idea
   (data/telemetry overlaid on a human subject) that both reference videos
   analyzed in this project independently converge on. Use it.
3. Premium, dark product photography (deep macro shots, soft directional
   light streaks) if referencing any physical brand touchpoint.

V3 used zero photographic/human imagery — 100% UI mockups and abstract
particles. V4's hook requires human imagery, and the brand book already
established exactly what that should look like. Don't invent a different style.

---

## 3. Narrative structure

Total run time target: **~55–65 seconds** — longer than V3's 38s because
this version carries a real emotional arc that needs room to breathe, but
apply the hold-then-burst pacing lesson (§5) so it never feels slow. Use
`launch-video-marketing`'s structure, mapped to the user's explicit
instruction:

**ACT 1 — THE HOOK (0–~12s): human stakes, wordless or near-wordless.**
Built via `shot-recreation-workflow`, NOT literal 2008 news footage (see
§4). Evocative, quiet, devastating: an empty suburban house, a "bank owned"
/ foreclosure notice on a door, moving boxes in an empty room, a worn family
photo left behind, a for-sale sign in overgrown grass. Muted, near-monochrome
or desaturated-toward-black grade (still within the orange/black/white
constraint — think: mostly black and white with the faintest warm tone, not
saturated). Slow cuts, real silence or near-silence in the score. This
should feel like it could open a serious documentary, not an ad. No product
mention, no logo, no orange yet — earn every subsequent beat.

**ACT 2 — THE REVEAL (~12–25s): the system, not the family, did this.**
Tonal and visual shift: introduce the orange scanning-grid-on-face motif
here, or abstract data/chart/order-flow visualizations moving inhumanly
fast. Kinetic typography states the thesis plainly and generically — e.g.
"While families lost everything in 2008 — algorithms made billions. Nobody
told them how." / "Hedge funds have run on algorithms and high-frequency
trading for decades. Most traders still don't." Keep it systemic/generic
(see §4 — no real firm names, no real logos, no accusing a specific
company). This is where pacing should start accelerating — shorter cuts,
data visuals, a rising score.

**ACT 3 — THE PIVOT (~25–30s): the turn.**
A single strong line turning from indictment to solution — e.g. "So we
built the algorithm for everyone else." This is the fastest, hardest beat
in the video — could be a hold (one strong static frame + line) right after
the acceleration of Act 2, per the motion-design "deliberate stillness
before payoff" principle. First logo/orange appearance can land right here
or immediately after.

**ACT 4 — THE PRODUCT (~30–50s): grounded in real facts from §1.**
This is where V3's content was reasonably good and should be substantially
reused/upgraded, not reinvented: the "type your strategy → agents backtest
and execute" money-shot moment (user's framing, tied to the real 3-step
onboarding), the five platform layers (tie back to the five logo facets
from Act 3's reveal if you did a facet-labeled build), the real trust/control
pillar (approvals, hard limits, audit trail — THE differentiator vs. the
opaque algorithms from Act 2), a real agent card (Alpha Trader, real limits),
real brokers, real dashboard numbers. This section should be the "burst" —
denser, faster, more information per second than Acts 1–2, mirroring how
both reference videos escalate energy toward their information-dense middle.

**ACT 5 — BRAND / CTA (~50–65s):**
Logo resolves fully assembled (all 5 facets, meaning now established),
tagline, and the honest paper-trading-beta disclosure line, then CTA. Land
on something that echoes Act 1/2's thesis — e.g. "Markets never told you the
truth. Now you have the same edge." — a callback closes the arc the way
both reference videos close on a callback to their own hook.

---

## 4. Legal / ethical guardrails — read before sourcing any Act 1–2 footage

- **No real news broadcast footage of the 2008 financial crisis.** That
  footage is copyrighted by the broadcasters (CNN, ABC, etc.), not public
  domain, and is not licensed for reuse in a commercial ad regardless of
  where it's found.
- **No real, identifiable people's real foreclosure/eviction footage**,
  even if technically obtainable (e.g. from a public-domain government
  archive). Using real anonymous strangers' worst financial moment as
  emotional marketing fuel for a trading product is exploitative
  irrespective of copyright status. Use `footage-libraries` (licensed,
  anonymous, generic stock — empty houses, moving boxes, foreclosure signs)
  or `ai-video-generation` (generated, clearly not claiming to be real
  documentary footage) instead. Both can hit the same emotional target
  legitimately.
- **The 2008 financial crisis as a historical event is fine to reference** —
  it's real history, not anyone's intellectual property. What's off-limits
  is *The Big Short* (the film)'s specific shots, dialogue, or scenes, and
  any real broadcast footage. Draw on the real event, not the movie.
- **No specific real hedge fund names, logos, or executives** as the
  "villain" of Act 2. Keep the critique systemic and generic ("algorithms,"
  "hedge funds" as a category, "high-frequency trading" as a practice) —
  this avoids defamation risk and is also just more accurate (this isn't
  about one firm).
- **Disclose the paper-trading/beta status** somewhere legible in the video
  per §1 — don't let Act 4's product demo imply real live capital execution.

---

## 5. What to do differently from V3 (specific, evidenced weaknesses)

V3 (at `ecelon-demo/src/`) is well-crafted technically but has real content
and design errors now that the actual product/brand ground truth is known.
Fix these in V4, don't just add a new intro on top of the same body:

1. **Wrong brokers** — Brokers scene lists Alpaca/IBKR/Kalshi/Coinbase/
   Binance/Tradier. Real list: Alpaca/Binance/Coinbase/Robinhood/Kraken/eToro.
2. **Wrong font** — uses Inter; real product uses Plus Jakarta Sans.
3. **Invented agent names/stats with no trust framing** — "Market Analyst/
   Trading Agent/Risk Management/Macro Research/Portfolio Manager" with
   generic ACTIVE/LIVE/OK badges. Real differentiator is autonomous vs.
   consulting mode plus hard numeric limits (8% position cap, 2% daily loss
   cap, no withdrawal) — this is the actual product, and it's also the
   whole point of the new Act 2→Act 4 turn (opaque algorithms vs. capped,
   auditable ones). V3 never shows a single limit number.
4. **The trust/control pillar is entirely absent** — "approvals stay with
   you," "hard limits enforced," "transparent audit trail" is the real
   product's central pitch and doesn't appear anywhere in V3. This is the
   biggest content gap, and it's specifically what makes V4's new narrative
   arc work — don't repeat the omission.
5. **No paper-trading/beta disclosure** — V3 implies live capital trading
   with invented dollar figures; the real product is explicit that it's
   beta paper-trading with $0 real funds at risk currently.
6. **Logo facets used decoratively, not meaningfully** — now that the
   5-facet-= 5-layer meaning is known, the build animation should say
   something, not just look nice.
7. **No emotional hook, no human stakes, no narrative arc** — V3 opens
   straight into product with a generic "Markets never sleep" line and
   proceeds as an undifferentiated feature tour. Both reference videos
   analyzed for this project invest real time in a patient, often wordless
   hook before naming the brand — V4's whole redesign is built to fix this.
8. **Uniform pacing** — scenes run a fairly even 145–180 frames with no
   hold/burst contrast and no real beat-sync to the score. Apply
   `motion-design`'s pacing-rhythm guidance and `video-sound-design`'s
   audio-reactive techniques this time.
9. **Audio is one flat music bed, fade in/out only** — no narration, no
   ducking, no SFX on cuts. Use `video-sound-design` properly this time:
   a score with a real emotional arc across the five acts, SFX accents on
   hard cuts, and consider a spoken line or two for Act 2/3's thesis
   statements (see `remotion`'s `reference/voiceover-captions.md`).
10. **No photographic/human imagery at all** — 100% UI mockups and abstract
    particles. The brand book's own photography direction (rim-lit
    silhouettes, orange-scan-grid faces) was never used. V4's hook requires
    it and the brand system already specifies exactly what it should look like.
11. **Generic SaaS-ad visual clichés with no recurring motif** — the phone
    mockup and broker-orbit scenes are competent but could be any fintech
    app; nothing carries a signature device across scenes the way strong
    reference work does (a repeated match-cut object, a consistent data/
    scan-grid treatment, etc.). Pick one and repeat it — the logo facets
    are the obvious candidate given their real meaning.
12. **Colors and invented stats are close-but-not-real** — orange was
    `#FF5C00` (real is `#FF6B2C`/`#FF4B00`), dashboard numbers were
    invented ($68,490.60, 44% ROI, 102K followers) rather than the real
    ones ($12,540.18, 71% win rate, real agent feed lines in §1). Use the
    real numbers — they're better anyway (specific, verifiable, and they'll
    match what a viewer sees seconds later if they actually open the app).

---

## 6. Technical build notes (lessons already learned building V3 — don't re-hit these)

- Set up `@remotion/fonts` with Plus Jakarta Sans embedded as a base64 data
  URI (fetch it once from Google Fonts, encode, inline) — a live font fetch
  during headless render can hang `delayRender()` and time out in a
  sandboxed/offline render environment.
- `remotion.config.ts`: point `Config.setBrowserExecutable` at whatever
  Chromium/headless-shell binary is available in this environment if the
  default fails to launch; set a generous `Config.setTimeoutInMilliseconds`
  (V3 needed 180000) and cap `Config.setConcurrency` to the available CPU
  cores — heavy glow/blur/grain frames can starve the default settings.
- Build the composition in stages: render single-frame stills at a few
  timestamps per scene first (`npx remotion still ... --frame=N`) to sanity
  check layout/color/typography before committing to a full render — this
  caught real layout bugs cheaply during V3's build.
- New composition: create `EcelonDemoV4` (new scene files under
  `ecelon-demo/src/scenes-v4/` or similar) rather than overwriting V3's
  files — V3 should remain renderable for comparison. Update `Root.tsx` to
  register both compositions.
- If you generate or source footage per §4, save it to
  `ecelon-demo/public/clips/` and bring it in via `<OffthreadVideo>`, graded
  via `cinematic-vfx` to sit consistently alongside the code-drawn scenes.

---

## 7. Deliverable

A new `EcelonDemoV4` Remotion composition implementing the five-act
structure above, rendered to `ecelon-demo/out/EcelonDemoV4.mp4`, using real
product facts (§1), the real brand system (§2), strictly white/orange/black,
Plus Jakarta Sans, all ten skills tagged in §0 where relevant, and the legal
guardrails in §4 respected throughout. Render a handful of stills across the
timeline for review before the final full render.
