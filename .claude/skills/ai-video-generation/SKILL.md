---
name: ai-video-generation
description: >-
  Generate realistic AI video clips from text or images via generative video
  models (Google Veo, OpenAI Sora, Runway, Luma, Kling, etc.) and composite
  them into an edit. Use when the user wants AI-generated / photorealistic /
  live-action-style footage — "generate a video of...", "make realistic
  footage", "text-to-video", "image-to-video", b-roll or hero shots no code
  can draw — as opposed to code-drawn motion graphics (use remotion for those).
---

# AI video generation

Generative video models produce photoreal or stylized *footage* — a drone
shot over a city, a product on a table in golden light, a person smiling at a
phone — the kind of shot you'd otherwise have to film. This is the
complement to `remotion`: Remotion draws UI, text, charts, and motion
graphics deterministically; AI video generates the live-action-feeling clips
those graphics sit on top of. A great launch video usually uses **both** —
generated b-roll/hero shots as the base layer, Remotion graphics composited
over them.

## The universal pattern: async job, not a blocking call

Every serious video model is slow (tens of seconds to several minutes per
clip) and therefore **asynchronous**: you submit a job, poll (or await a
webhook) until it's done, then download the resulting file. Treat generation
as a **build step** that writes `.mp4` files into `public/`, exactly like
TTS and music in `video-sound-design` — never call a generation API from
inside a rendered component.

```
submit(prompt, options) -> jobId
loop: status = poll(jobId) until status == "succeeded" | "failed"
download(result.url) -> public/clips/shot-01.mp4
```

## Provider landscape (verify model IDs/params against live docs — this moves fast)

These SDKs are all real and on npm (versions as of writing); the **model
names, parameters, pricing, and capabilities change frequently**, so confirm
specifics against each provider's current docs before shipping.

| Provider | SDK (npm) | Strengths | Notes |
|---|---|---|---|
| **Google Veo** (via Gemini API) | `@google/genai` | Strong photorealism, native audio generation, image-to-video | Access via Gemini API or Vertex AI |
| **OpenAI Sora** | `openai` | Long coherent shots, strong physics/consistency | Video endpoints on the OpenAI API |
| **Runway** (Gen-family) | `@runwayml/sdk` | Fast iteration, fine motion control, video-to-video | Popular for pro/agency workflows |
| **Luma** (Dream Machine / Ray) | `lumaai` | Fast, cinematic camera moves, keyframe control | Good cost/speed balance |
| **Kling, Minimax/Hailuo, Pika, Wan, etc.** | via `replicate` or `@fal-ai/client` | Access many models behind one API | Aggregators — easiest way to A/B multiple models |

**Choosing:** for a single flagship launch, generate the same prompt across
2–3 models (aggregators like Replicate/fal make this cheap to A/B) and pick
the best take per shot — model quality varies wildly by subject matter
(one is best at faces, another at landscapes, another at product). For
speed/cost on lots of b-roll, pick one fast model and batch.

## Example: aggregator pattern (fal.ai) — easiest multi-model access

```ts
// scripts/generate-clips.ts — a BUILD script, run with `tsx`, not in a component
import { fal } from "@fal-ai/client";
import { writeFile } from "node:fs/promises";

fal.config({ credentials: process.env.FAL_KEY });

// Model slug + schema vary per model — check the model's page on the provider.
const result = await fal.subscribe("fal-ai/veo3", {
  input: {
    prompt:
      "Cinematic slow push-in on a sleek black smartphone on a dark desk, " +
      "a glowing orange trading app on screen, shallow depth of field, " +
      "soft rim light, volumetric haze, shot on 35mm, photorealistic",
    aspect_ratio: "16:9",
    duration: "8s",
  },
  logs: true,
  onQueueUpdate: (u) => u.status === "IN_PROGRESS" && console.log(u.logs?.at(-1)?.message),
});

const url = result.data.video.url;
const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
await writeFile("public/clips/hero-phone.mp4", buf);
```

## Example: Replicate (also multi-model, explicit poll)

```ts
import Replicate from "replicate";
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// `replicate.run` handles the submit+poll+wait loop for you and returns output.
const output = await replicate.run("<owner>/<video-model>:<version>", {
  input: { prompt: "...", aspect_ratio: "16:9" },
});
// output is typically a URL (or array) — fetch and save to public/clips/.
```

## Example: direct provider (Google Veo via @google/genai)

```ts
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Video generation is long-running: kick off, then poll the operation.
let op = await ai.models.generateVideos({
  model: "veo-3.0-generate-preview", // confirm current model id in Google's docs
  prompt: "Photorealistic aerial shot flying over a neon city at night, rain-slicked streets",
});
while (!op.done) {
  await new Promise((r) => setTimeout(r, 10_000));
  op = await ai.operations.getVideosOperation({ operation: op });
}
// Download the generated video from the operation result (see current SDK docs
// for the exact response shape / download helper).
```

The exact response shapes and download helpers differ per SDK and version —
the **pattern** (submit → poll `done` → download to `public/`) is what's
stable; look up the current method names when implementing.

## Image-to-video (higher control than pure text-to-video)

For brand-critical shots, generate or design a **still first** (real photo,
a rendered Remotion frame, or an image model), then animate *that* image —
image-to-video gives far more control over composition, product accuracy,
and brand color than describing everything in text. Most providers accept a
`image`/`image_url`/`first_frame` input for this. This is the reliable way
to get *your actual product* on screen rather than a model's hallucination
of it.

## Prompting for realism

- **Describe it like a cinematographer, not a wish.** Specify shot type
  (wide/medium/close/macro), camera move (slow push-in, orbit, static
  locked-off, handheld), lens feel (35mm, shallow depth of field, anamorphic),
  and lighting (golden hour, soft rim light, high-key, moody low-key).
- **Name the film look** when you want photoreal: "shot on 35mm film,"
  "cinematic color grade," "volumetric lighting," "photorealistic," "8k" —
  these bias the model toward footage rather than CGI/cartoon.
- **One clear subject + one clear action per clip.** Models lose coherence
  when asked for multiple simultaneous actions or scene changes. Want a
  sequence? Generate separate clips and cut between them in the edit.
- **Keep clips short (4–8s).** Quality and coherence degrade over length;
  most launch-video shots are 1.5–4s on screen anyway. Generate short,
  trim in the edit.
- **Motion intensity matters.** Over-specified fast motion produces warping
  artifacts; "subtle," "slow," "gentle" camera moves look more premium and
  hide model weaknesses. Fast whip-pans are where AI video artifacts show most.
- **Iterate with seeds.** When a model exposes a seed, lock it once you have
  a near-miss you like and vary the prompt slightly, rather than re-rolling
  blind.

## Compositing generated footage into the Remotion edit

Save clips to `public/clips/` and bring them in with `<OffthreadVideo>`
(preferred over `<Video>` for headless render), then layer Remotion graphics
on top — this is the whole point of using both tools together:

```tsx
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";

export const HeroShot: React.FC = () => {
  const frame = useCurrentFrame();
  const gradeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile("clips/hero-phone.mp4")} />
      {/* darkening/brand-tint overlay so on-top text stays legible */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 40%, rgba(5,5,6,0.85) 100%)", opacity: gradeIn }} />
      {/* Remotion headline composited over the generated footage */}
      <Headline text="Markets never {orange:sleep.}" />
    </AbsoluteFill>
  );
};
```

Practical compositing tips:
- **Trim/retime** generated clips to the exact frame count the edit needs —
  `<OffthreadVideo startFrom={...} endAt={...}>` (or `trimBefore`/`trimAfter`
  in current Remotion) rather than forcing a scene to the clip's native length.
- **Color-match** generated footage to the brand palette with an overlay or
  CSS `filter` (saturate/contrast/hue) so AI clips and code-drawn scenes feel
  like one graded piece, not a collage.
- Always lay a subtle darkening/tint scrim under any text placed over busy
  generated footage — legibility beats showing every pixel of the clip.
- Generated footage is where the `motion-design` note about grain/texture
  pays off: real-feeling footage under crisp vector graphics is exactly the
  "alive, not flat" contrast that reads as high production value.

## Guardrails & ethics

- **All generation is a build step.** Scripts write files into `public/`;
  rendered components only read the resulting `.mp4`s. Never call a
  generation API inside a Remotion component — renders must stay pure/offline.
- **Cost & time are real.** Each clip costs money and takes minutes.
  Storyboard first (decide the 4–6 shots you actually need — see
  `launch-video-marketing` for structure), generate deliberately, don't
  brute-force hundreds of takes.
- **Commit the chosen clips** (or cache them) so re-renders don't regenerate —
  generation is non-deterministic; a re-roll won't match your edit's timing.
- **Verify usage rights** for commercial/paid campaigns — each provider's
  license terms for generated content differ; confirm before shipping an ad.
- **No deceptive or unauthorized likenesses.** Don't generate real people
  (public figures, someone's specific face), real brand logos you don't own,
  or footage staged to look like a genuine news/testimonial event that didn't
  happen. Synthetic footage presented as real testimonial/endorsement is
  deceptive advertising — keep generated b-roll clearly illustrative, and use
  real, consented footage for anything that claims to depict real customers.
- **Disclose where required.** Some jurisdictions/platforms require labeling
  AI-generated media; check the destination platform's synthetic-media policy.

## Where this sits among the video skills

- `remotion` — builds and renders the timeline; composites everything.
- `ai-video-generation` (this) — generates the live-action-feeling base
  footage that Remotion graphics sit on.
- `motion-design` / `kinetic-animation` — how the graphics *over* the footage
  move and look.
- `3d-design` — the *rendered-3D* alternative to generated footage when you
  need exact product geometry/brand accuracy that a generative model can't
  guarantee.
- `video-sound-design` — score/voice/SFX over the finished picture.
- `launch-video-marketing` — decides which shots you need before you spend a
  cent generating them.
