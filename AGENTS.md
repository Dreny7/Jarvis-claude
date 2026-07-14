# Repo guide for coding agents (Codex, etc.)

This repo builds **Ecelon V4**, an ~80s launch video for Ecelon (an
AI-agent trading platform), as a **Remotion** (React/TypeScript) project in
`ecelon-demo/`. It was developed with Claude Code across several revisions;
`.claude/skills/` holds ten reference skills written during that work —
plain markdown, no Claude-specific tooling required to read them. This file
is the Codex-native entry point: Codex auto-loads `AGENTS.md` files, so
everything below (and everything they point to) is available without the
user re-pasting context each session.

## Project layout

```
ecelon-demo/
  src/v4/
    timeline.ts        # master frame map — every beat's timing, single source of truth
    theme.ts            # brand tokens (strict white/orange/near-black palette)
    EcelonDemoV4.tsx     # root composition: score, SFX, the pivot transition
    scenes/              # Act1 (crash) → Intro (pivot) → Phone → Act4 (product) → Act5 (outro)
    components/          # crash.tsx, aged.tsx, ios.tsx, FacetMark.tsx, text.tsx, vfx.tsx
    config/               # agents.ts (roster), beatmap.ts, audioCues.ts, footage.ts — edit these, not scattered literals
  public/                 # way.mp3, hth.mp3, sfx/, fonts/, archival/ (empty slots), vo/ (empty slots)
  ASSETS_README.md        # asset manifest + footage/music licensing notes — read before touching audio/footage
  SUBTITLES-PLAN.md       # the Act I crash narration script + Act II caption guidance, timecoded
  remotion.config.ts      # CRF 16, 320k AAC — the anti-banding export settings
```

Render with `npx remotion render EcelonDemoV4 out/video.mp4` from
`ecelon-demo/` (needs `npm install` first; `node_modules/` and `out/` are
gitignored).

## Skills index (`.claude/skills/`)

Each is a `SKILL.md` (plus a `reference/` folder for some). Read the
relevant one **before** starting related work — they encode conventions and
guardrails specific to this project, not generic advice.

| Skill | Path | Use when |
|---|---|---|
| **remotion** | `.claude/skills/remotion/SKILL.md` | Any composition/scene/animation code — mental model, `Sequence`/`Series`, common pitfalls. Has a `reference/` subfolder (audio-reactive, voiceover-captions, multi-format, advanced-visuals). |
| **motion-design** | `.claude/skills/motion-design/SKILL.md` | Deciding *how* something should move/look — easing, pacing rhythm, transitions, typography/color for motion. |
| **kinetic-animation** | `.claude/skills/kinetic-animation/SKILL.md` | Concrete effect recipes: kinetic typography, particle systems, shape morphing, fake-camera moves (parallax/Ken Burns/whip pan). |
| **cinematic-vfx** | `.claude/skills/cinematic-vfx/SKILL.md` | Screen-space post effects: color grading, film grain (also the anti-banding fix — see `components/vfx.tsx`), lens flares, chromatic aberration, glitch, motion blur, vignette. |
| **3d-design** | `.claude/skills/3d-design/SKILL.md` | Real 3D via `@remotion/three` — lighting, camera, materials, `.glb` import, turntable/product-render shots. |
| **video-sound-design** | `.claude/skills/video-sound-design/SKILL.md` | Music, mixing/ducking, SFX on cuts, loudness mastering (`loudnorm` target -14 LUFS). |
| **launch-video-marketing** | `.claude/skills/launch-video-marketing/SKILL.md` | Narrative structure, retention psychology, CTA placement — the *what to say and when*, not the visuals. |
| **footage-libraries** | `.claude/skills/footage-libraries/SKILL.md` | Sourcing real, licensed/public-domain b-roll (Pexels, Pixabay, Internet Archive) for the empty `public/archival/` slots — see the licensing section before pulling anything in. |
| **ai-video-generation** | `.claude/skills/ai-video-generation/SKILL.md` | Generating novel AI video clips (Veo/Sora/Runway/etc.) as a base layer under Remotion graphics. |
| **shot-recreation-workflow** | `.claude/skills/shot-recreation-workflow/SKILL.md` | Turning a reference video's *look* into an original, legally clean shot list — never its actual footage. |

## Hard constraints — do not relax these without asking

- **Palette is white / orange / near-black only** — no green, red, blue, or
  purple anywhere (`theme.ts` is the single source; extend it, don't
  hardcode new colors in components).
- **No copyrighted footage.** `public/archival/` and `public/vo/` slots
  (wired in `config/footage.ts`) ship empty on purpose — this sandbox has
  no network access to stock/archive APIs, and broadcast news / studio film
  clips are not cleared for use regardless of source. See
  `ASSETS_README.md` §Footage before adding anything there.
- **Two commercial music tracks are temp/reference only** (`way.mp3`,
  `hth.mp3`) — Act II's entire timeline is beat-mapped to specific onsets
  in `hth.mp3` (documented in `timeline.ts`). Swapping the track requires
  re-analyzing its beat grid and rebuilding the frame map, not just
  dropping in a new file.
- **All animation is a pure function of `useCurrentFrame()`** — no
  `setTimeout`/`Date.now()`/`Math.random()` in rendered components; render
  must be deterministic frame-to-frame.
- **Fonts load via data-URI `@font-face` injection** (`src/v4/font.ts`),
  not `@remotion/google-fonts` or a live `<link>` — live font fetches hang
  `delayRender()` in this sandboxed/offline render environment.
