import { T } from "../timeline";

// Act II beat grid — drives glow pulses, scale-breaths, and number
// theatrics so accents land ON the music rather than at arbitrary frames.
// Measured from the source track: the big onsets (chord/drum hits already
// pinned in timeline.ts) recur roughly every 31 frames, i.e. a quarter-note
// beat of ~15.5f (~116 BPM). This grid runs for the whole beat-locked
// section (T.slam → T.end) so any Act II element can subscribe to it.

export const BEAT_PERIOD = 15.5;

/** 0 at each beat, ramping toward 1 just before the next. */
export const beatPhase = (frame: number): number => {
  const t = (((frame - T.slam) % BEAT_PERIOD) + BEAT_PERIOD) % BEAT_PERIOD;
  return t / BEAT_PERIOD;
};

/** 0..1 pulse — snaps to 1 ON the beat, decays exponentially before the next. */
export const beatPulse = (frame: number, decay = 3.2): number => {
  if (frame < T.slam) return 0;
  return Math.exp(-beatPhase(frame) * decay);
};

/** Every 4th beat (a "bar") — for slower accents like a scale-breath. */
export const barPulse = (frame: number, decay = 2.4): number => {
  if (frame < T.slam) return 0;
  const period = BEAT_PERIOD * 4;
  const t = (((frame - T.slam) % period) + period) % period;
  return Math.exp(-(t / period) * decay);
};
