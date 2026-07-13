# Voiceover & captions

Remotion has no built-in TTS engine — voiceover is generated *before* the
render (a build step), then played back and captioned like any audio track.

## 1. Generate the voiceover (build-time script, not inside a component)

Call a TTS provider (ElevenLabs, OpenAI `tts-1`, Azure, etc.) from a small
Node script and save the file into `public/`:

```ts
// scripts/generate-voiceover.ts — run with `tsx scripts/generate-voiceover.ts`
import { writeFileSync } from "node:fs";
import OpenAI from "openai";

const openai = new OpenAI();
const res = await openai.audio.speech.create({
  model: "tts-1-hd",
  voice: "onyx",
  input: "Markets never sleep. Now neither does your portfolio.",
});
writeFileSync("public/voiceover.mp3", Buffer.from(await res.arrayBuffer()));
```

Never call a TTS/LLM API from inside a component — render must stay pure and
offline. Generate the audio once, commit it (or cache it), and treat it as a
static asset like `public/music.m4a`.

## 2. Size the composition to the voiceover

Use `getAudioDurationInSeconds` (Node-safe, no browser needed) to compute
`durationInFrames` from the real file instead of guessing:

```ts
import { getAudioDurationInSeconds } from "@remotion/media-utils";

const seconds = await getAudioDurationInSeconds("public/voiceover.mp3");
```

Or do it live in the Composition with `calculateMetadata`:

```tsx
<Composition
  id="Launch"
  component={Launch}
  calculateMetadata={async () => {
    const seconds = await getAudioDurationInSeconds(staticFile("voiceover.mp3"));
    return { durationInFrames: Math.ceil(seconds * 30) + 30 }; // + tail padding
  }}
  fps={30}
  width={1920}
  height={1080}
/>
```

## 3. Auto-generate captions from the voiceover (Whisper)

```bash
npm i @remotion/install-whisper-cpp @remotion/captions
```

```ts
// scripts/generate-captions.ts
import { installWhisperCpp, downloadWhisperModel, transcribe, toCaptions } from "@remotion/install-whisper-cpp";
import { writeFileSync } from "node:fs";

await installWhisperCpp({ to: "whisper.cpp", version: "1.5.5" });
await downloadWhisperModel({ model: "medium.en", folder: "whisper.cpp" });
const { transcription } = await transcribe({
  inputPath: "public/voiceover.mp3",
  model: "medium.en",
  whisperPath: "whisper.cpp",
});
const { captions } = toCaptions({ whisperCppOutput: transcription });
writeFileSync("public/voiceover.captions.json", JSON.stringify(captions));
```

This is a one-time/build-time step (needs a compiled whisper.cpp binary) —
run it locally or in CI, commit the resulting JSON, and read it at render
time with a plain `fetch`/`import` of the static file.

## 4. Render captions — word-by-word "TikTok style"

`@remotion/captions` ships `Caption[]` (`{ text, startMs, endMs }`) and a
helper that groups words into short on-screen pages:

```tsx
import { createTikTokStyleCaptions } from "@remotion/captions";
import { useCurrentFrame, useVideoConfig } from "remotion";
import captionsJson from "../public/voiceover.captions.json";

const { pages } = createTikTokStyleCaptions({
  captions: captionsJson,
  combineTokensWithinMilliseconds: 400, // words grouped per on-screen page
});

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;

  const page = pages.find((p) => ms >= p.startMs && ms < p.startMs + p.durationMs);
  if (!page) return null;

  return (
    <div style={{ fontSize: 64, fontWeight: 800, textAlign: "center" }}>
      {page.tokens.map((t) => (
        <span
          key={t.fromMs}
          style={{ color: ms >= t.fromMs ? "#FF5C00" : "#fff", marginRight: 14 }}
        >
          {t.text}
        </span>
      ))}
    </div>
  );
};
```

## Guardrails

- TTS/transcription calls belong in a **script**, not a Remotion component —
  components must render deterministically offline.
- Always pad `durationInFrames` a little past the audio end (10–20 frames) so
  the last word/scene doesn't get cut off.
- Most social video is watched muted — burn in captions by default for any
  launch/social cut, not just accessibility cuts.
