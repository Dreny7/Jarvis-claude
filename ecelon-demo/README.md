# Ecelon Demo V3 (Remotion)

A faster, sleeker rebuild of the Ecelon product demo video, written with
[Remotion](https://remotion.dev). 38 seconds (down from 54), 1920×1080 @ 30fps.

## What changed vs V2

- **Pacing**: every scene trimmed; snappy spring entrances (high stiffness,
  low mass), staggered card pops, quick push transitions between scenes.
- **Components**: redesigned glass cards (consistent radius, hairline borders,
  top sheen), pill status badges with pulsing dots, gradient icon tiles, a
  cleaner phone mockup, and an orbiting broker ring with real depth sorting.
- **Orange**: hotter palette (`#FF5C00` core, `#FF7B24` highlight) on a
  true-black stage with saturated glows — no muddy brown wash.

## Structure

- `src/EcelonDemo.tsx` — scene timeline + music track
- `src/scenes/` — Intro, Hook, Agents, Strategy, Phone, Brokers, Signals, Outro
- `src/components/` — Background, Logo, Headline, ui (SceneShell/Pop/GlassCard/badges), icons
- `src/theme.ts` — design tokens
- `public/music.m4a` — soundtrack (carried over from the original video)
- `public/fonts/` — Inter (bundled locally so headless renders need no network)

## Commands

```bash
npm install
npx remotion studio          # preview
npm run render               # renders out/EcelonDemoV3.mp4
```

`remotion.config.ts` points at this container's Chromium headless shell; adjust
`Config.setBrowserExecutable` (or remove it) on other machines.
