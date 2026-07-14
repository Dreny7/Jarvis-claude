# Ecelon Launch Video — Subtitle Plan

One story, two tones. Act I is narrated in short, spoken-style captions —
the crash, told the way you'd tell it to someone who lived through it. Act
II drops captions almost entirely — it's kinetic typography, not narration,
and the whole point of "fast, clean, subtle" is that nothing competes with
the product on screen.

Timecodes reference `src/v4/timeline.ts` (30fps). Given in both frame and
second form so this maps directly whether Codex rebuilds the timeline from
scratch or reuses the existing frame map. `{orange:word}` marks the accent
word/phrase to highlight in brand orange, matching the existing `Subtitle`
component's `accentWord` convention.

---

## ACT I — THE COLLAPSE (0:00 – 0:33)

Nine beats. Each one is a single held breath — two short lines, never
more, timed to land *after* the visual, not alongside it (subtitle enters
a few frames into the cut, so the image registers first). The story has
one throughline: **they saw it coming, you paid for it.**

| Beat | Time | On screen | Subtitle (short, 2 lines max) |
|---|---|---|---|
| c1 | 0:00–0:02.3 | "2008." | *It started quietly.* |
| c2 | 0:02.3–0:06.0 | Home-price rollover chart | *Home prices stopped climbing.*<br>*The banks kept betting anyway.* |
| c3 | 0:06.0–0:09.7 | DOW −777.68, crash day | *Then, in one afternoon —*<br>*{orange:$1.2 trillion} vanished by lunch.* |
| c4 | 0:09.7–0:13.3 | Ticker board, institutions halted | *Names people trusted with everything.*<br>*Halted. Erased. {orange:Gone.}* |
| c5 | 0:13.3–0:17.0 | Wire headlines (Lehman/AIG/bailout) | *The banks got saved.*<br>*The people {orange:didn't.}* |
| c6 | 0:17.0–0:20.3 | Funds vs. market diverge | *Their algorithms saw it coming.*<br>*They made {orange:billions} from the fall.* |
| c7 | 0:20.3–0:25.3 | Foreclosure field (held longest) | *Every trade they won —*<br>*was somebody's {orange:front door.}* |
| c8 | 0:25.3–0:30.0 | $19.2T / 8.8M jobs | *{orange:$19.2 trillion} in savings. Gone.*<br>*8.8 million jobs. Gone.* |
| c9 | 0:30.0–0:33.0 | Held black, thesis | *For decades, the edge*<br>*belonged to {orange:them.}* |

**Pivot (0:33.0, on the detonation):** *{orange:Not anymore.}*
— this is the one line that survives as on-screen type, not a subtitle;
everything before it was their story, this is the turn.

### Writing rules for this section
- **Max ~5 words a line.** If a line doesn't fit in one breath, it's cut,
  not shrunk to fit — say less, not smaller.
- **No adjectives doing the emotional work.** "Erased," "gone," "didn't" —
  verbs and blunt facts land harder than "devastating" or "tragic" ever
  will.
- **Every number is real and sourced** (DOW −777.68 on Sept 29 2008, the
  $700B TARP bailout, $19.2T in household wealth, 8.8M jobs — Fed/BLS
  figures already used in the current build). Don't invent statistics to
  make a line hit harder; the real ones already do.
- **c7 is the fulcrum.** It's the only beat that's pure human cost with no
  chart behind it — hold it longest, cut nothing from it.

---

## ACT II — ECELON (0:33 – end)

**Recommendation: no subtitle track here at all.** Act II is told in
kinetic on-screen type, not narration — adding a caption layer under
already-animating headlines is visual noise, and it's the fastest way to
undercut "clean and subtle." The existing on-screen copy already carries
the whole beat; treat it as the script, not as something to caption:

| Beat | Time | On-screen line (already scripted, kinetic type — not a subtitle) |
|---|---|---|
| Reveal | 0:35.2–0:37.4 | *ecelon* — "The AI-Agent Operating System for Modern Investors" |
| Built | 0:37.4–0:39.5 | "We built the algorithm for {orange:everyone} else." |
| Punch | 0:39.5–0:41.6 | "Type it. Test it. {orange:Trade it.}" |
| Phone | 0:41.6–0:50.9 | 01 (@44.1s) "Type your strategy." · 02 (@46.2s) "Agents backtest it." · 03 (@48.2s) "They execute. Live." |
| Composer | 0:50.9–0:55.1 | (UI only — no caption; the product speaks for itself) |
| Agent desk | 0:55.1–0:59.2 | "A {orange:desk} of specialists." |
| Trust | 0:59.2–0:62.9 | "Their algorithms answer to no one. {orange:Yours} answer to you." |
| Proof | 0:62.9–0:65.5 | "71%" / "TOP AGENT WIN RATE" |
| Markets | 0:65.5–0:69.6 | "Every market. {orange:One} direct link." |
| Outro | 0:69.6–0:79.7 | "They had the algorithms. {orange:Now you do.}" / "Get started" |

If a narrated VO or accessibility caption track is added to Act II later,
mirror this table verbatim rather than writing new copy — it's already
tuned to the beat and the brand voice.

---

## If you need this as SRT

The .srt format doesn't distinguish accent words, so drop the
`{orange:...}` markup and split each two-line beat into its own cue at the
timecodes above. Say the word if useful — Act I only; nothing in Act II
needs an SRT cue under this plan.
