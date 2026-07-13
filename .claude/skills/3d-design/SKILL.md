---
name: 3d-design
description: >-
  Lighting, camera, materials, asset import, and product-render conventions
  for real 3D scenes in video (via @remotion/three / React Three Fiber). Use
  alongside remotion whenever the user wants an actual 3D element — a
  spinning/turntable product shot, a 3D logo reveal, a depth-mapped hero
  scene, imported .glb/.gltf models — as opposed to CSS/SVG 2D work (use
  kinetic-animation/motion-design for that).
---

# 3D design for video

Real 3D (via `@remotion/three`, wrapping React Three Fiber) is a different
cost/quality tradeoff from the CSS/SVG techniques in `kinetic-animation` —
genuine depth, lighting, and materials, at meaningfully higher render cost.
Reach for it for hero moments (product shot, 3D logo, depth-mapped
centerpiece), not for UI mockups or text — those stay 2D.

```bash
npm i @remotion/three three @react-three/fiber @react-three/drei @types/three
# optional, for filmic post effects:
npm i @react-three/postprocessing postprocessing
```

## The non-negotiable rule: no interactivity, only frame-driven state

`OrbitControls`, mouse-drag rotation, and anything relying on user input or
wall-clock animation loops (`useFrame`'s default `clock.getElapsedTime()`)
breaks Remotion's determinism — the render must produce identical output
for the same frame number every time. Drive every camera/object property
from `useCurrentFrame()` via `interpolate`/`spring`, exactly like 2D work:

```tsx
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const rotationY = interpolate(frame, [0, fps * 5], [0, Math.PI * 2], {
  extrapolateRight: "clamp",
});
// NOT: useFrame((state) => { mesh.rotation.y += 0.01 }) — non-deterministic
```

## Lighting fundamentals

Three-point lighting translates directly and is the reliable starting point
before reaching for anything fancier:

```tsx
<ambientLight intensity={0.35} />                                  {/* fill: soft overall lift */}
<directionalLight position={[4, 5, 3]} intensity={1.4} />          {/* key: primary shadow-casting light */}
<directionalLight position={[-4, 2, -3]} intensity={0.4} color="#4488ff" /> {/* rim: separates subject from bg */}
```

- **Ambient** — no direction, just prevents pure-black shadow sides. Keep
  low (0.2–0.4) or the scene loses contrast/depth entirely.
- **Directional (key)** — the dominant light; position it off-axis (not
  straight-on) so form-defining shadows exist. Straight-on key light is why
  amateur 3D renders look flat.
- **Directional/point (rim)** — from behind/side, often a cool or brand-tinted
  color, separates the subject silhouette from the background. This is what
  makes a dark product shot on a dark background still read clearly.
- **Environment lighting (fastest path to "looks professional")** — `drei`'s
  `<Environment>` provides realistic reflections/ambient light from an HDRI
  in one line, better than hand-tuning multiple lights for reflective materials:

```tsx
import { Environment } from "@react-three/drei";
<Environment preset="studio" /> {/* also: "city", "sunset", "warehouse", "night" */}
```

## Camera & composition

```tsx
import { ThreeCanvas } from "@remotion/three";

<ThreeCanvas width={width} height={height} style={{ pointerEvents: "none" }}>
  <perspectiveCamera makeDefault fov={28} position={[0, 0.5, 6]} />
  {/* fov 20–35: tight, "product photography" compression, minimal distortion.
      fov 50–70: wide, dramatic, more foreground/background separation. */}
</ThreeCanvas>
```

- **Camera moves driven by frame**, same as any 2D pan: interpolate camera
  `position` and target (`lookAt`) across the scene's duration — an orbit is
  `position = [radius * sin(angle), y, radius * cos(angle)]` where `angle`
  comes from `interpolate(frame, ...)`, not from real-time rotation.
- **Depth of field** for a "shot on camera" feel rather than a flat 3D
  render, via `@react-three/postprocessing`:

```tsx
import { EffectComposer, DepthOfField, Bloom, Vignette } from "@react-three/postprocessing";

<EffectComposer>
  <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={3} />
  <Bloom intensity={0.4} luminanceThreshold={0.6} />
  <Vignette eskil={false} offset={0.2} darkness={0.6} />
</EffectComposer>
```

## Materials — quick reference

`meshStandardMaterial` (or `meshPhysicalMaterial` for glass/clearcoat) uses
`roughness` (0 = mirror, 1 = fully matte) and `metalness` (0 = dielectric/
plastic, 1 = metal) as the two properties that define most looks:

| Look | roughness | metalness |
|---|---|---|
| Matte plastic / product casing | 0.6–0.8 | 0 |
| Brushed metal | 0.35–0.5 | 1 |
| Polished/chrome metal | 0.05–0.15 | 1 |
| Glass (use `meshPhysicalMaterial`) | 0.05 | 0, + `transmission: 1` |
| Brand-glow accent (self-lit) | any | any, + `emissive` + `emissiveIntensity` |

```tsx
<meshStandardMaterial color="#FF5C00" roughness={0.4} metalness={0.1} emissive="#FF5C00" emissiveIntensity={0.15} />
```

## Importing external models (Blender/Spline exports)

```tsx
import { useGLTF } from "@react-three/drei";
import { staticFile } from "remotion";

const { scene } = useGLTF(staticFile("product.glb"));
<primitive object={scene} />;
```

- Export as `.glb` (binary, single-file, embeds textures) rather than
  `.gltf`+separate assets — simpler to drop in `public/`.
- Bake any looping ambient animation (idle rotation, subtle breathing scale)
  in the DCC tool only if it's meant to be truly constant; anything that
  needs to sync to the video's frame timeline (matching a beat, landing at a
  specific frame) should be driven from Remotion instead, not baked.
- `useGLTF.preload(staticFile("product.glb"))` outside the component avoids
  a load flash in `<Player>` previews (render itself waits automatically).

## Product-render conventions

- **Studio backdrop** — a large plane or `<Environment>` behind/below the
  subject in a seamless gradient (dark-to-darker, or brand-tinted) reads as
  "studio photography" instead of "3D scene with a background color."
- **Turntable** — constant angular velocity is the classic product-shot
  move: `rotationY = interpolate(frame, [0, totalFrames], [0, Math.PI * 2])`.
  For more polish, ease into the spin (spring settle) rather than starting
  at full speed immediately.
- **Contact shadow** — `drei`'s `<ContactShadows>` grounds an object far
  better than a directional-light shadow alone, especially at product-shot
  camera angles:

```tsx
import { ContactShadows } from "@react-three/drei";
<ContactShadows position={[0, -1.2, 0]} opacity={0.5} blur={2.5} far={3} />
```

## Performance guardrails

- 3D is meaningfully more expensive per frame than CSS/SVG — a full-length
  render with a complex scene and a heavy postprocessing stack (Bloom + DOF
  + Vignette together) can be an order of magnitude slower than the rest of
  a typical launch-video timeline.
- Test on a short frame range first: `npx remotion render <id> out.mp4
  --frames=0-60` before committing to the full render.
- Keep polycount and texture resolution modest for anything not
  full-frame/hero-sized — a background 3D element doesn't need the same
  fidelity as the centerpiece shot.
- If render time becomes impractical for a short 3D hero moment inside a
  longer 2D-heavy video, render that segment as its own short composition
  and composite the output via `<OffthreadVideo>` into the main timeline,
  rather than paying the 3D render cost across the whole video's duration.
- Skip `OrbitControls`/interactive camera rigs entirely — they exist for
  live apps, not for a render pipeline where every frame must be
  reproducible from `frame` alone.
