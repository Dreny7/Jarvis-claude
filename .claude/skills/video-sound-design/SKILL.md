---
name: video-sound-design
description: >-
  Music selection/composition, mixing, ducking, sound effects, and loudness
  mastering for video. Use alongside a video-authoring skill (e.g. remotion)
  whenever the user wants a video's audio to feel intentional — picking or
  generating a soundtrack, layering voiceover with music, adding whoosh/UI
  sound effects on cuts, fixing audio that's "too quiet/loud/muddy," or
  preparing final loudness for YouTube/social/streaming delivery.
---

# Video sound design

A launch video's audio is at least three separate layers — score, voice,
effects — each with its own job. Treating "add music" as one step is why
soundtracks end up either drowning the voiceover or feeling like an
afterthought bed. Decide the layers and mix before writing scene code, the
same way `launch-video-marketing` decides structure before scenes.

## The three layers

1. **Score (music bed)** — sets emotional register and pacing. Present
   almost always, usually the quietest layer relative to its perceived
   importance because it's meant to support, not compete.
2. **Voice** (narration, on-camera audio, or the "reads" of on-screen text)
   — the layer that carries information. When present, everything else
   ducks for it. See `remotion`'s `reference/voiceover-captions.md` for the
   TTS/caption pipeline.
3. **Sound design (SFX)** — whooshes on transitions, soft clicks/chimes on
   UI state changes, an impact on a key stat landing. Short, sparse, and
   synced to *visual* events (a cut, a pop-in), not looped or continuous.

Ambience (room tone, subtle atmospheric pad) is a fourth, optional layer —
useful for scenes that otherwise feel dead silent under the score.

## Choosing/commissioning music

- **Match tempo to edit pace, not the other way around.** Pick or generate
  music *before* finalizing scene durations — cutting on or near the beat
  (see `remotion`'s `reference/audio-reactive.md`) requires the track to
  exist first. Rough guide: 90–110 BPM for measured/premium pacing, 120–135
  BPM for energetic product/tech launches, 135+ for high-intensity social cuts.
- **Match instrumentation to brand register.** Synth/electronic pads and
  plucks read as tech-forward; sparse piano/strings read as premium/trust;
  acoustic guitar/warm pads read as human/approachable. Mismatched
  instrumentation undercuts an otherwise-correct script (a fintech trust
  message over playful marimba reads wrong regardless of the words).
- **Music has its own structure — align to it.** Most tracks build in
  intensity toward a chorus/drop. Land your key reveal (product name, hero
  stat, CTA) on or just after that rise, not during a quiet verse section —
  the music does emotional work for you for free if the timing lines up.
- **Sourcing options, roughly in order of control vs. speed:**
  - Commissioned/original score — full control, slowest, best for a flagship
    launch asset meant to run for months.
  - Royalty-free libraries (Epidemic Sound, Artlist, Soundstripe, Musicbed) —
    searchable by BPM/mood/instrumentation, cleared for commercial use,
    fast turnaround. Default choice for most launch videos.
  - AI-generated music (e.g. via a music-generation API) — fastest, useful
    for a rough temp track to cut against even if replaced later. Treat
    exactly like TTS in `voiceover-captions.md`: call the API from a build
    script, save the file to `public/`, never inside a rendered component.
    Always confirm the current provider's commercial-use terms before
    shipping AI-generated audio in a paid campaign.
- **Always license/clear before final render** — swapping music after a
  video is cut to its beats can break every timed transition; confirm
  licensing early, not after the edit is locked.

## Mixing & ducking in Remotion

Layer multiple `<Audio>` components — they play simultaneously by default:

```tsx
import { Audio, Sequence, staticFile, interpolate, useVideoConfig } from "remotion";

<Audio src={staticFile("music.m4a")} volume={0.22} />
<Sequence from={90} durationInFrames={240}>
  <Audio src={staticFile("voiceover.mp3")} volume={1} />
</Sequence>
```

**Ducking** — automatically lower the music under voiceover instead of
hand-picking one flat low volume for the whole video:

```tsx
const VOICEOVER_RANGES = [
  [90, 330],
  [520, 700],
]; // [startFrame, endFrame] pairs — derive from your captions JSON

const duckedVolume = (frame: number) => {
  const inVoiceover = VOICEOVER_RANGES.some(([s, e]) => frame >= s && frame <= e);
  const target = inVoiceover ? 0.12 : 0.55;
  // ease the transition over ~10 frames so the duck isn't a hard jump
  const nearestEdge = VOICEOVER_RANGES.flat().reduce(
    (min, edge) => Math.min(min, Math.abs(edge - frame)),
    Infinity,
  );
  const blend = interpolate(nearestEdge, [0, 10], [1, 0], { extrapolateRight: "clamp" });
  return inVoiceover ? target + blend * 0.1 : target;
};

<Audio src={staticFile("music.m4a")} volume={(f) => duckedVolume(f)} />;
```

**Headroom guide** (relative volume, not absolute):
- Voice alone: ~1.0 (reference level everything else sits under)
- Music under voice: 0.10–0.20
- Music alone (no voice on screen): 0.5–0.9 depending on how "quiet" vs.
  "driving" the scene should feel
- One-shot SFX (whoosh/click): 0.3–0.6 — loud enough to register as a hit,
  never loud enough to compete with music or voice

## Sound effects on cuts

Short one-shot sounds timed to a scene change read as "produced"; silence on
every cut reads as unfinished. Place a trimmed SFX file as its own
`<Sequence>` starting a few frames before the visual cut lands (sound
slightly *before* the visual it accents reads more natural than exactly
synced or after):

```tsx
<Sequence from={SCENES.intro - 4} durationInFrames={20}>
  <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} />
</Sequence>
```

Conventions: a soft whoosh on full scene transitions, a subtle click/pop on
individual UI elements popping in (use sparingly — one or two per scene, not
one per card), a brighter chime/ding reserved for the single most important
beat (the hero stat, the CTA) so it doesn't get diluted by overuse.

## Loudness mastering (post-render)

Video platforms normalize loudness on playback — mixing "louder" doesn't
help and can cause clipping/distortion that survives normalization. Master
to a target integrated loudness with `ffmpeg`'s `loudnorm` filter as a final
pass on the rendered file:

```bash
ffmpeg -i out/launch.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v copy out/launch-mastered.mp4
```

Rough targets by destination: **-14 LUFS** integrated for YouTube/Spotify/
most streaming platforms, **-16 to -19 LUFS** for platforms that don't
normalize as aggressively (some social feeds) if the video will also be
watched muted-then-unmuted inconsistently. True peak should stay at or below
-1.0 dBTP to avoid inter-sample clipping after platform re-encoding.

## Guardrails

- Decide music before locking scene durations if beat-syncing matters —
  reordering scenes after the fact desyncs every timed cut.
- Never stack SFX on every single element pop-in — reserve sound accents for
  cuts and 1–2 hero moments per scene, matching the "secondary action, not
  competing action" principle in `motion-design`.
- Music/voiceover generation and licensing happen in build scripts, not
  inside rendered components — components stay pure and offline.
- Run the final loudness pass once, on the finished render — normalizing
  mid-project audio and re-rendering repeatedly wastes render time for no
  audible difference until the edit is actually locked.
