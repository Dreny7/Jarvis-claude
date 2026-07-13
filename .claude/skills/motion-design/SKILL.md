---
name: motion-design
description: >-
  Visual and animation design principles for video — easing/timing, pacing
  rhythm, transitions, typography and color for motion, screen composition.
  Use alongside a video-authoring skill (e.g. remotion) whenever the user
  wants a video, animation, or motion graphic to look "professional",
  "polished", "cinematic", or "not like a default template" — deciding *how*
  something should move and look, as opposed to the code that makes it move.
---

# Motion design

Code makes things move; this skill decides *how* they should move so it
reads as intentional rather than default. Use it to make calls, then hand
the specifics to a video-authoring skill (e.g. `remotion`) to implement.

## Easing & timing — the single biggest "cheap vs. expensive" tell

- **Linear motion reads as cheap.** Nothing in the real world moves at a
  constant rate. Always ease.
- **Ease-out (fast start, slow settle)** for anything entering — it mimics
  something arriving with momentum and settling. This is the default choice
  for cards, text, logos appearing.
- **Ease-in (slow start, fast exit)** for anything leaving — mimics something
  accelerating away. Rarely used alone; usually the exit half of an in/out pair.
- **Springs > cubic-bezier for UI-feeling motion.** A spring with slight
  overshoot (`damping` around 12–18 relative to `stiffness` 150–260 in
  Remotion's spring config) feels alive; critically-damped springs
  (`damping` 20+) feel calm and premium. Pick overshoot for playful/consumer
  brands, no-overshoot for fintech/enterprise/premium brands.
- **Duration budget:** UI-scale motion (a card, a badge) should resolve in
  200–450ms. Hero motion (a logo build, a scene transition) can run
  600ms–1.2s. Past ~1.5s for a single beat, the viewer's attention has moved
  on — split it into stages instead.
- **Stagger, don't synchronize.** When N similar elements enter together
  (a list of cards, a row of stats), offset each by 3–6 frames (at 30fps).
  Simultaneous entry reads as a slide deck; staggered entry reads as directed.

## The 12 principles, the ones that actually matter for UI/product motion

Classic animation principles (Thomas & Johnston), filtered to what applies
outside of character animation:

1. **Anticipation** — a tiny counter-motion before the main move (a button
   compresses slightly before it "pops"). Optional for UI, valuable for a
   hero moment you want to feel weighted.
2. **Overshoot & settle** — see springs above.
3. **Follow-through / drag** — when a parent moves, children can lag a frame
   or two behind and settle after (a card's icon settles a beat after the
   card itself). Adds richness without adding attention.
4. **Staggering** — see above.
5. **Arcs** — things that move should rarely move in a dead-straight line;
   a slight curve (via combining an X and Y interpolation with offset
   timing) reads as more natural than an axis-aligned translate.
6. **Secondary action** — a subtle background element (particles, a glow
   pulse) that reinforces the primary action without competing for focus.
7. **Exaggeration** — push key beats slightly past "realistic" (a stat
   counting up should overshoot the final number by a hair and settle back,
   not stop dead) — reads as more satisfying, not less credible, in short doses.

## Pacing rhythm — cutting logic, not just per-scene animation

- **Match cut rate to information density.** A scene with one big statement
  can hold 3–5s. A scene with a list/dashboard needs 4–6s minimum for the
  eye to actually read it — don't cut a data-dense scene as fast as a title
  card. But don't pad a scene past what its content needs either — the
  moment a scene has been "read," hold for at most one more beat before
  cutting. Vary pace deliberately rather than settling into one rhythm.
- **Vary shot length.** A video where every scene is exactly 5s feels
  metronomic. Real edits breathe: short-short-long, or build acceleration
  toward a climax (start slower, get faster toward the payoff/CTA).
- **Cut on action, not on stillness.** Transition while something is still
  moving (mid-motion) rather than after it's settled — it hides the cut and
  keeps momentum. This is why a `SceneShell`-style exit that starts while the
  next scene's entrance springs are already priming feels smoother than a
  hard fade-through-black.
- **Silence/stillness is a tool, not a gap.** One deliberate 400–600ms beat
  of near-stillness right before a key reveal (product name, price, CTA)
  makes that beat land harder by contrast. Don't use it more than once or
  twice per video or it reads as sluggish.

## Typography for video (different rules than print/web)

- **Minimum readable size**: for 1080p at normal viewing distance, body text
  under ~28px effective (before any device scaling) is a gamble — most
  social platforms re-encode and compress, softening small type further.
  Headlines should be comfortably large — err bigger than a web mockup would.
- **Title-safe margins**: keep essential text inside the center ~90% of the
  frame (5% margin each side) — platforms crop for thumbnails, embeds, and
  UI chrome (captions bar, TikTok's right-side icon rail) eat the edges.
- **Weight over size for hierarchy.** Prefer a heavier weight at the same
  size to a bigger light weight — bold reads faster at a glance, which
  matters when a viewer sees each frame for under a second.
- **One idea per screen of text.** If a sentence needs to wrap to 3 lines,
  it's two beats, not one — split it across two scene beats instead.

## Color & contrast for video

- **Avoid pure #FFFFFF and pure #000000** for large areas — they clip in
  video compression and look harsh; use near-white (`#F5F5F5`–`#FAFAFA`) and
  near-black (`#050506`–`#0A0A0C`) instead. Pure flat color also reads as
  digital/synthetic — a faint noise/grain overlay or subtle gradient
  variance across a large flat area makes it feel physical rather than
  vector-flat, especially on backgrounds meant to feel atmospheric.
- **One accent color, used with intent.** If brand orange means "this is
  live/active/important," it should never appear on inert/secondary UI in
  the same scene — consistency of meaning is what makes an accent color pop,
  not just saturation.
- **Contrast drives eye path.** The brightest, most saturated point in a
  frame is where the eye goes first — deliberately place it on the thing you
  want noticed first (a CTA, the key stat), not accidentally on a decorative glow.
- **Glow/bloom is a seasoning, not a base.** Reserve heavy glow for 1–2 hero
  moments (logo reveal, key stat) — glow on every element flattens the
  hierarchy it's supposed to create.

## Transitions — pick by relationship between scenes, not by taste

- **Hard cut** — default for consecutive beats in the same visual language
  (list item to list item, stat to stat). Fastest, cleanest, doesn't call
  attention to itself.
- **Cross-dissolve/fade** — implies time passing or a soft topic shift. Slow;
  use sparingly in a fast-paced video (once, maybe, for the intro→content
  handoff or content→outro handoff).
- **Directional wipe/slide** — implies spatial/sequential relationship
  ("next in this list," "next step"). Good for feature tours. Vary the
  direction across the video (not every wipe left-to-right) or it starts
  to feel like a mechanical template rather than an edit.
- **Match cut / shared-element transition** (an element from scene A
  morphs/relocates into its position in scene B — e.g. the logo shrinking
  into a corner as the UI builds around it) — the highest-craft option,
  signals continuity and intentional design. Worth the extra implementation
  effort for at least one transition in a launch video.
- **Whip pan / zoom blur** — high energy, implies fast forward in time.
  Good between a hook scene and a fast montage; overused, it feels chaotic.

## Composition

- **Rule of thirds / center-weighting is intent, not decoration.** Centered
  compositions read as calm/authoritative (good for a logo reveal, a single
  key stat). Off-center/thirds compositions read as dynamic (good for
  feature call-outs, comparisons, anything with a clear secondary element).
- **Leave room for the platform's own chrome** on social cuts — vertical
  video especially needs headroom/footroom clear of captions and UI overlays
  the platform itself adds (see `launch-video-marketing` for platform specs).
- **Depth beats flatness.** Even in a 2D UI mockup scene, a subtle parallax
  (background moves slower than foreground, or a soft drop shadow with blur
  proportional to implied elevation) makes the frame feel dimensional instead
  of like a static screenshot with text on top.
