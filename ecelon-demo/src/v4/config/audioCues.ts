import { interpolate } from "remotion";
import { T } from "../timeline";

// Editable sound-design cue slots — every one-shot SFX in the film, in one
// place, so a real SFX pack can be dropped into public/sfx/ and re-pointed
// here without touching component code. `from`/`duration` are GLOBAL frames.
// See ASSETS_README.md for where to source a proper pack (Artlist/Epidemic/
// Uppbeat) — these are original synthesized placeholders (see scripts run
// earlier in this session), not licensed sound design.

export type SfxCue = {
  label: string;
  src: string;
  from: number;
  duration: number;
  volume: number | ((frame: number) => number);
};

const rampDown = (peak: number) => (f: number, len: number) =>
  interpolate(f, [0, len * 0.8, len], [0, peak, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const SFX_CUES: SfxCue[] = [
  // --- Act I: two riser_whoosh builds ahead of the heaviest headlines ---
  { label: "riser_whoosh @ crash day", src: "sfx/riser.wav", from: T.c3 - 10, duration: 30, volume: (f) => rampDown(0.28)(f - (T.c3 - 10), 30) },
  { label: "riser_whoosh @ wealth toll", src: "sfx/riser.wav", from: T.c8 - 10, duration: 30, volume: (f) => rampDown(0.3)(f - (T.c8 - 10), 30) },

  // --- the pivot: riser -> tape-stop -> true silence -> sub_boom on chord 1 ---
  { label: "riser_whoosh @ pivot", src: "sfx/riser.wav", from: T.slam - 66, duration: 52, volume: (f) => rampDown(0.8)(f - (T.slam - 66), 52) },
  { label: "tapestop @ pivot", src: "sfx/tapestop.wav", from: T.slam - 34, duration: 20, volume: 0.9 },
  { label: "sub_boom @ NOT ANYMORE", src: "sfx/impact.wav", from: T.slam, duration: 40, volume: 0.95 },

  // --- Act II scene boundaries ---
  { label: "ui_tick @ reveal", src: "sfx/whoosh.wav", from: T.reveal, duration: 20, volume: 0.5 },
  { label: "ui_tick @ built", src: "sfx/pop.wav", from: T.built, duration: 8, volume: 0.55 },
  { label: "ui_tick @ punch1", src: "sfx/pop.wav", from: T.punch, duration: 8, volume: 0.55 },
  { label: "ui_tick @ punch2", src: "sfx/pop.wav", from: T.punch + 16, duration: 8, volume: 0.55 },
  { label: "ui_tick @ punch3 (ignite)", src: "sfx/pop.wav", from: T.punch + 32, duration: 8, volume: 0.65 },
  { label: "ui_tick @ phone entrance", src: "sfx/whoosh.wav", from: T.phone, duration: 20, volume: 0.6 },
  { label: "ui_tick @ caption 01", src: "sfx/pop.wav", from: T.phone + 73, duration: 8, volume: 0.5 },
  { label: "ui_tick @ caption 02", src: "sfx/pop.wav", from: T.phone + 136, duration: 8, volume: 0.5 },
  { label: "ui_tick @ caption 03", src: "sfx/pop.wav", from: T.phone + 198, duration: 8, volume: 0.5 },
  { label: "ui_tick @ composer", src: "sfx/swish.wav", from: T.p1, duration: 12, volume: 0.5 },
  { label: "ui_tick @ agent desk", src: "sfx/swish.wav", from: T.agents, duration: 12, volume: 0.5 },
  { label: "ui_tick @ trust", src: "sfx/swish.wav", from: T.p2, duration: 12, volume: 0.5 },
  { label: "shimmer @ 71%", src: "sfx/shimmer.wav", from: T.p3, duration: 26, volume: 0.55 },
  { label: "ui_tick @ markets", src: "sfx/swish.wav", from: T.p4, duration: 12, volume: 0.5 },
  { label: "sub_boom @ outro lockup", src: "sfx/impact.wav", from: T.a5 + 4, duration: 30, volume: 0.4 },
  { label: "ui_tick @ outro", src: "sfx/swish.wav", from: T.a5, duration: 12, volume: 0.45 },
];
