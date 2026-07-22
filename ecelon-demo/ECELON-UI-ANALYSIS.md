# Ecelon Product UI/UX — Deep Analysis & Remotion Build Spec

Source: ~16 real product screenshots supplied by the user across three
messages. This document is the single source of truth for building a
UI-showcase Remotion video that recreates the Ecelon app faithfully. It is
written so a builder (this project, or Codex) can reconstruct every screen
without seeing the originals.

> Provenance note: the screenshots were pasted inline into chat, not saved
> as files, so hex values / font IDs below are **careful visual estimates**
> flagged as such — treat them as calibration starting points, eyedrop the
> originals to lock exact values before final render.

---

## 1. WHAT ECELON IS (from the UI + earlier product docs)

An AI-agent trading platform. A user creates **agents** — either
**Autonomous** (executes a strategy you write, in paper mode, inside hard
risk limits, on live prices) or **Consulting** (a chat specialist that
researches and advises, never places orders). Agents connect to the user's
own venues (Binance shown, "read + trade scope", paper-scope in beta) —
**Ecelon never holds funds**. There is also a **social Feed** layer (posts,
polls, a "LONG" endorse mechanic, ROI badges). Confirmed markets from the
product Q&A: **Crypto, Stocks, Prediction Markets, Futures**.

---

## 2. GLOBAL DESIGN SYSTEM

### 2.1 Palette (estimated tokens)

| Token | Est. value | Where |
|---|---|---|
| `bg` base | `#0A0A0B` | app background, everywhere |
| `surface` | `#16161A` | cards, panels (slightly lifted from bg) |
| `surface-2` | `rgba(255,255,255,0.04)` | inset fills, rows, inputs |
| `hairline` | `rgba(255,255,255,0.08–0.12)` | card borders, dividers |
| `orange` (CTA) | `#FF5A1F` | Post / Continue / Next / send / active + |
| `orange-deep` | `#F0531E` | pressed / gradient stop |
| `orange-accent` | `#FF7A3C` | links, "Why?", active hints |
| `hero-gradient` | radial `#F5641E → #6B3A1A → #0A0A0B` | dashboard greeting band |
| `rays` | orange god-rays `~#C9803C` on `#0A0A0A` | onboarding modal bg |
| `white` | `#FFFFFF / #F5F5F7` | primary text, **selected pill fill** |
| `text-2` | `rgba(255,255,255,0.62)` | secondary text |
| `text-3` | `rgba(255,255,255,0.35)` | tertiary / hints / STEP label |
| `pos` (long/ROI) | `~#34D27A` mint green | "1 LONG", "0.00% ROI", "bought" |
| `neg` (short/danger) | `~#EF5340` | Emergency stop, Revoke, "sold" |
| `venue-binance` | `#F0B90B` | Binance "B" tile |
| `status-amber` | `#E0A54A` | "Configured" status dot |

**CRITICAL palette reconciliation:** the *marketing video* (V4/V5) uses a
strict white/orange/black rule with **no green/red**. The *real product*
deliberately uses **green = long/positive/bought** and **red =
short/danger/sell/emergency** as financial semantics. A UI-accurate video
**must** include these greens/reds where the product does, or the trading
data reads wrong. This is a real divergence from the brand-film palette —
call it out to the user; do not silently strip green/red from UI recreations.

### 2.2 Typography

- Product font (established earlier): **Plus Jakarta Sans**. Onboarding
  display headings ("Name your agent", "Choose the risk level") render in a
  rounded, friendly weight — consistent with Jakarta's display cut.
- Heading (modal): ~44–52px, bold (700–800), centered.
- `STEP X OF 8`: ~13px, uppercase, letter-spaced ~0.18em, `text-3`, above heading.
- Section titles (Dashboard/Feed cards): ~20–24px, 700.
- Body: ~15–17px, 400–500; secondary in `text-2`.
- Numbers (P&L, prices, stats): tabular figures, bold, large (Balance
  ~40–48px). Big money uses a two-tone weight ("100,000**.00**" — decimals dimmer).

### 2.3 Shape, elevation, spacing

- Radii: **pills fully rounded** (999px) — every toggle, filter, CTA;
  cards ~16–24px; modals ~20px; inputs ~14–16px (Name input is near-pill).
- Shadows: soft, large, low-opacity drops on cards; onboarding CTAs get a
  subtle orange glow when primary.
- Frosted glass: onboarding cards + some panels use translucent dark fill +
  blur over the ray background.
- Generous vertical rhythm; onboarding is centered in a full-bleed modal
  with huge negative space (the light rays fill it).

### 2.4 App chrome (persistent)

- **Left nav rail** (icon buttons, rounded-square, active = white fill):
  top = Ecelon "M" mark; then Dashboard (grid), Agents (briefcase/lock),
  Consulting/Chat (speech bubble), Feed (document/list), Messages (chat),
  Theme (sun); a large **orange "+"** (create); bottom = user avatar "DF"
  with a green online dot.
- **Top bar:** left = page-name pill (Dashboard / Agents / Feed); right =
  search, theme (sun), notifications (bell) — all rounded-square icon buttons.
- **Agent sub-nav** (left panel inside an agent): Overview · Agent Logic ·
  Trading Graph · Activity · Settings, with footnote "Paper trading. Ecelon
  never holds your funds." Active item = white fill.
- **Agent action buttons** (top right of agent): "Suspend agent" (neutral),
  "Emergency stop" (red).

---

## 3. SCREEN INVENTORY — SORTED BY THE AGENT LIFECYCLE

### A · ENTRY — Dashboard (pre-creation)

**Dashboard.** Top tabs `Today`(active) / This Week / This Month; right
`All agents`. Orange **hero band** (gradient): "Hi Dren, here's what your
agents did this month. / Your desk is carrying unrealized P&L of / **+0.00
USDT** +0.00% return, 1 agent." Three stat cards: **Balance** 100,000.00
USDT (Cash 100,000.00 USDT, 0 positions); **P&L today** 0.00 USDT (Since Jul
22, 00:00 UTC); **Signals today** 167 new. Empty states: "No holdings yet"
(+ **Create an agent** orange button), "Capital focus / No open positions".
"Live agents" strip below.
Role in video: the calm "before" — establishes the desk, sets up the CTA.

### B · CREATION WIZARD — the hero flow (8 steps, on the light-ray modal)

All steps share the **onboarding modal shell**: full-bleed animated orange
**god-ray** background on black, close **X** top-right, centered column,
`STEP n OF 8` label, big heading, content, `Back` + primary button.

- **Intro** — "Hi Dren, let's create your agent." (heading only, no controls;
  the invitation beat.)
- **Step 1 — "Choose what kind of agent you want"** — two selection cards:
  **Autonomous** (selected: orange border + glow) "Trades a strategy you
  write, inside hard limits. Paper funds, live prices." vs **Consulting** "A
  specialist that researches and advises in chat. It never places orders."
- **Step 2 — "Name your agent"** — single large input ("Spongebob Agent"),
  Back / **Continue**.
- **Step 3 — "Write the strategy"** — symbol search input ("Search a symbol,
  like BTCUSDT") + strategy textarea ("Buy when RSI drops below 30 and
  volume spikes. Take profit at 4%."), **Guided / Expert** pill toggle
  (Expert active = white), Back / Continue.
- **Step 4 — "Choose the risk level"** — pill group **Conservative /
  Balanced / Aggressive / Maximum** (Maximum active = white). Helper: "Sets
  the minimum confidence (0–100) the agent needs before executing a signal
  your strategy generates. It never changes your strategy's rules,
  direction, or size." Back / Continue.
- **Step 5 — "Mode and capital"** — capital input (100000) + "Your wallet
  holds 100,000 USDT.", **Auto / Manual** toggle (Auto active = white), two
  sub-fields (10000 / 5000), Back / Continue.
- **Step 6 — "Review your agent"** — summary card: Name Spongebob Agent ·
  Ticker BTCUSDT · Risk maximum · Capital 100000 USDT · Approvals auto. Back
  / **Next**.
- **Step 7 — "Hmm, I have some questions."** — the agent asks clarifying
  questions back: "The strategy requires a technical entry condition… specify
  which indicator…" → answer field "When RSI drops below 20." and "The exit
  condition 'sell at 63000' is a fixed price level… confirm…" → "No, just
  sell at 63,000." Back / Continue. (This is a standout UX beat — the system
  reasons with you.)
- **Step 8 — "Ready to deploy Spongebob Agent?"** — final review card +
  compiled-strategy note ("Go long (btc_long, 5m candles) when RSI(14)
  crosses below 20. Note: 2 part(s)… kept as context, not auto-enforced…") +
  a circular **"Hold to deploy"** press-and-hold button (ring fills on
  hold), Back.

Flow subtlety to preserve: order is Review (6) → Questions (7) → Deploy (8).

### C · AGENT DETAIL — post-deploy management

- **Agent Logic (node graph).** A left-to-right node editor: **Strategy**
  ("Buy btc when RSI is below 20 and sell when RSI goes to 0"; symbol
  BTCUSDT; style mean reversion; compile guided) → **Signal Engine** ("Go
  long (rsi_mean_reversion_long, 5m candles) when RSI(14) is below 20. Close
  when RSI(14) is above 50."; spec nova; version latest) → **Risk Engine**
  (position cap 50% · concentration 50% · max positions 8 · risk/trade 10% ·
  daily loss stop 2500 USDT · drawdown kill 20% · position cap($) 10000 ·
  daily loss($) 10000; ports: intent, kill switch → ORDERS) → **Execution**
  (venue Binance, Crypto · mode Paper · approvals Auto · capital 10000 USDT;
  orders → EQUITY). Nodes are rounded cards with a header status dot + title,
  labeled ports, and `‹ value ›` stepper rows. Connectors are **orange
  bezier wires** with `+` insert buttons mid-wire. Bottom legend chips:
  Strategy (Your words) · Signals (Compiled rules) · Risk (L3 gates) ·
  Execution (Venue & mode). Zoom controls (+/−/fit) bottom-right.
- **Trading Graph.** Header "BTCUSDT $65,771.99 −0.73%". Timeframe pills
  1H / **4H** / 12H / 1D + Fit. Indicator pills **SMA 20** / EMA 9 / EMA 21 /
  VWAP / Bands / RSI / MACD. Candlestick chart (green up / red down candles)
  with an **orange SMA line**, volume bars beneath, price axis (65,700–66,600),
  time axis (04:00–07:30), green last-price tag (65,772). Legend "▲ bought /
  ▼ sold". Footnote "1m candles, zoom with wheel or pinch…". **Track record**
  section (Paper badge): "forward paper-traded results — realized, including
  losing trades…". Two stat tiles **Max drawdown 0%** / **Current drawdown
  0%**. "Closed trades / All-time".
- **Activity.** Filter tabs **All** / Executed / Skipped. Decision log rows
  alternating **FLAG** ("Watched the market. Entry conditions not met yet /
  **Why?**") and **INFO** ("Checked the market for a long entry"), each with
  a `5h` timestamp. Right: **Insights** panel, empty state "No decisions in
  the last 7 days…".
- Overview & Settings: menu items (full views not captured — treat as
  standard detail/settings screens; not needed for the video's spine).

### D · CONSULTING AGENT — chat

**Consulting chat (Macro research).** Breadcrumb "Agents / Macro research /
Consulting chat". Header "Macro research • Consulting agent, Configured,
Macro research" (amber status dot, circular agent avatar). Conversation:
**user bubble** (orange, right-aligned) "Hey, Macro Researcher, tell me the
economic calendar for today?" 9:53 AM; **agent bubble** (dark, left-aligned)
a structured economic-calendar answer (CPI m/m CAD, Median/Trimmed CPI y/y,
CPI q/q NZD…). Disclaimer strip "Responses are AI-generated for general
educational… does not place trades… All trading involves risk". Composer
"Message Macro research…" + orange send button.

### E · INFRASTRUCTURE — Connections

**Connections.** "Agents read data from and trade through your own venues.
Ecelon never holds your funds. Beta connections are paper-scope only." Right
label "Paper venues". **LINKED:** Binance (yellow B tile) "read + trade
scope" + red **Revoke**. **AVAILABLE:** "Every supported venue is already
linked. Read scope is granted per venue. Revoke anytime."

### F · SOCIAL — Feed

**Feed.** Composer "Question of the day" with a **Poll builder**: prompt "On
$SOL would you rather be…", options `1 Short` / `2 Long`, "Add option (2/4)",
"Min 2 options, max 4, votes are anonymous". Toolbar icons (image / trending
/ $ / poll-active-orange), char count 261, **Post** (orange). Feed tabs **For
You** / Longing. Post card: avatar "DF", "Dren Fazliu" + green **0.00% ROI**
badge, "@drenfazliu, Id", body "live. 20th of July 2026.", actions ♥ 1 · 💬 1
· green "**↗ 1 LONG**". Right sidebar **"People you LONG"** — Dijar Hashani
@dijarhashani. Footnote "Posts are moderated for manipulation. Past
performance ≠ future results." (Note the "LONG" = social endorse verb, green.)

---

## 4. REUSABLE COMPONENT LIBRARY

1. **NavRail** — vertical icon column, active = white-fill rounded square;
   orange "+"; avatar w/ status dot.
2. **TopBar** — page pill + search/theme/bell cluster.
3. **AgentSubNav** — Overview/Agent Logic/Trading Graph/Activity/Settings +
   funds footnote + Suspend/Emergency-stop.
4. **OnboardingModal** — ray bg, X, STEP label, heading, slot, Back/primary.
5. **PillToggle** — segmented group; selected = white fill/dark text;
   unselected = translucent/gray. (risk, Guided/Expert, Auto/Manual,
   timeframes, indicators, feed tabs.)
6. **SelectCard** — big choice card; selected = orange border + glow.
7. **Input / Textarea / SymbolSearch** — rounded translucent fields.
8. **SummaryCard** — key/value rows, right-aligned white values.
9. **HoldToDeploy** — circular press-hold w/ progress ring.
10. **NodeGraph** — Node (header dot+title, ports, `‹value›` rows) + bezier
    Wire + insert `+` + zoom controls + legend chips.
11. **CandleChart** — candles (green/red) + SMA overlay + volume + axes +
    price tag + tf/indicator pills.
12. **StatCard** — label / big number / sublabel.
13. **HeroBand** — orange-gradient greeting + big P&L.
14. **EmptyState** — circle-minus icon / title / desc / optional CTA.
15. **ActivityRow** — INFO|FLAG badge / text / Why? / timestamp; filter tabs.
16. **ChatThread** — user(orange,right) & agent(dark,left) bubbles + composer.
17. **VenueRow** — brand tile / name / scope / Revoke; LINKED/AVAILABLE labels.
18. **PollBuilder** + **FeedPost** + **PeopleYouLong** sidebar.
19. **Primary/Secondary Button** — orange-fill CTA vs neutral Back.

---

## 5. MOTION & INTERACTION LANGUAGE (for the video)

- **God-ray background** (signature): slow volumetric orange rays radiating
  from top-center, gentle drift/shimmer + subtle bloom breathing. This is
  the emotional through-line of the whole creation flow — recreate
  procedurally (radial streaks, mild noise, slow rotation/scale).
- **Step transitions:** content column cross-fades + small vertical slide
  per step; STEP label ticks 1→8; ray bg persists (continuity).
- **Pill selection:** the white fill slides/springs onto the chosen segment;
  label color inverts. **SelectCard:** orange border draws + inner glow blooms.
- **HoldToDeploy:** ring sweeps 0→360° over a held press; on complete, a
  bloom/flash + transition out to the deployed agent.
- **NodeGraph:** wires can pulse a signal dot Strategy→Signal→Risk→Execution;
  nodes settle in with a stagger; param values can tick.
- **CandleChart:** candles build left→right; SMA line draws on; price tag
  counts; volume bars rise.
- **Numbers everywhere:** count-up with a soft settle (Balance, P&L, ROI,
  Signals 167, win rates).
- **Nav/entry:** active nav item fill transitions; cards rise/scale-in with
  a springy iOS-style overshoot + slight blur-in; stagger lists.
- **Chat:** bubbles rise in; typing indicator → answer reveal.
- **Feed:** poll options pop in; LONG count ticks; Post button pulse.
- Target feel: **iOS-clean** — soft springs, frosted glass, hairline
  strokes, generous space, nothing abrupt; every transition motivated.

---

## 6. VIDEO NARRATIVE ARC (recommended spine)

1. **Cold open — Dashboard** (the calm desk, empty, "Create an agent").
2. **The invitation** — light rays ignite, "Hi Dren, let's create your agent."
3. **The wizard** — fast, satisfying march through Steps 1→8, each beat
   snapping on rhythm; the "Hmm, I have some questions" beat as a
   personality moment; climax on **Hold to deploy** (ring fills → bloom).
4. **It's alive** — cut to Agent Logic (wires pulse), Trading Graph (candles
   build, chart moves), Activity (decisions stream in).
5. **The ecosystem** — Consulting chat (ask, get an answer), Feed (poll +
   LONG social proof), Connections (Binance linked — the trust/"we never hold
   your funds" beat).
6. **Close** — back to Dashboard now populated / brand lockup + CTA.

---

## 7. REMOTION BUILD PLAN

- One composition per screen as a pure `useCurrentFrame()` component; a
  master timeline sequences them with transitions.
- Reuse existing project assets: the **FacetMark** "M" logo and Plus Jakarta
  Sans are already in `src/v4/`. The god-ray background = new procedural
  component. Venue "B" tile, avatars = simple shapes/monograms.
- Build the **component library (§4) first**, then compose screens, then the
  master timeline + motion (§5), then audio/VO sync, then export (CRF ~16,
  the anti-banding settings already in `remotion.config.ts`).
- Scope options: (a) **wizard-only hero cut** (~20–30s, Steps 1→8 + deploy),
  (b) **full product tour** (~60–75s, the whole §6 arc). Recommend building
  the component lib once and rendering both.

---

## 8. READINESS ASSESSMENT

**Have (enough to build faithfully):** every screen's exact layout + copy;
the full 8-step flow and its ordering; the complete component inventory; the
color *language* + semantic rules; the chrome/IA; the motion language; a
narrative spine; existing logo + font assets.

**Assumptions / to lock before final render (won't block a first build):**
1. Exact hex values — estimated from inline images; eyedrop originals to lock.
2. Exact fonts — assuming Plus Jakarta Sans (display headings look like it).
3. Real motion timings — designed here, will tune against a soundtrack.
4. Screens shown only as menu items (Overview, Settings) — omit or stub.
5. Green/red semantic palette **must** be allowed for UI accuracy (§2.1) —
   this diverges from the brand-film's strict palette; needs user's OK.
6. Aspect/length/target platform for the video — not yet specified.

**Verdict placeholder** (finalized after the completeness audit in §9).

---

# PART II — AUDIT HARDENING (resolves the completeness pass)

A 6-reviewer adversarial audit ran against Part I. The reviewers could not
see the source images (only this doc), so their "no visual source" blocker
applies to a *downstream* builder, not to the analysis itself — but their
structural findings are valid and resolved below. Values here supersede the
looser estimates in Part I.

## 9. CANONICAL DEMO DATA (the most important fix)

The screenshots capture the user's **live test session**, not clean demo
content, and the data is self-contradictory — a launch video must NOT
reproduce it verbatim:

- Agent is named **"Spongebob Agent"** in the wizard but the detail
  screens (Agent Logic / Graph / Activity) show a different agent, **"Nova."**
- Strategy copy conflicts across screens: "Buy btc when RSI is below 20 and
  sell when RSI goes to 0" (nonsensical exit) vs "RSI below 30, take profit
  4%" vs "RSI(14) below 20, close above 50."
- Numbers disagree: capital **100,000 vs 10,000 USDT**; RSI threshold
  **30 vs 20**; candle timeframe **1m vs 4H vs 5m**.
- The one **approved** demo the client supplied (MNQ futures, human approval
  card, audit-log line) does not appear at all.

**Resolution — pick ONE canonical agent and use it on every screen:**

**Option A — clean crypto agent "Nova" (matches the captured BTCUSDT chart):**
- Name: Nova · Ticker: BTCUSDT · Type: Autonomous · Venue: Binance (Crypto)
- Strategy (one wording everywhere): *"Go long when RSI(14) drops below 30
  on 5m candles. Close when RSI(14) crosses above 50."*
- Risk: Balanced · Capital: 10,000 USDT · Approvals: Manual
- Chart: the existing BTCUSDT 4H series (label the timeframe pill 4H and the
  footnote "5m candles" consistently, or switch footnote to match).

**Option B — the approved MNQ futures demo (most product-accurate, best
trust story — adds the approval card + audit log):**
- Name: e.g. "Opening Range" · Instrument: Micro E-mini Nasdaq-100 (**MNQ**,
  CME) · Type: Autonomous · Session: New York
- Strategy: *"Mark the first-15-min opening range. Go long only when price
  closes above the range high, retests without closing back below, holds
  above VWAP, and volume beats its 20-bar average."*
- Risk per trade 0.25% · Max daily loss 0.50% · Target 2R · Approvals: **Manual**
- Approval card (verbatim, real): "MNQ Long · 4 contracts / Entry 21,847.00 /
  Stop 21,832.00 / Target 21,877.00 / Max loss $120 — 0.24% / Potential
  profit $240 — 2.0R" + checklist "Opening-range retest ✓ · Above VWAP ✓ ·
  Volume confirmed ✓ · News window clear ✓ · Risk limits passed ✓" +
  "[Approve once] [Edit limits] [Reject]"
- Audit log: "10:02:21 ET — Paper trade approved"

**Recommendation:** Option B for the deploy→approval→audit beat (it's the
approved content and tells the safety story), OR Option A if the video should
mirror the captured crypto chart. Either way, reconcile to a single dataset;
never show "Spongebob," the "RSI to 0" line, or mismatched numbers.

**Product positioning corrections (from the Q&A doc):** Ecelon *does* place
live orders via the user's CEX/DEX/broker; "paper" is a **beta connection
scope**, not a permanent limit. "Autonomous" = executes *your* strategy with
the funds *you* assign, inside *your* limits. Markets = **Crypto, Stocks,
Prediction Markets, Futures** (not crypto-only) — the approved demo is a
futures trade, so don't imply crypto-only.

## 10. DESIGN TOKENS — locked defaults (single values)

Collapse every Part-I range to one buildable value (visual estimates from
the images; re-sample if pixel-exact matching is required):

- `bg` **#0A0A0B** (unify). `surface` **#161619**. `surface-2`
  **rgba(255,255,255,0.04)**. `hairline` **rgba(255,255,255,0.10)**.
- Oranges by role: **SMA line / node wires / hold ring / active "+" = #FF6A2C**;
  **primary CTA fill (Post/Continue/Next/send) = #FF5A1F**; **links/"Why?"/accents
  = #FF7A3C**; gradient deep stop **#F0531E**.
- `white` text **#F5F5F7**; **pure #FFFFFF only** for selected-pill fill and
  headings on the ray bg. Dimmed decimals = value at **opacity 0.5**.
- Semantic: **candle-up / long / ROI+ / "bought" = #34D27A**; **candle-down /
  short / danger / "sold" / Emergency / Revoke = #EF5340**. venue-Binance
  **#F0B90B**. status-amber (Configured) **#E0A54A**.
- Type sizes (px, Plus Jakarta Sans): modal heading **46/700**; STEP label
  **13/600 upper 0.18em**; section title **22/700**; body **16/450**;
  secondary **15/450 @text-2**; big number **44/800 tabular**; stat label
  **13/600 upper**.
- Radii: pills **999**; cards **20**; modals **20**; inputs **16**; nodes **18**.
- **Frosted glass:** fill rgba(22,22,26,0.72) + backdrop-blur(28px).

## 11. ELEVATION / GLOW TOKENS

- `elev-card`: `0 20px 60px rgba(0,0,0,0.45)`
- `elev-float` (modals, floating panels): `0 40px 110px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)`
- `glow-cta` (primary buttons): `0 0 40px rgba(255,90,31,0.45)`
- `glow-select` (SelectCard chosen): `0 0 30px rgba(255,90,31,0.30)` + `1.5px solid #FF6A2C` border
- `glow-ring` (Hold to deploy): stroke `#FF6A2C`, `drop-shadow(0 0 16px rgba(255,106,44,0.6))`
- `glow-live` (status dots): `0 0 10px` of the dot color.

## 12. SPACING & PER-SCREEN GEOMETRY (1920×1080 desktop, estimates)

- Base spacing scale (px): **4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 56 · 72**.
- **NavRail** width **72**; icon buttons **40×40**, radius 12, gap 20; rail
  pad-top 24. **TopBar** height **72**, side pad 32.
- **Onboarding modal:** centered column max-width **680**; heading→content
  gap 40; content→buttons gap 32; Back/primary height **48**, gap 14; select
  cards **~300×150**, gap 24; STEP label 24 above heading.
- **Dashboard:** content max-width **1440**, page pad 40; hero band full-width,
  height **~190**, radius 24, pad 40; stat grid 3× equal, gap 24, card pad 28,
  height ~150; empty-state blocks radius 20.
- **Agent detail:** left sub-nav panel **~300** wide; content fills rest.
  **NodeGraph** nodes **~300–320** wide, header 44, param row 40, `‹value›`
  steppers right-aligned; bezier wires with mid `+` (28×28); zoom cluster
  bottom-right, buttons 36. **CandleChart** ~1400×560 incl. axes; pills row 44.
- **Chat:** thread max-width **~1200**; bubble max-width **~62%**; composer
  height 56, send 44. **Feed:** center column **760**, right sidebar **320**,
  gap 32; post card radius 20, pad 24.

## 13. GOD-RAY BACKGROUND — procedural recipe (buildable)

Signature onboarding bg. Pure function of frame:
- Single origin at **(50%, −6%)** (just above top-center).
- **56 rays** fanning **downward across ~170°**; per-ray angle evenly spaced
  + deterministic jitter `hash(i)`.
- Each ray = a thin gradient wedge from origin to below the bottom edge;
  width **1–4px** at origin (widen ~1.15× toward the foot), color
  **#C9803C → transparent**, per-ray opacity **0.05–0.22** by `hash(i)`.
- Blend **screen/additive** over `#0A0A0A`.
- Motion: whole field slow-rotates **±2°** over **~600f**; **breathes** scale
  **1.0↔1.035** over **~200f**; a soft radial **bloom** at origin
  (`blur(120px)` orange ellipse, opacity ~0.18 breathing).
- Fine animated **grain** overlay on top (existing `Grain` component, ~0.04)
  to kill banding. No `Math.random()` — hash by ray index + frame.

## 14. CHROME MAP + MISSING COMPONENTS

**Active-nav / breadcrumb / page-pill per screen:**
| Screen | Nav active | Page pill | Breadcrumb |
|---|---|---|---|
| Dashboard | Dashboard (grid) | Dashboard | — |
| Wizard (modal) | — (overlay) | — | STEP n OF 8 |
| Agent Logic / Graph / Activity | Agents (briefcase) | Agents | Agent sub-nav item active |
| Consulting chat | Agents (briefcase) | Agents | Agents / Macro research / Consulting chat |
| Connections | Settings/Agents (settings home) | — | — |
| Feed | Feed (list) | Feed | — |

Nav reconciliation: rail = Dashboard · Agents · Consulting/Chat · Feed ·
Messages · Theme · "+" · avatar. Treat **Messages** as present-but-unused
(no screen), **Connections** as living under Settings, **Consulting chat**
highlights the **Agents** item (it's an agent). **Theme/sun toggle is
decorative** — dark is the only built mode; never exercise it on screen.

**Components to add to §4 before build:**
- **LiveAgentsTile** (dashboard bottom + populated close): agent avatar,
  name, status dot, mini P&L/return; empty ("No holdings yet" + CTA) and
  populated states.
- **Badge / StatusDot** (reused ≥5×): pill badge (INFO/FLAG/Paper/BETA/ROI) —
  shape 999, size 20–22h, fill-vs-outline + color per semantic; StatusDot =
  8–11px circle + `glow-live`.
- **Step-7 QuestionBlock**: stacked {question paragraph (text-2) → answer
  field (filled)} pairs, centered column, same modal shell.
- **PopulatedDashboard** (close shot): same layout as cold-open but hero P&L
  now positive (count-up), a holding row present, "1 agent live." Defines the
  before→after payoff.
- **ApprovalCard** (only if Option B / Manual approvals): the MNQ card in §9
  with the checklist and Approve/Edit/Reject — a strong trust beat.

## 15. ANIMATED-COMPONENT STATE PAIRS (from→to for the video)

- SelectCard: unselected(dark, hairline) → selected(orange border + `glow-select`).
- PillToggle: resting(translucent/gray) → selected(white fill/#0A0A0B text), fill springs across.
- Button: idle → pressed(scale .97) ; primary carries `glow-cta`.
- Input/Textarea: placeholder → filled (caret + text type-on).
- SymbolSearch: empty → "BTCUSDT" chip resolved.
- HoldToDeploy: idle → holding(ring 0→360°) → complete(bloom/flash) → deployed.
- CountUp targets: use real non-zero numbers from the chosen §9 dataset
  (drop count-ups whose target is 0.00 — animate a value that actually moves).

## 16. TIMELINE (fills once scope + aspect are chosen)

30fps, 1920×1080 landscape assumed (matches the existing project). Two scope
options drive the frame budget:
- **Wizard hero cut** ~24s (720f): Dashboard 3s → rays/intro 2s → Steps 1–8
  ~1.6s each → Hold-to-deploy 3s.
- **Full tour** ~70s (2100f): + Agent Logic, Trading Graph, Activity,
  Consulting, Feed, Connections, populated close.
Every §5 cue gets start-frame + duration + easing at build time, tuned to the
chosen soundtrack. Spring default: iOS-clean `{ damping: 13, stiffness: 280,
mass: 0.6 }`; count-ups 24–30f cubic-out; step cross-fade 8f + 24px slide;
hold sweep 45f ease-in-out; candle build 2f/candle stagger; node stagger 4f.

## 17. READINESS — HONEST VERDICT

**Understanding: complete.** Every screen, the full 8-step flow and its
ordering, the component set, the color/motion language, and the chrome are
mapped. I can see all 16 screens and Parts I–II encode them.

**Buildable now:** a strong, on-brand, faithful-*looking* UI video, using the
locked tokens (§10–13), the chrome map (§14), and a reconciled canonical
dataset (§9).

**Decisions required before I build (only the user can make these):**
1. **Scope** — wizard hero cut vs full product tour.
2. **Aspect / length / platform** — landscape 16:9 (safe) or a vertical/social reflow.
3. **Green/red semantic colors** — needed for UI accuracy; breaks the strict
   brand-film palette. Approve or forbid.
4. **Canonical demo** — Option A (clean BTCUSDT "Nova") or Option B (approved
   MNQ futures + approval card + audit log). No "Spongebob."
5. **Audio** — reuse existing tracks/SFX or new; VO script or music-only.
6. **Pixel-exactness** — my hexes/sizes are calibrated estimates from pasted
   images (not sampled). If Codex builds it, or you want pixel-perfect,
   re-supply the screenshots as **files** so values can be locked.

**Verdict:** Ready to build an excellent UI video the moment those six are
answered — held per instruction until the next prompt.
