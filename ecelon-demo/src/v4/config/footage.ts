import { T, DUR } from "../timeline";

// Act I archival footage slots — pinned to the beats they dress. Ship EMPTY
// by default (no `src`): Act1.tsx renders its existing recreated-graphic
// treatment when a slot has no clip, and layers a graded <OffthreadVideo>
// UNDER those graphics the moment a cleared clip is dropped into
// public/archival/ and its filename set below. No component code changes
// needed either way. See ASSETS_README.md for sourcing.
//
// IMPORTANT: this build's sandbox has no network access to stock/archive
// APIs (verified — archive.org and equivalent hosts are policy-blocked from
// this container), so these slots ship empty. Wiring is done; footage is not.

export type FootageSlot = {
  key: string;
  /** what should go here — the brief for whoever sources the clip */
  descriptor: string;
  slotStart: number;
  slotEnd: number;
  kenBurns: "push" | "pull";
  /** public/archival/<file>.mp4 once cleared — leave undefined to skip */
  src?: string;
  /** pre-extracted narration, public/vo/<file>.mp3 — leave undefined to skip */
  voSrc?: string;
};

export const FOOTAGE_SLOTS: FootageSlot[] = [
  {
    key: "street-dusk",
    descriptor: "Empty suburban street / a lone 'For Sale' sign at dusk. Quiet, ambient, ominously calm.",
    slotStart: T.c1,
    slotEnd: T.c1 + DUR.c1,
    kenBurns: "push",
  },
  {
    key: "trading-floor-panic",
    descriptor: "Trading-floor panic — red boards, hands on heads. The gut-punch image; let the clip's own audio (shouting, bell) bleed under the score for a beat.",
    slotStart: T.c3,
    slotEnd: T.c3 + DUR.c3,
    kenBurns: "push",
  },
  {
    key: "bank-exit",
    descriptor: "Exterior of a failed bank; employees carrying boxes out.",
    slotStart: T.c4,
    slotEnd: T.c4 + DUR.c4,
    kenBurns: "pull",
  },
  {
    key: "press-podium",
    descriptor: "A press-conference/podium frame, treated, sitting behind the wire-headline text.",
    slotStart: T.c5,
    slotEnd: T.c5 + DUR.c5,
    kenBurns: "push",
  },
  {
    key: "foreclosure-door",
    descriptor: "THE EMOTIONAL CORE. A family, a foreclosure notice on a door, a child's empty room. Hold longest here — this is where 'almost crying' is won.",
    slotStart: T.c7,
    slotEnd: T.c7 + DUR.c7,
    kenBurns: "push",
  },
];
