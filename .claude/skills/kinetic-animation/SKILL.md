---
name: kinetic-animation
description: >-
  Concrete animation recipes beyond basic spring/interpolate: kinetic
  typography, particle systems, shape morphing, fake-camera moves
  (parallax/Ken Burns/whip pan), and physics-feeling procedural motion. Use
  alongside remotion (implementation) and motion-design (when/why to use
  each technique) whenever the user wants a specific animated effect —
  text that builds letter-by-letter, a particle burst, a liquid/morphing
  shape, a camera-feeling pan/zoom, or "make this feel less static."
---

# Kinetic animation

Recipes for specific effects that come up constantly in launch videos and
motion graphics but aren't covered by plain `interpolate`/`spring` usage.
Each is a deterministic, frame-driven pattern — no timers, no randomness
without a seed (see `remotion`'s core guardrails).

## Kinetic typography

**Letter-by-letter stagger** — split text into characters, spring each with
a per-index delay:

```tsx
{text.split("").map((char, i) => {
  const s = spring({ frame: frame - i * 1.5, fps, config: { damping: 14, stiffness: 260 } });
  return (
    <span key={i} style={{ display: "inline-block", opacity: s, transform: `translateY(${(1 - s) * 24}px)` }}>
      {char === " " ? " " : char}
    </span>
  );
})}
```

Word-level stagger (the `Headline` pattern) reads faster/punchier; letter-level
reads more deliberate/premium. Pick by pacing — letter-level needs more
runway (300–500ms) to register, so it doesn't suit a sub-1s beat.

**Masked wipe-reveal** — text appears via a moving clip edge instead of
fading in (reads more "designed," less "PowerPoint"):

```tsx
const reveal = interpolate(frame, [0, 20], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
<div style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}>{text}</div>;
```

**Number count-up with overshoot** — for stats/metrics, don't linearly tick;
ease out and let it settle a hair past the final value:

```tsx
const raw = interpolate(frame, [0, 40], [0, targetValue], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const overshoot = spring({ frame: frame - 38, fps, config: { damping: 10, stiffness: 200 } });
const value = frame < 38 ? raw : targetValue * (1 + (1 - overshoot) * 0.03);
```

**Text along a path** — combine with `@remotion/paths` (see `remotion`'s
`reference/advanced-visuals.md`) using `getPointAtLength` per character to
place each glyph along a curve instead of a straight baseline — good for a
logo-adjacent wordmark treatment, overkill for body copy.

## Particle systems

Deterministic emitter pattern — seed each particle once, animate purely
from `frame`, never `Math.random()` inside render (see `@remotion/noise` in
`remotion`'s advanced-visuals reference for higher-quality randomness than
hand-rolled `Math.sin` seeds):

```tsx
import { noise2D } from "@remotion/noise";

const PARTICLE_COUNT = 60;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  seed: `p-${i}`,
  startFrame: (i * 3) % 90, // stagger emission
  baseX: noise2D(`x-${i}`, 0, 0) * 100,
}));

// per particle, per frame:
const life = (frame - p.startFrame) % 120; // loop every 120 frames
const y = interpolate(life, [0, 120], [100, -20]); // rises and recycles
const drift = noise2D(p.seed, frame / 40, 0) * 15; // smooth horizontal wander
const opacity = interpolate(life, [0, 15, 100, 120], [0, 1, 1, 0]); // fade in/out at loop seam
```

**Burst on event** (e.g. a checkmark confirming, a card "landing") —
radial particles with velocity decaying via `interpolate`'s easing rather
than looping continuously; trigger at a specific `startFrame` tied to the
event, not looped.

Keep particle counts modest (30–80) for CSS/SVG-rendered particles — each is
a DOM node re-rendered every frame; hundreds will slow the render
noticeably. For genuinely large counts, render to a `<canvas>` element and
draw imperatively per frame instead (still driven by `useCurrentFrame()`,
just not one React element per particle).

## Shape morphing

**Path morphing** — two SVG paths with the *same number of points* can be
interpolated point-by-point; `@remotion/paths`' `interpolatePath` (or
manual coordinate lerp if you control both paths) handles the general case.
Simplest reliable approach: build both shapes with the same vertex count
(e.g. two 8-point blobs) so a plain per-point `interpolate` works without a
path-flattening library.

**Liquid/blob motion** — animate an SVG `feTurbulence` filter's `seed` or
`baseFrequency` per frame for an organic, non-repeating surface distortion:

```tsx
<filter id="liquid">
  <feTurbulence type="fractalNoise" baseFrequency={0.01 + Math.sin(frame / 30) * 0.004} numOctaves={2} seed={Math.floor(frame / 6)} />
  <feDisplacementMap in="SourceGraphic" scale={18} />
</filter>
```

Note `seed` takes integers and jumping it every frame looks like noise, not
flow — step it every 4–8 frames (as above) for a smoother liquid feel.

## Fake-camera moves (2D scenes)

Remotion scenes are flat by default; these fake the sense of a moving
camera without actual 3D (see the `3d-design` skill when you need real depth):

- **Parallax** — background layer translates slower than foreground on the
  same drag/scroll value: `bgX = scrollX * 0.3`, `fgX = scrollX * 1.0`.
  Even a 2-layer version (background + one foreground element) reads as depth.
- **Ken Burns** — slow continuous scale + pan on a static image/screenshot:
  `scale: interpolate(frame, [0, duration], [1, 1.08])` combined with a slow
  `translateX/Y` drift. Never leave a static image fully still for more than
  ~2s in a fast-paced video — Ken Burns is the minimum viable fix.
- **Whip pan** — fast `translateX` (covering the full frame width in under
  10 frames) combined with a directional motion blur (`filter: blur(Npx)`
  scaled to velocity, peaking mid-pan and clearing by the end) — use as a
  transition between high-energy scenes, not as a scene-internal effect.
- **Fake dolly zoom** — scale the subject up while simultaneously scaling a
  background layer down (or vice versa) at different rates — creates a
  vertigo/emphasis effect for a single dramatic beat, not for repeated use.

## Physics-feeling procedural motion

**Follow-through / drag chains** — a parent and its children each get their
own spring, offset by a few frames, so children visibly lag and settle after
the parent:

```tsx
const parentS = spring({ frame, fps, config: { damping: 16, stiffness: 220 } });
const childS = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 200 } }); // lags 4 frames
```

**Idle/ambient motion** — small continuous noise-driven movement (not a
fixed sine loop, which reads as mechanical once you notice the period) keeps
"static" elements (a logo sitting on screen, a card at rest) from feeling frozen:

```tsx
const idleY = noise2D("idle-1", frame / 45, 0) * 4; // ±4px, non-repeating
```

**Spring config cheat sheet** (Remotion `spring()` config):
- Snappy/energetic, slight bounce: `{ damping: 12, stiffness: 260, mass: 0.6 }`
- Calm/premium, no overshoot: `{ damping: 22, stiffness: 180, mass: 0.9 }`
- Heavy/weighted (larger elements): `{ damping: 20, stiffness: 120, mass: 1.4 }`

## Guardrails

- Every technique above must still be a pure function of `frame` — no
  `Math.random()`, no `Date.now()`, no accumulating state across frames
  (compute each frame's value from `frame` directly, don't increment a
  counter in a ref).
- Reserve the highest-craft techniques (path morphing, dolly zoom, particle
  bursts) for 1–2 hero moments per video — per `motion-design`'s exaggeration
  principle, these work *because* they're rare; used on every scene they
  read as noisy rather than polished.
- Test expensive effects (large particle counts, turbulence filters, blur
  stacks) on a short frame range first — `npx remotion render <id> out.mp4
  --frames=100-160` — before committing to a full-length render.
