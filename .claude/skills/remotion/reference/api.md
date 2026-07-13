# Remotion API reference

Deeper notes for authoring compositions. Read the SKILL.md first for the mental
model; this file is for specifics.

## interpolate

```ts
interpolate(input, inputRange, outputRange, options?)
```

- `inputRange` and `outputRange` must be the same length and `inputRange` must be
  monotonically increasing.
- Multi-stop ramps are allowed: `interpolate(frame, [0, 30, 60], [0, 1, 0])`
  fades in then out.
- `options`:
  - `extrapolateLeft` / `extrapolateRight`: `"extend"` (default), `"clamp"`, or
    `"identity"`. Use `"clamp"` for hold-at-endpoint animations.
  - `easing`: e.g. `Easing.bezier(0.25, 0.1, 0.25, 1)` or `Easing.inOut(Easing.ease)`.
    Import `Easing` from `remotion`.

```ts
import { interpolate, Easing } from "remotion";
const x = interpolate(frame, [0, 60], [0, 500], {
  easing: Easing.out(Easing.cubic),
  extrapolateRight: "clamp",
});
```

## spring

```ts
spring({ frame, fps, config?, from?, to?, durationInFrames? })
```

- Default returns a value from `from` (0) to `to` (1).
- `config`: `{ damping, mass, stiffness, overshootClamping }`.
  - Higher `damping` = less bounce. `{ damping: 200 }` ≈ smooth, no overshoot.
- `durationInFrames` stretches/compresses the spring to a fixed length.

## Sequence & Series

```tsx
import { Sequence, Series } from "remotion";

// Offset children in time; frame is rebased to 0 inside.
<Sequence from={30} durationInFrames={90}>
  <Scene />
</Sequence>

// Back-to-back scenes without manual offset math.
<Series>
  <Series.Sequence durationInFrames={60}><Intro /></Series.Sequence>
  <Series.Sequence durationInFrames={90}><Body /></Series.Sequence>
</Series>
```

## Transitions (@remotion/transitions)

```bash
npm i @remotion/transitions
```

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}><A /></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 20 })} />
  <TransitionSeries.Sequence durationInFrames={60}><B /></TransitionSeries.Sequence>
</TransitionSeries>
```

## Fonts

```bash
npm i @remotion/google-fonts
```

```tsx
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();
// use fontFamily in style — available during headless render
```

## Data / parametrized videos

- `defaultProps` on `<Composition>` are the editable inputs in the studio.
- Use `calculateMetadata` on a Composition to derive `durationInFrames`,
  dimensions, or fetch data before render:

```tsx
<Composition
  id="Dynamic"
  component={Vid}
  calculateMetadata={async ({ props }) => {
    const data = await fetch(props.url).then((r) => r.json());
    return { durationInFrames: data.frames, props: { ...props, data } };
  }}
  durationInFrames={1}
  fps={30}
  width={1920}
  height={1080}
/>
```

## Rendering programmatically (@remotion/renderer)

```ts
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const serveUrl = await bundle({ entryPoint: "./src/index.ts" });
const composition = await selectComposition({ serveUrl, id: "MyVideo", inputProps });
await renderMedia({ composition, serveUrl, codec: "h264", outputLocation: "out/video.mp4", inputProps });
```

## Common pitfalls

- **Blank/flashing render** → animating with time instead of `useCurrentFrame()`.
- **Value overshoots** → forgot `extrapolate*: "clamp"` on `interpolate`.
- **Font not rendering headless** → loaded via `<link>` instead of a Remotion font loader.
- **Video stutters on render** → use `<OffthreadVideo>` instead of `<Video>`.
- **Audio cut off** → `durationInFrames` shorter than the audio; extend it.
- **Wrong scene timing inside Sequence** → remember `useCurrentFrame()` is rebased to 0.
