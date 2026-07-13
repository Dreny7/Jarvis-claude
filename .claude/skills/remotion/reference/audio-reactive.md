# Audio-reactive editing

Cut and animate on the beat instead of fixed frame counts — the difference
between a video that feels "produced" and one that feels timed by guesswork.

```bash
npm i @remotion/media-utils
```

## Getting audio data

`useAudioData` (React hook, browser-only — use inside components) or
`getAudioData` (promise-based, works in Node scripts too) decode the track
into samples Remotion can analyze per-frame:

```tsx
import { useAudioData, useCurrentFrame, useVideoConfig, visualizeAudio } from "@remotion/media-utils";
import { staticFile } from "remotion";

export const BeatReactiveLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(staticFile("music.m4a"));

  if (!audioData) return null; // still decoding — render nothing this frame

  const amplitudes = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 16, // spectral buckets
  });

  const bass = amplitudes[0]; // low band, 0..1 — good for a "kick" pulse
  const scale = 1 + bass * 0.15;

  return <div style={{ transform: `scale(${scale})` }}>{/* logo */}</div>;
};
```

`visualizeAudio` returns a fresh array every frame — it's a real-time FFT
sample, not a cached lookup, so it's safe to call per-frame inside a pure
render.

## Finding beat timestamps (for cut points, not just amplitude)

For precise "cut on the beat" editing, analyze the track once **offline**
(Node script) and hardcode the frame numbers — don't run beat detection
inside the render:

```ts
// scripts/find-beats.ts — use a beat-detection lib (e.g. `music-tempo`) once,
// then paste the resulting frame numbers into your scene durations.
import { getAudioData, visualizeAudio } from "@remotion/media-utils";

const audioData = await getAudioData("public/music.m4a");
// Scan visualizeAudio() amplitude per-frame and threshold-detect peaks,
// or use a dedicated tempo/onset-detection package for accuracy.
```

Then drive `Series.Sequence durationInFrames` values from the detected beat
grid instead of round numbers like 150 — scenes that land exactly on a
downbeat read as intentional.

## Waveform visualization

```tsx
import { getWaveformPortion, useAudioData } from "@remotion/media-utils";

const audioData = useAudioData(staticFile("music.m4a"));
if (audioData) {
  const { data } = getWaveformPortion({
    audioData,
    startTimeInSeconds: frame / fps,
    durationInSeconds: 0.5,
    numberOfSamples: 40,
  });
  // data: number[] — render as bars for a music-player / waveform scene
}
```

## Guardrails

- `useAudioData` returns `null` while loading — always guard, and Remotion's
  render pipeline waits for it automatically (no manual `delayRender` needed).
- Keep amplitude-driven motion **subtle** (5–20% scale/opacity swings) —
  large per-frame jumps read as jittery, not energetic.
- Beat-locking scene *cuts* (not just decoration) is the highest-leverage use
  of this — a 2px logo pulse is a nice-to-have, landing the "Five specialists"
  scene change exactly on a downbeat is what makes pacing feel edited.
