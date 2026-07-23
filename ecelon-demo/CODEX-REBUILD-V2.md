# Ecelon Launch — Rebuild V2: Critique + Codex Prompt

Deep analysis of `ecelonlaunchrebuildmaster.mp4` (Codex's rebuild, 43s /
1080p30) against the new direction, then a complete prescriptive Codex prompt.

---

## What's working — KEEP
- The **problem-led structure** (missed 3AM trade → black-box/custody fear →
  brand → build → proof → payoff → CTA). The bones are right; don't restructure.
- **No "Nova" as a brand.** Good — keep the agent as the user's own instance.
- The **custody shield** beat and the **node-graph** beat are strong ideas.
- Orange/white/dark direction is roughly right — but not executed cleanly (see below).

---

## Deep critique — weaknesses & what doesn't fit

1. **It's a slideshow, not a launch.** Elements *fade/rise* in place; nothing
   **flies in**, nothing has velocity. No whip-pans, no screen-shifts, no
   overshoot. It reads static and slow — the #1 problem.
2. **The background is brown, not black.** Every god-ray scene (brand, CTA) and
   most product scenes carry a heavy **warm orange/brown radial wash**. It muddies
   the frame and fights the "pure black + sharp orange" look. Backgrounds must be
   **#000000**.
3. **Grey is everywhere.** Down-candles are grey; problem cards, wizard panels,
   review card, activity rows, and secondary text are all **grey**. This is the
   opposite of the requested black / white / small-orange system.
4. **"Paper trading" framing is wrong for this launch.** The video repeatedly
   says *"Now it trades live prices — in paper," "Ten thousand in paper. Your
   rules," "Paper capital," "PAPER" badges.* This launch is for the **LIVE**
   Ecelon — real orders on the user's real exchange. All "paper" language must go.
5. **The product isn't shown as itself.** Screens are rendered **small and wide**
   with tiny, unreadable labels. There's no **zoom-in feature explainer** — the
   thing that makes a viewer go "oh, THAT's what it does." Product beats should
   punch **into** each real feature, fast, readable.
6. **The hook states the problem but never shows the fix.** It lingers on pain
   (asleep / black box / custody) then jumps to a brand card. The hook must be
   **problem → and here's how Ecelon fixes it**, fast, in the first ~8s.
7. **No narration.** The track is music only. The new direction wants a **real,
   warm middle-aged woman VO** (via the Codex TTS API) carrying the story.
8. **Jumpy numbers.** Dashboard flips +1,107 → +1,284; realized capital 8,308 →
   11,284; signals 73 → 167. Count-ups must settle to **one canonical value**.
9. **iOS polish is missing.** Corners, spacing, and type are inconsistent; panels
   look like generic dark cards, not the crisp, specific, frosted-glass iOS feel.

---

## The 10 required changes (how to execute)

1. **Components FLY in — strong, kinetic motion.** Every card/panel/stat enters
   from off-screen or with a big spring overshoot: `translateY(80px)`/`translateX(±120px)`
   → 0 on a punchy spring (damping 11, stiffness 320), 60–90ms stagger; stat
   numbers **slam** in (scale 1.4→1.0 + settle); rows cascade fast. Between scenes
   use **screen-shifts / whip-pans** (fast directional slide + 2–3px motion blur),
   not fades.
2. **Background pure black `#000000`.** Delete the warm radial washes. If you keep
   god-rays for the brand/CTA, make them **thin, sharp orange rays on pure black,**
   low-opacity, tight — no brown bloom. Product scenes: solid black, no vignette.
3. **This is LIVE, not paper.** Remove every "paper" reference. Reframe: agents
   place **real orders on your own exchange**. Copy: "Now it trades **live** — real
   orders, real markets." Capital: "Fund it — your capital, your rules." Keep the
   custody truth ("Ecelon never holds your funds — it trades **through your own
   Binance/broker**"), which is the live-trust story. Kill all "PAPER" badges.
4. **Show the product as itself — zoomed feature explainers.** For dashboard,
   trading graph, activity, connections, node graph: don't show the whole screen
   small. **Punch-zoom into each real feature** (the P&L number, a stat card, the
   deploy ring, the shield, a single activity row) with a fast one-word label, then
   whip to the next. Fast, readable, specific — the UI is the hero.
5. **Avoid grey. Black / white / small orange only.** Backgrounds black; text
   white (use white at reduced **opacity**, never a grey hex); accents orange
   `#FF5A1F` used **sparingly** for the one thing that matters per frame. Down-candles
   = dim-white or thin orange outline (never grey); card fills = near-black
   `#0A0A0A` with a 1px orange/white hairline.
6. **Hook = problem + fix.** 0–3s the pain (missed trade while asleep), 3–5s the
   fear (black box / holds your money), **5–8s the fix stated plainly** ("Ecelon:
   agents that trade your rules, on your exchange — that you can see inside") →
   THEN the brand mark. Don't reveal the logo before the fix is stated.
7. **Crazy animations everywhere** — typing animations on every input, count-ups
   that slam and settle, the hold-to-deploy ring + bloom, a candle chart that
   builds fast, node-graph wires that draw + a pulse dot, screen-shift transitions,
   subtle shading/depth (soft inner shadows, crisp drop shadows) — but keep it iOS,
   never cheesy.
8. **Narration: warm middle-aged woman (Codex TTS API).** Generate the VO with a
   confident, warm, measured female voice (~45–55). Emotion/pacing instruction to
   the TTS: *"Warm, assured, unhurried; a trusted expert who's seen the markets.
   Slight lift on the benefit words; let the CTA breathe."* Duck the music ~-10dB
   under VO. Script below.
9. **One canonical dataset, count-ups settle cleanly.** Agent = the user's own
   ("BTC Reversal"), Ticker BTCUSDT, Risk Balanced, Capital 10,000 USDT (live),
   Approvals Manual. Dashboard: P&L **+1,284.60 USDT**, balance **11,284.60**,
   signals **167**, **1 agent live**. Never show two different values for one field.
10. **iOS, very specific & clean.** Plus Jakarta Sans / SF Pro; generous 8pt
    spacing; consistent 20–24px radii; subtle frosted-glass on floating panels;
    hairline strokes; crisp shadows; nothing sloppy. Reference: Apple product-page
    motion.

---

## Per-scene VO script (warm middle-aged woman)

| # | Scene | VO line |
|---|---|---|
| 1 | Problem (3AM chart) | "Your best trades happen while you're asleep." |
| 2 | Tension (black box / custody) | "Today's trading bots are black boxes — and they hold your money." |
| 3 | Fix + brand | "Ecelon is different. Agents that trade your rules, on your own exchange. Build intelligence — keep control." |
| 4 | Describe | "Just describe your strategy, in plain English." |
| 5 | Risk | "Set the guardrails it can't cross." |
| 6 | Capital | "Fund it. Your capital, your rules." |
| 7 | Clarify | "It even asks the questions you'd forget to." |
| 8 | Deploy | "Then deploy — and it goes live." |
| 9 | Trading graph | "Now it trades for real. Real orders, live markets." |
| 10 | Activity | "And it explains every decision — even when it does nothing." |
| 11 | Connections | "Your exchange. Your funds. Always. Ecelon never holds them." |
| 12 | Node graph | "See exactly how it thinks." |
| 13 | Feed | "Learn from a whole community of agents." |
| 14 | Dashboard | "This is your desk now." |
| 15 | CTA | "Ecelon. Build intelligence, keep control. Join the waitlist — at ecelon dot A I." |

---

## READY-TO-PASTE CODEX PROMPT

```
Revise the Ecelon launch video (the current 43s cut). The STRUCTURE and story order are correct — keep the problem-led arc (missed-trade hook → black-box/custody fear → brand → build-an-agent → proof → payoff → CTA). This is a MOTION + LOOK + FRAMING overhaul, not a restructure. Apply ALL of the following:

1. LIVE, NOT PAPER. This launches the LIVE Ecelon. Remove every "paper" reference and PAPER badge. Reframe: agents place REAL orders on the user's own exchange. "Now it trades live — real orders, real markets." "Fund it — your capital, your rules." Keep the custody line ("Ecelon never holds your funds — it trades through your own Binance/broker"), which is the live-trust story.

2. BACKGROUND FULLY BLACK (#000000). Delete every warm orange/brown radial wash and vignette. God-rays (brand + CTA only) become thin, sharp, low-opacity orange rays on pure black — no brown bloom. All product scenes: solid #000000.

3. KILL GREY. Palette is BLACK / WHITE / small orange accent (#FF5A1F) ONLY. Secondary text = white at reduced opacity, never a grey hex. Down-candles = dim-white or thin orange outline (not grey). Card fills = #0A0A0A with a 1px white/orange hairline. Use orange sparingly — one accent per frame.

4. COMPONENTS FLY IN — strong animation. Nothing fades in place. Cards/panels/stats enter from off-screen (translateX ±120 / translateY 80 → 0) on a punchy spring (damping 11, stiffness 320), 60–90ms stagger. Stat numbers SLAM in (scale 1.4→1.0). Rows cascade fast. Inputs use TYPING animations. Between scenes use whip-pan / screen-shift transitions (fast directional slide + slight motion blur), never cross-fades.

5. SHOW THE PRODUCT AS ITSELF — zoomed feature explainers. For dashboard, trading graph, activity, connections, node graph: do NOT show the whole screen small. Punch-ZOOM into each real feature (the P&L number, a stat card, the deploy ring, the custody shield, one activity row) with a fast one-word label, then whip to the next feature. Fast, readable, specific. The real UI is the hero — make it look exactly like the product.

6. HOOK = PROBLEM → FIX. 0–3s the pain (best trades happen while you're asleep), 3–5s the fear (black box that holds your money), 5–8s STATE THE FIX plainly ("Ecelon: agents that trade your rules, on your exchange — that you can see inside") BEFORE revealing the logo.

7. NARRATION. Add a voice-over with the Codex TTS API using a warm, confident, MIDDLE-AGED WOMAN voice (~45–55). TTS emotion/pacing instruction: "Warm, assured, unhurried; a trusted market expert; slight lift on benefit words; let the CTA breathe." Duck the music ~-10 dB under the VO. Master to -14 LUFS. Use this per-scene script: [paste the VO table above].

8. iOS-CLEAN, VERY SPECIFIC. Plus Jakarta Sans / SF Pro Display; generous 8pt spacing; consistent 20–24px radii; subtle frosted glass on floating panels; hairline strokes; crisp drop shadows + soft inner shadows for depth. Apple-product-page level polish. No sloppy edges.

9. ONE CANONICAL DATASET, count-ups settle cleanly (no field showing two values). Agent "BTC Reversal" (user's own, instance chrome only), BTCUSDT, Risk Balanced, Capital 10,000 USDT (live), Approvals Manual. Dashboard: P&L +1,284.60 USDT, balance 11,284.60, signals 167, 1 agent live.

10. CRAZY MOTION throughout but tasteful: typing on every field, count-ups that slam+settle, hold-to-deploy ring + bloom, fast candle build, node-graph wires drawing + pulse dot, screen-shift transitions, shading/depth. Keep it iOS-premium, never cheesy. 30fps, 1920x1080, ~43s, cut on the beat.

Deliverable: re-render the full cut. Confirm at the end: background is pure black everywhere, no grey hexes remain, no "paper" language remains, a female VO track is present and ducked under music, and every product beat zooms into a real feature.
```
