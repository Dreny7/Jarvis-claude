---
name: remotion
description: >-
  Create, edit, preview, and render videos programmatically with Remotion (React
  video framework). Use when the user wants to build a video, animation, motion
  graphic, or MP4/GIF from code — e.g. "make a video", "animate this", "render a
  Remotion composition", scaffolding a new video project, adding a composition,
  or working with useCurrentFrame/interpolate/spring/Sequence.
---

# Remotion

Remotion turns React components into videos. Each frame is a rendered React tree;
animation is a pure function of the current frame number. Use this skill to
scaffold projects, author compositions, preview them in Remotion Studio, and
render to MP4/WebM/GIF.

## Setup

**New project:**
```bash
npx create-video@latest        # interactive: pick a template (Hello World, Blank, etc.)
cd <project> && npm install
```

**Add Remotion to an existing React project:**
```bash
npm i remotion @remotion/cli @remotion/player
```

**Preview in the studio (hot-reloading editor):**
```bash
npx remotion studio
```

**Render:**
```bash
npx remotion render <composition-id> out/video.mp4          # MP4
npx remotion render <composition-id> out/video.gif          # GIF
npx remotion render <id> out/v.mp4 --props='{"title":"Hi"}' # override props
```

## Mental model — the rules that matter

1. **Everything is a function of `useCurrentFrame()`.** No `setTimeout`, no CSS
   transitions, no `requestAnimationFrame`. Ask "what should this look like at
   frame N?" and compute it.
2. **`fps` sets the frame↔time mapping.** At 30fps, 1 second = 30 frames. Convert
   seconds to frames with `seconds * fps`.
3. **Compositions are registered in the Root**, each with `id`, `component`,
   `durationInFrames`, `fps`, `width`, `height`, and optional `defaultProps`.
4. **Static assets live in `public/`** and are referenced with `staticFile()`.

## Registering compositions

`src/Root.tsx` is the entry point listed in `remotion.config.ts` / the studio:

```tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const RemotionRoot = () => (
  <Composition
    id="MyVideo"
    component={MyVideo}
    durationInFrames={150}   // 5s at 30fps
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ title: "Hello" }}
  />
);
```

## Animating

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const MyVideo: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Linear fade over the first second; clamp so it holds after.
  const opacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Physics-based entrance.
  const scale = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1220", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ color: "white", opacity, transform: `scale(${scale})`, fontSize: 90 }}>{title}</h1>
    </AbsoluteFill>
  );
};
```

- `interpolate(frame, inputRange, outputRange, opts)` — map a range to another.
  **Always** set `extrapolateLeft`/`extrapolateRight: "clamp"` unless you want the
  value to shoot past the endpoints.
- `spring({ frame, fps, config })` — natural motion; returns ~0→1.
- Sequencing: wrap children in `<Sequence from={30} durationInFrames={60}>` to
  offset/limit when they appear. Inside a Sequence, `useCurrentFrame()` is
  rebased to start at 0. Use `<Series>` for back-to-back scenes.

## Assets & media

```tsx
import { staticFile, Img, Audio, OffthreadVideo } from "remotion";

<Img src={staticFile("logo.png")} />
<Audio src={staticFile("music.mp3")} />
<OffthreadVideo src={staticFile("clip.mp4")} />   // prefer over <Video> for rendering
```

## Detailed reference

For deeper API notes (interpolate options, easing, Sequence/Series patterns,
transitions, common pitfalls), read `reference/api.md` in this skill folder.

## Guardrails

- Never animate with wall-clock time or timers — only `useCurrentFrame()`.
- Keep component render pure; it runs once per frame and must be deterministic.
- Match `durationInFrames` to the content length (`seconds * fps`).
- Fonts: load via `@remotion/google-fonts` or `@remotion/fonts`, not `<link>`,
  so they're available during headless render.
