---
name: footage-libraries
description: >-
  Find and pull real, licensed/reusable video clips from stock and
  public-domain footage libraries (Pexels, Pixabay, Coverr, Internet
  Archive/Prelinger, Storyblocks, Shutterstock, Getty, Adobe Stock) via their
  APIs, then drop them into an edit. Use when the user wants ready-made
  cinematic b-roll or stock clips — "get footage of a trading floor", "find
  city drone shots", "b-roll library", a specific mood/aesthetic — as the
  base layer under Remotion graphics. NOT for reusing copyrighted Hollywood
  movie clips (see the licensing section — that's infringement, not available).
---

# Footage libraries

Access to libraries of real, **reusable** video clips — the legitimate
version of "a library of movie clips I can drop in." These sit in the same
slot as `ai-video-generation`: both provide the live-action base footage that
Remotion graphics composite over. The difference: generation invents a novel
shot; a footage library retrieves a real one someone already filmed and
cleared for reuse.

## The licensing reality — read this first

**You cannot legally reuse clips from copyrighted films** (Wolf of Wall
Street, any studio movie/TV show) in your own videos — especially commercial
ones like a product launch. Those are owned by studios; no API licenses them
for reuse, and "I found it online" is not a license. Sites that let you
*search* movie dialogue/scenes (getyarn, Playphrase, TMDB, clip supercuts on
YouTube) are for reference and discovery — pulling those frames into an ad is
infringement regardless of where you found them. This skill does not do that
and won't help do that.

**What you actually want** when you ask for "Wolf of Wall Street clips" is
usually the *aesthetic* — the high-energy trading floor, champagne-and-suits
hustle, chest-thumping ambition. Get that legally three ways:
1. **Licensed stock** that matches the vibe (a real filmed trading-floor
   b-roll clip, cleared for commercial use) — this skill.
2. **AI-generated footage** describing the vibe in your own words — the
   `ai-video-generation` skill. Describe the energy, don't copy the film.
3. **Film your own** — the only way to get literal bespoke footage you fully own.

Always confirm each clip's specific license before shipping a paid campaign —
"free" libraries still have terms (attribution, no-resale, model-release
limits for recognizable people), and commercial libraries differentiate
editorial-only vs. commercial-use licenses.

## The libraries

### Free / commercial-use-cleared

| Library | API | Content | License notes |
|---|---|---|---|
| **Pexels** | `api.pexels.com` (SDK: `pexels`) | Modern 4K b-roll, lifestyle, tech, nature | Free, commercial use, no attribution required (attribution appreciated) |
| **Pixabay** | `pixabay.com/api/` (SDK: `pixabay-api`) | Broad b-roll, motion backgrounds | Free, Pixabay license (commercial ok; some content restrictions) |
| **Coverr** | `coverr.co` API | Curated cinematic b-roll, loops | Free, commercial use |
| **Videvo / Mixkit** | REST / download | Mixed free + premium b-roll & motion graphics | Check per-clip license tier |

### Public domain / archival (genuinely old *film* footage, cleared by age)

| Library | API | Content |
|---|---|---|
| **Internet Archive** | `archive.org` Advanced Search + item metadata API | Vast public-domain film, newsreels, Prelinger Archives (ephemeral/industrial films), archival cinema |
| **NASA / gov archives** | various REST | Space, science, aerial — public domain |

Public-domain archival is the closest *legitimate* thing to "old movie
clips" — genuinely out-of-copyright cinema and newsreel footage you can reuse
freely. Great for a vintage/retro aesthetic; not a substitute for a specific
modern copyrighted film.

### Commercial (subscription/licensed, API access, higher production value)

| Library | Notes |
|---|---|
| **Storyblocks** | Subscription, unlimited-download model, partner API |
| **Artgrid** | Cinematic, filmmaker-grade; licensing per plan |
| **Shutterstock** | Huge catalog, API (SDK: `shutterstock-api`), per-clip or subscription |
| **Getty / iStock** | Premium + editorial; API for enterprise |
| **Adobe Stock** | Integrated with Creative Cloud; API available |

## The universal pattern: search → pick → download → `public/`

Like the other footage skills, this is a **build step** — a script that
fetches clip files into `public/clips/`, not an API call inside a rendered
component.

```
search(query, filters) -> results[]
pick best result (resolution, orientation, license, relevance)
download(result.videoFile.url) -> public/clips/trading-floor.mp4
```

### Example: Pexels (free, cleared for commercial use)

```ts
// scripts/fetch-footage.ts — a BUILD script (run with tsx), not a component
import { createClient } from "pexels";
import { writeFile } from "node:fs/promises";

const client = createClient(process.env.PEXELS_API_KEY!);

const res = await client.videos.search({
  query: "busy stock trading floor traders",
  orientation: "landscape",
  size: "large", // prefer HD/4K sources
  per_page: 15,
});

if ("videos" in res) {
  const clip = res.videos[0];
  // pick the highest-res .mp4 file offered for this clip
  const file = clip.video_files
    .filter((f) => f.file_type === "video/mp4")
    .sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0];
  const buf = Buffer.from(await (await fetch(file.link)).arrayBuffer());
  await writeFile("public/clips/trading-floor.mp4", buf);
  console.log("saved", clip.url, "by", clip.user.name); // keep for attribution/records
}
```

### Example: Pixabay (REST)

```ts
const url = new URL("https://pixabay.com/api/videos/");
url.searchParams.set("key", process.env.PIXABAY_API_KEY!);
url.searchParams.set("q", "city skyline night drone");
url.searchParams.set("per_page", "20");
const data = await (await fetch(url)).json();
const hit = data.hits[0];
const link = hit.videos.large?.url ?? hit.videos.medium.url;
// fetch(link) -> save to public/clips/
```

### Example: Internet Archive (public-domain film)

```ts
// Advanced Search for public-domain film items, then resolve the item's files.
const q = encodeURIComponent('subject:"trading" AND mediatype:movies AND licenseurl:*publicdomain*');
const search = await (await fetch(
  `https://archive.org/advancedsearch.php?q=${q}&fl[]=identifier&rows=10&output=json`,
)).json();
const id = search.response.docs[0].identifier;
const meta = await (await fetch(`https://archive.org/metadata/${id}`)).json();
const mp4 = meta.files.find((f: any) => f.name.endsWith(".mp4"));
const link = `https://archive.org/download/${id}/${encodeURIComponent(mp4.name)}`;
// fetch(link) -> save to public/clips/ ; re-verify the item's rights statement first
```

## Choosing a clip well

- **Resolution & orientation** must match the target format (see
  `remotion`'s `reference/multi-format.md`) — grab landscape 4K for a 16:9
  hero, vertical for social; don't upscale a small clip.
- **Prefer clips with room for graphics** — negative space, a clean sky, a
  soft-focus area — so Remotion text/UI has somewhere legible to sit.
- **Watch the framerate.** Mixing 24/25/30fps sources into a 30fps
  composition can judder; Remotion resamples via `<OffthreadVideo>`, but a
  clip whose native fps matches the comp is cleanest.
- **Log attribution as you go** — even no-attribution-required libraries are
  worth crediting, and commercial ones require keeping license/download
  records. Save the source URL + author next to each downloaded clip.

## Compositing into the edit

Identical to generated footage — bring clips in with `<OffthreadVideo>`,
trim to the exact frame count, color-match to the palette, and scrim under
any overlaid text (full detail and code in `ai-video-generation`'s
compositing section):

```tsx
<OffthreadVideo src={staticFile("clips/trading-floor.mp4")} trimBefore={30} trimAfter={120} />
```

Stock and AI-generated footage mix freely in one timeline — a stock hero
shot, a generated impossible-shot, and code-drawn Remotion graphics can all
be graded to feel like one piece.

## Guardrails

- **No copyrighted film/TV clips.** This skill is for licensed/public-domain/
  cleared libraries only. If the ask is literally "clips from <copyrighted
  movie>," the answer is the aesthetic-via-stock-or-generation route above,
  not the actual film.
- **Verify the specific license per clip** before a paid campaign — library
  defaults vary and some individual clips carry editorial-only or
  model-release restrictions even within a "free" library.
- **Fetching is a build step;** components only read the downloaded files.
- **Commit the chosen clips** so re-renders don't re-hit the API (and so a
  catalog change upstream can't alter your locked edit).
- **Recognizable people/brands/trademarks** in stock footage may still need
  releases for commercial use even when the clip's base license is
  commercial — check the clip's model/property-release status.

## Where this sits

- `footage-libraries` (this) — retrieve real, cleared clips.
- `ai-video-generation` — generate a novel shot when no stock clip fits (or
  to legally hit a specific film's *look* without its footage).
- `3d-design` — render exact product/brand geometry stock can't provide.
- `remotion` — composite all of the above with graphics; `motion-design`,
  `kinetic-animation`, `video-sound-design`, `launch-video-marketing` shape
  how it moves, sounds, and is structured.
