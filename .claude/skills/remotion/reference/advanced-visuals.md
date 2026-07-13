# Advanced visuals: Lottie, 3D, shapes, paths, noise

Packages for richer motion than plain CSS/SVG — useful for a launch video's
hero moments (logo reveal, 3D product spin, hand-crafted icon animation).

## Lottie (After Effects animations)

```bash
npm i @remotion/lottie
```

Export a `.json` from After Effects (via the Bodymovin/Lottie plugin) or grab
one from LottieFiles, drop it in `public/`, and play it frame-accurately:

```tsx
import { Lottie, useLottie } from "@remotion/lottie";
import { staticFile, useCurrentFrame } from "remotion";
import { useEffect, useState } from "react";

const [animationData, setAnimationData] = useState(null);
useEffect(() => {
  fetch(staticFile("checkmark.json")).then((r) => r.json()).then(setAnimationData);
}, []);

if (!animationData) return null;
return <Lottie animationData={animationData} />;
```

Lottie playback is driven by Remotion's frame clock automatically — no manual
sync needed. Use `useLottie` if you need the underlying player instance (e.g.
to read total duration and size a `<Sequence>` around it).

## 3D scenes (@remotion/three)

```bash
npm i @remotion/three three @react-three/fiber @types/three
```

Wraps React Three Fiber; `useCurrentFrame()` still works inside — animate 3D
props exactly like 2D ones (`interpolate`/`spring`, no clock-based tweening):

```tsx
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const Product3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const rotationY = interpolate(frame, [0, fps * 4], [0, Math.PI * 2]);

  return (
    <ThreeCanvas width={width} height={height}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1.2} />
      <mesh rotation={[0.2, rotationY, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#FF5C00" />
      </mesh>
    </ThreeCanvas>
  );
};
```

Reach for this only for genuine 3D (product models, depth-mapped logos,
particle fields) — it's a heavier render (real WebGL) than the CSS/SVG
approach used for cards and UI mockups.

## Shapes (@remotion/shapes)

```bash
npm i @remotion/shapes
```

Procedural vector primitives with built-in `edgeRoundness`, useful for
generative background elements without hand-writing SVG paths:

```tsx
import { Circle, Star, Triangle, Pie } from "@remotion/shapes";

<Circle radius={80} fill="#FF5C00" />
<Star points={5} innerRadius={30} outerRadius={70} fill="#FF7B24" />
<Pie radius={100} progress={0.72} fill="#FF5C00" /> {/* great for a % gauge */}
```

## Path animation (@remotion/paths)

For animating along or drawing arbitrary SVG paths (logo traces, custom line
charts) beyond the basic `strokeDasharray` trick:

```tsx
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";

const d = "M0,100 C150,0 350,200 500,100";
const evolved = evolvePath(progress, d); // progress 0..1 → partial path string
<path d={evolved.path} stroke="#FF5C00" fill="none" />;

// Or get a point to place a marker/dot at the path's leading edge:
const len = getLength(d);
const point = getPointAtLength(d, len * progress);
```

## Deterministic noise (@remotion/noise)

Replaces hand-rolled `Math.sin`-based pseudo-random with real, seeded
Perlin/simplex noise — smoother organic motion for particles/backgrounds:

```bash
npm i @remotion/noise
```

```tsx
import { noise2D } from "@remotion/noise";

const drift = noise2D("particle-seed-1", frame / 40, 0) * 20; // -20..20, smooth
```

## Composable transforms (@remotion/animation-utils)

```bash
npm i @remotion/animation-utils
```

```tsx
import { makeTransform, scale, translateY, rotate } from "@remotion/animation-utils";

<div style={{ transform: makeTransform([translateY(offset), scale(s), rotate(deg)]) }} />
```

Avoids manual template-string concatenation bugs when composing multiple
transform functions with conditional values.

## Preloading (@remotion/preload)

For `<Player>`-based previews (not headless render) where late-loading
assets cause a visible pop-in:

```tsx
import { preloadImage, preloadAudio, preloadFont } from "@remotion/preload";
preloadImage(staticFile("logo.png"));
```

Not needed for `remotion render` — the render waits for all assets by
default — but worth knowing when embedding a `<Player>` in a marketing site.
