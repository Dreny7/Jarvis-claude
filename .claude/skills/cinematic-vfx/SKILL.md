---
name: cinematic-vfx
description: >-
  Film-look post-processing and visual effects — color grading/LUT-style
  grading, film grain, lens flares/light leaks, chromatic aberration,
  vignette, glitch/RGB-split, motion blur, speed ramping, screen shake,
  bloom/glow, letterboxing. Use alongside remotion whenever the user wants a
  video to look more "cinematic," "filmic," "polished," wants a specific
  post-processing effect, or references a movie/trailer's *look* (grading,
  grain, flares) as opposed to its actual footage (see
  shot-recreation-workflow / footage-libraries for that distinction).
---

# Cinematic VFX

Screen-space post-processing effects — the layer applied *over* a finished
composition (Remotion graphics, stock footage, or AI-generated clips alike)
to make it read as filmic rather than flat digital. These are full-frame
effects, distinct from `3d-design`'s in-scene 3D lighting/materials and
`kinetic-animation`'s per-element motion recipes.

All effects here are pure functions of `frame` — deterministic, no
`Math.random()`, same guardrail as everywhere else in this skill family.

## Color grading

**CSS filter stack** — cheapest, good for broad mood shifts:

```tsx
<AbsoluteFill
  style={{
    filter: "contrast(1.12) saturate(1.15) brightness(0.97) sepia(0.06)",
  }}
>
  {children}
</AbsoluteFill>
```

**SVG `feColorMatrix`** — real per-channel control (closer to an actual
LUT), lets you push shadows/highlights toward different hues (e.g. teal
shadows / orange highlights, the most common commercial grade):

```tsx
<svg style={{ position: "absolute", width: 0, height: 0 }}>
  <filter id="teal-orange">
    <feColorMatrix
      type="matrix"
      values="1.08 0 0.05 0 0.02
              0 1.0 0 0 0
              0.02 0 0.95 0 -0.02
              0 0 0 1 0"
    />
  </filter>
</svg>
<AbsoluteFill style={{ filter: "url(#teal-orange)" }}>{children}</AbsoluteFill>
```

Iterate the matrix values empirically — push R up / B down in the last
column's row for warm highlights, the reverse for cool shadows.

## Film grain

Generate deterministic per-frame noise (not a static overlay image, which
reads as an obvious repeating texture) using `@remotion/noise` sampled at a
resolution coarser than the frame, then upscaled — real grain is high-frequency,
your Perlin sample should look like it, not like smooth static:

```tsx
import { noise3D } from "@remotion/noise";

const GrainOverlay: React.FC<{ intensity?: number }> = ({ intensity = 0.06 }) => {
  const frame = useCurrentFrame();
  // cheap approach: an SVG feTurbulence re-seeded per frame, blended "overlay"
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "overlay", opacity: intensity }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} seed={frame % 8} stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.3 0.3 0.3 0 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
};
```

Keep `seed` cycling through a small integer range (not incrementing forever)
so it stays deterministic and doesn't drift; `mixBlendMode: "overlay"` at low
opacity (0.04–0.10) is enough — heavier reads as damaged film, not premium.

## Lens flares & light leaks

Two approaches:
1. **Overlay footage** — free light-leak/flare overlay packs (search via
   `footage-libraries`, filtered for "light leak overlay" / "lens flare
   overlay," usually shot on black for `mix-blend-mode: "screen"` compositing):

```tsx
<OffthreadVideo src={staticFile("overlays/light-leak-01.mp4")} style={{ mixBlendMode: "screen", opacity: 0.5 }} />
```

2. **Procedural flare** — a radial gradient burst positioned at a "light
   source" point, driven by `frame` (e.g. tracking across the screen or
   pulsing at a beat):

```tsx
const flareX = interpolate(frame, [0, 60], [10, 90]); // % across frame
<div
  style={{
    position: "absolute",
    left: `${flareX}%`,
    top: "30%",
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,220,180,0.8) 0%, rgba(255,180,100,0.2) 40%, transparent 70%)",
    mixBlendMode: "screen",
    transform: "translate(-50%, -50%)",
  }}
/>;
```

Use sparingly — one flare sweep per video reads as a deliberate signature
moment; flares on every scene read as a preset slapped on everything.

## Chromatic aberration

Offset R/G/B channels a few pixels — subtle version reads as an anamorphic
lens; heavy version reads as glitch (see below):

```tsx
<AbsoluteFill>
  <AbsoluteFill style={{ filter: "url(#isolate-red)", transform: "translateX(-2px)", mixBlendMode: "screen" }}>{children}</AbsoluteFill>
  <AbsoluteFill style={{ filter: "url(#isolate-green)", mixBlendMode: "screen" }}>{children}</AbsoluteFill>
  <AbsoluteFill style={{ filter: "url(#isolate-blue)", transform: "translateX(2px)", mixBlendMode: "screen" }}>{children}</AbsoluteFill>
</AbsoluteFill>
```

Define `isolate-red/green/blue` as `feColorMatrix` filters zeroing the other
two channels. 1–2px offset = subtle cinematic lens character; 8px+ = glitch effect.

## Vignette

Standard depth/focus cue — radial darkening toward the edges (already used
in the `remotion` skill's `Background` pattern):

```tsx
<AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
```

## Glitch / RGB-split (digital, not filmic — for tech/energetic brands)

Combine heavier chromatic aberration with brief horizontal slice
displacement, triggered only on specific frames (an accent, not continuous):

```tsx
const GLITCH_FRAMES = [45, 46, 130, 131]; // exact beats it fires
const isGlitching = GLITCH_FRAMES.includes(frame);
const sliceOffset = isGlitching ? noise2D("glitch", frame, 0) * 20 : 0;

<AbsoluteFill style={{ clipPath: isGlitching ? `inset(${30 + sliceOffset}% 0 ${40 - sliceOffset}% 0)` : undefined, transform: isGlitching ? `translateX(${sliceOffset}px)` : undefined }}>
  {children}
</AbsoluteFill>;
```

Fire glitch on discrete frames tied to a beat/cut, never as a continuous
per-frame wobble — continuous glitch reads as a broken render, not a style choice.

## Motion blur

`@remotion/motion-blur` (verified package, real exports `Trail` and
`CameraMotionBlur`) — handles the hard part (compositing multiple sub-frame
samples) for you:

```bash
npm i @remotion/motion-blur
```

```tsx
import { CameraMotionBlur, Trail } from "@remotion/motion-blur";

// Blurs based on how fast content is actually moving frame-to-frame —
// use around fast pans/whip transitions.
<CameraMotionBlur shutterAngle={180} samples={5}>
  <MyFastMovingScene />
</CameraMotionBlur>

// Ghost-trail effect (layered semi-transparent past frames) — good for a
// fast-moving logo or particle burst.
<Trail layers={6} lagInFrames={2} trailOpacity={0.7}>
  <LogoMark />
</Trail>
```

`shutterAngle` mimics a real camera's shutter (180° is the traditional
"natural" film look; lower = crisper/more stroboscopic, higher = dreamier).
`samples` trades render time for smoothness — 5–8 is a reasonable default;
raise it only for very fast motion where banding is visible.

## Speed ramping (on video clips)

True variable-speed playback of a video source means remapping which source
frame you request per output frame — drive a nonlinear curve into
`<OffthreadVideo>`'s trim/seek rather than its native constant rate:

```tsx
const rampedSourceFrame = Math.floor(
  interpolate(frame, [0, 30, 60, 90], [0, 15, 60, 75], {
    // slow (0-15 over 30 frames) -> fast (15-60 over 30 frames) -> slow again
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }),
);
<OffthreadVideo src={staticFile("clips/hero.mp4")} startFrom={rampedSourceFrame} endAt={rampedSourceFrame + 1} />;
```

This is an approximation (frame-stepping, not true optical-flow
interpolation) — fine for short accents, not for a slow-motion hero shot
needing buttery smoothness (for that, use a source clip already shot/
generated at high frame rate and slow the mapping down, giving more source
frames per output frame).

## Screen shake / impact

Small deterministic positional jitter on a hit frame — noise-driven, decaying:

```tsx
const IMPACT_FRAME = 120;
const sinceImpact = frame - IMPACT_FRAME;
const shake =
  sinceImpact >= 0 && sinceImpact < 12
    ? interpolate(sinceImpact, [0, 12], [1, 0]) * 8
    : 0;
const shakeX = noise2D("shake-x", frame, 0) * shake;
const shakeY = noise2D("shake-y", frame, 1) * shake;
<AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>{children}</AbsoluteFill>;
```

## Letterboxing / aspect crop

Black bars for a cinematic 2.39:1 feel inside a 16:9 frame — static
overlay, purely compositional:

```tsx
<AbsoluteFill style={{ justifyContent: "space-between" }}>
  <div style={{ height: "11.5%", backgroundColor: "#000" }} />
  <div style={{ height: "11.5%", backgroundColor: "#000" }} />
</AbsoluteFill>
```

Reserve for a genuinely cinematic hero moment — letterboxing an entire fast-
cut launch video sacrifices real screen area for a stylistic cue that reads
best used sparingly (e.g. one slow-motion beat).

## Combining effects — order matters

Apply in roughly this order (innermost to outermost) so each effect acts on
what a viewer would expect it to: **content → color grade → chromatic
aberration/glitch (if any) → grain → vignette → letterbox (if any)**. Grain
and vignette should be the outermost layers — they're "camera/print"
artifacts that sit on top of everything, including any lens-level color work.

## Guardrails

- Every effect is a pure function of `frame` — no accumulating state, no
  real randomness.
- Effects are seasoning, not the dish — per `motion-design`'s glow guidance,
  reserve grain/flare/glitch/letterbox for hero moments and a consistent
  subtle base (light grain, light vignette) rather than stacking everything
  everywhere.
- Test expensive effects (motion blur with high `samples`, per-pixel canvas
  grain at full resolution) on a short frame range first
  (`--frames=100-160`) — they meaningfully add render time.
- These are display-layer effects on top of what's already there — pick
  them after the shot/edit is locked (per `shot-recreation-workflow` /
  `launch-video-marketing`), not as a substitute for good footage or pacing.
