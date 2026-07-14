# Ecelon V4 — asset manifest & sourcing notes

## Layout

```
public/
  archival/        # cleared 2008 video clips (mp4)  → wired via src/v4/config/footage.ts
  vo/              # pre-extracted narration (mp3)    → same config, voSrc field
  sfx/             # sound design (see below)
  way.mp3 hth.mp3  # score (see licensing note)
src/v4/config/
  agents.ts        # agent roster — single source of truth, rename here only
  beatmap.ts        # Act II beat grid (frame math) driving pulses/theatrics
  audioCues.ts     # every one-shot SFX cue, editable in one place
  footage.ts       # Act I footage slots — pinned to beats, ship empty-safe
```

## Footage slots (`src/v4/config/footage.ts`)

Five slots are defined and pinned to the exact beats in `Act1.tsx`, each with
a `descriptor` of what should go there. **They ship empty in this build** —
`Act1.tsx` renders its existing recreated-graphic treatment when a slot has
no `src`, and will layer a graded `<OffthreadVideo>` underneath the moment a
cleared clip is dropped in and the slot's `src` is set. No component code
changes are needed either way.

**Why they're empty:** this build environment has no network access to
stock/archive APIs — `archive.org` and equivalent hosts are policy-blocked
from the sandbox this was rendered in (verified directly: `CONNECT
archive.org:443` returns a `403 policy denial`). Sourcing has to happen
outside this environment.

### How to source cleared footage (do this, then drop files in and set `src`)

1. **License archival stock** — AP Archive, Getty Images/iStock, Reuters,
   British Pathé, Pond5, Storyblocks, Artgrid all license real 2008-crisis
   footage for commercial use.
2. **Public-domain / government sources** — U.S. federal works (FCIC
   hearings, Federal Reserve/Treasury pressers), some C-SPAN material.
   Verify each clip's specific rights statement before use.
3. **Recreate the emotion with licensed generic b-roll** — trading floors,
   foreclosure signs, empty homes, newspaper headlines, graded to look
   archival. Often cheaper, rights-clean, and slots into the same five
   marks without any code change. `footage-libraries` skill covers Pexels/
   Pixabay/Coverr (all free API access, commercial-use cleared) — those
   just need an API key set as an env var in a build step, not inside the
   rendered component.
4. **Newspaper front pages/headlines** can be recreated as stylized graphics
   (no copyright issue) — already done for the wire-headline beat.

**Do not** use footage or audio you don't hold the rights to — that's a
legal risk, not a rendering problem, regardless of how the footage was
found (YouTube edits of broadcast news do not carry the rights).

### Voiceover

If real narration is sourced for a slot, pre-extract the audio to
`public/vo/*.mp3` and set the slot's `voSrc`. Never pull audio directly off
a video component at render time.

## Music (`public/way.mp3`, `public/hth.mp3`)

Both are commercial recordings used as temp/reference tracks for this cut.
**Confirm licensing (or commission/license a replacement) before any public
distribution.** The whole timeline is now beat-mapped to specific onsets in
`hth.mp3` (see `timeline.ts` comments) — swapping the track will desync
every timed cut in Act II unless the new track is re-analyzed and the
timeline frame map is rebuilt around its actual beat grid.

## SFX (`public/sfx/`)

All current files (`riser.wav`, `impact.wav`, `whoosh.wav`, `pop.wav`,
`swish.wav`, `shimmer.wav`, `tapestop.wav`, `act1_ache.wav`, `drone.wav`)
are **originally synthesized** in this session (procedural sine/noise
synthesis — no sampled or licensed material), not sourced from a commercial
library. They're placeholders proving out the cue timing in
`src/v4/config/audioCues.ts`. For a shipping-quality pass, source a matching
pack from Artlist, Epidemic Sound, or Uppbeat and re-point the `src` fields
in `audioCues.ts` — the cue timing (already synced to the beat map) doesn't
need to change.

`act1_ache.wav` is an original low drone + sparse bell-tone motif (not a
piano/cello recording) layered under Act I for emotional weight. Swap for a
licensed solo piano/cello cue if one is sourced — same slot, same envelope.
