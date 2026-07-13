---
name: shot-recreation-workflow
description: >-
  Turn a reference video (a movie scene, ad, trailer, or competitor's launch
  video) into a legally clean shot list that recreates its look, energy, and
  structure using licensed stock, AI generation, and original Remotion work —
  without reusing the reference's actual copyrighted footage. Use whenever
  the user references another video's style/vibe/shots ("I want the energy
  of X," "recreate this kind of shot," "study these videos and make
  something like them") as the starting point for building an original video.
---

# Shot recreation workflow

The process for going from "I want something with the energy of [reference]"
to an original, shippable shot list — the step between watching a reference
and writing `remotion` scene code. This is what makes "get inspired by X"
different from "copy X": it separates the *unprotectable* creative
techniques (which are fair game to study and reuse) from the reference's
*protectable* specific expression (which isn't), and routes each shot to a
legitimate source.

## Why this split is real, not just a legal fig leaf

Copyright protects a work's specific expression — the exact footage, the
exact performance, the exact production design, the score, the dialogue. It
does **not** protect the underlying techniques, style, or ideas: a
whip-pan transition, a teal-and-orange grade, a trading-floor-chaos energy,
a wide-to-close pacing pattern, "chest-thumping ambition" as a mood — none
of that is anyone's property. Every filmmaker studies other films this way.
The workflow below is exactly that practice, made systematic: extract the
technique, discard the specific footage, rebuild the technique with your own
or licensed material.

## Step 1 — Break the reference into shots

If you have the actual reference video file, extract frames at tight
intervals (see `remotion`'s general workflow — `ffmpeg -vf fps=1` or finer
around cuts) and log each distinct shot. If you only have a description or
memory of it, work from that directly. For each shot, capture:

- **Shot number & rough timestamp/duration**
- **Shot type** — wide / medium / close / macro / aerial
- **Camera move** — static, slow push-in, whip pan, orbit, handheld,
  crane/dolly, speed ramp
- **Composition** — centered, rule-of-thirds, symmetry, negative space
- **Lighting** — high-key/low-key, hard/soft, color temperature, direction
  (backlit/rim, side, flat)
- **Color/grade** — palette, contrast level, saturation, any signature tint
  (teal/orange, desaturated, high-contrast)
- **Mood/energy in plain words** — "frantic," "triumphant," "intimate,"
  "chaotic-but-controlled" — this is the part that's actually the point of
  the reference; everything else is just how it's achieved
- **Cut length** — how long the shot holds before the next cut (ties to
  `motion-design`'s pacing-rhythm guidance)

**Explicitly do not carry forward**: exact set/production design elements
distinctive to that IP, character likenesses or wardrobe tied to that
IP/actor, on-screen logos/text/dialogue from the source, its actual score or
sound design, or anything that would make the recreation recognizable as
*that specific scene* rather than *that style of shot*. If a shot's whole
identity is a specific, distinctive fictional element (not a generic
technique), skip it or abstract it further rather than trying to recreate it closely.

## Step 2 — Write each shot as a technical brief, not a reference pointer

Convert "wide shot of the trading floor from [reference]" into an
independent technical description that could be handed to any
cinematographer with zero knowledge of the source:

> Wide shot, slight low angle, dozens of people in motion across a dense
> open-plan trading floor, multiple monitor walls glowing blue/orange in the
> background, warm practical lighting mixed with cool screen-glow, handheld
> energy but not shaky, 2–3 second hold, high information density.

This description is now yours — it's a specification, not a copy, and it's
exactly what feeds the next step.

## Step 3 — Route each shot to a sourcing strategy

For every shot's technical brief, pick the best-fit approach:

| Shot need | Route to |
|---|---|
| Generic real-world footage that surely exists (skylines, crowds, offices, nature, abstract textures) | `footage-libraries` — write a stock search query from the brief's nouns + mood (e.g. "busy trading floor traders monitors") |
| A specific composition/action no stock library will have, or exact brand elements | `ai-video-generation` — turn the technical brief almost directly into a generation prompt (it's already written in cinematographer language) |
| Your own product/brand geometry (logo, device, UI) needing exact accuracy | `3d-design` or the existing `remotion` 2D component work |
| The shot's power is mostly in post-processing (grade, grain, flare, glitch) rather than the underlying plate | Any base layer + `cinematic-vfx` to apply the look |

Most reference videos decompose into a mix of all four — a launch video
rarely needs every shot generated or every shot stock; match each to its
cheapest legitimate source.

## Step 4 — Build the shot list artifact

Produce a table before writing any scene code — this is the deliverable of
this skill, and what gets handed to `remotion` for implementation:

| # | Brief | Duration | Route | Search query / gen prompt | VFX |
|---|---|---|---|---|---|
| 1 | Wide trading floor, low angle, monitor glow, handheld energy | 2.5s | footage-libraries | "busy stock trading floor traders monitors wide" | grain 0.06, teal-orange grade |
| 2 | Macro push-in on a phone screen lighting up, shallow DOF | 3s | ai-video-generation | "macro push-in on smartphone screen illuminating in dark, shallow depth of field, cinematic, 35mm" | bloom on screen glow |
| 3 | Logo mark assembling from facets, orange glow | 2s | remotion (existing LogoMark component) | — | subtle chromatic aberration on glow |

## Step 5 — Sanity-check pacing and structure against the marketing skills

Before building, run the shot list past `launch-video-marketing` (does the
sequence still hit hook → context → value → proof → brand → CTA?) and
`motion-design` (does the cut-length column vary deliberately, does energy
escalate rather than plateau?). A shot list borrowed for its *feel* still
needs to serve *your* video's actual structure — don't preserve the
reference's scene order if your message needs a different one.

## Step 6 — Hand off to implementation

- Stock/generated clips → download per `footage-libraries` /
  `ai-video-generation`'s build-step scripts into `public/clips/`.
- Composite in `remotion` via `<OffthreadVideo>`, apply grading/grain/flare
  per `cinematic-vfx`.
- Original graphics (logo, UI, typography) → `remotion` + `kinetic-animation`
  components, same as any scene.
- Score/SFX → `video-sound-design`, picked to match the energy words from
  Step 1, not the reference's actual track.

## Worked example (methodology only — no reference footage needed to follow this)

"I want the trading-floor-chaos-meets-triumph energy" decomposes to:
mood words → *frantic, high-stakes, ultimately triumphant*; shot pattern →
*wide chaos establishing → quick medium cuts of individual moments →
one lingering triumphant close-up → resolve wide, calmer*; grade → *warm
highlights, deep contrast, slight grain*; pacing → *fast cuts (1–1.5s) during
the chaos block, one held beat (3s+) at the triumphant moment* (this is the
"deliberate stillness before payoff" principle from `motion-design`). None of
this requires or references any specific film's footage — it's a fully
original shot list built from abstracted technique and mood.

## Guardrails

- If a "shot" from the reference is only meaningful *because* it's
  recognizably that scene from that film (a specific iconic beat, not a
  generic technique), that's a sign to abstract further or drop it — the
  goal is recreating a feeling, not a fingerprint-recognizable homage to a
  specific copyrighted scene.
- Never carry a reference's actual dialogue, on-screen text/logos, score, or
  distinctive costume/set design into the brief — those are expression, not technique.
- This workflow produces a plan; it doesn't grant rights to anything. Stock
  and AI-generated clips still need their own license verification per
  `footage-libraries` and `ai-video-generation`'s guardrails.
