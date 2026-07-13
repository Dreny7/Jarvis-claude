# Multi-format export (one timeline, every aspect ratio)

Launch videos need a 16:9 cut (YouTube/website), a 1:1 or 4:5 cut (LinkedIn/
feed), and a 9:16 cut (TikTok/Reels/Shorts/Stories). Don't hand-build three
timelines — parametrize one composition by format and register it three times.

## Pattern: format-aware Composition

```tsx
// src/Root.tsx
import { Composition } from "remotion";
import { LaunchVideo } from "./LaunchVideo";

type Format = "landscape" | "square" | "vertical";

const DIMENSIONS: Record<Format, { width: number; height: number }> = {
  landscape: { width: 1920, height: 1080 },
  square: { width: 1080, height: 1080 },
  vertical: { width: 1080, height: 1920 },
};

const FORMATS: Format[] = ["landscape", "square", "vertical"];

export const RemotionRoot: React.FC = () => (
  <>
    {FORMATS.map((format) => (
      <Composition
        key={format}
        id={`Launch-${format}`}
        component={LaunchVideo}
        durationInFrames={900}
        fps={30}
        {...DIMENSIONS[format]}
        defaultProps={{ format }}
      />
    ))}
  </>
);
```

Render all three with one command each:

```bash
npx remotion render Launch-landscape out/launch-16x9.mp4
npx remotion render Launch-square out/launch-1x1.mp4
npx remotion render Launch-vertical out/launch-9x16.mp4
```

## Making scenes respond to format, not just scale

Naively scaling 16:9 content into 9:16 leaves huge dead space top/bottom.
Read `format` (or derive it from `useVideoConfig()`'s aspect ratio) and
change **layout**, not just size:

```tsx
export const LaunchVideo: React.FC<{ format: "landscape" | "square" | "vertical" }> = ({
  format,
}) => {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  return (
    <AbsoluteFill
      style={{
        flexDirection: isVertical ? "column" : "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Headline fontSize={isVertical ? 72 : 84} />
      {/* Vertical: stack phone mockup above the callouts.
          Landscape: phone mockup centered, callouts left/right. */}
      {isVertical ? <StackedLayout /> : <SideBySideLayout />}
    </AbsoluteFill>
  );
};
```

Practical rules of thumb:
- **Vertical (9:16)**: one hero element per screen, bigger type, captions
  always on (sound-off viewing), cuts every 1.5–3s.
- **Square (1:1)**: safest for feed scroll — crop-safe on both mobile and
  desktop previews; keep key content in the center 80%.
- **Landscape (16:9)**: the only format with room for side-by-side
  comparisons, multi-card layouts, and longer dwell-time explanations.

## Dynamic duration per format

Vertical/social cuts are almost always shorter than the hero landscape video.
Vary `durationInFrames` per format via `calculateMetadata` instead of forcing
one length on every cut:

```tsx
<Composition
  id="Launch-vertical"
  component={LaunchVideo}
  calculateMetadata={async () => ({ durationInFrames: 450, props: { format: "vertical" } })} // 15s cut
  fps={30}
  width={1080}
  height={1920}
/>
```

## Batch-rendering all formats at once

```bash
npx remotion render Launch-landscape out/landscape.mp4 &
npx remotion render Launch-square out/square.mp4 &
npx remotion render Launch-vertical out/vertical.mp4 &
wait
```

Or script it with `@remotion/renderer`'s `renderMedia` in a loop over
`FORMATS` for a single `npm run render:all` command.
