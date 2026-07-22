// EcelonUI — 30fps, 120 BPM (beat = 15f, bar = 60f). 1320f = 44.0s.
// Scene starts are snapped to the music's section boundaries so every cut
// lands on a beat and the drop (agent-alive) hits on a bar downbeat.

export const FPS = 30;
export const BEAT = 15;

export const S = {
  dashboard: 0, //   cold open — the desk
  ignite: 120, //    light rays + "Let's create your agent"
  s1: 180, //        choose kind
  s2: 255, //        name (typing)
  s3: 330, //        write strategy (typing money shot)
  s4: 435, //        risk level
  s5: 495, //        mode & capital
  s6: 555, //        review
  s7: 615, //        clarifying questions
  s8: 690, //        hold to deploy
  logic: 795, //     DROP — agent logic node graph (wires pulse)
  graph: 915, //     trading graph (candles build)
  activity: 1035, // decision log
  consult: 1095, //  consulting chat
  feed: 1170, //     social feed
  outro: 1230, //    search → ecelon.ai → join the waitlist
  end: 1320,
} as const;

export const D = {
  dashboard: S.ignite - S.dashboard,
  ignite: S.s1 - S.ignite,
  s1: S.s2 - S.s1,
  s2: S.s3 - S.s2,
  s3: S.s4 - S.s3,
  s4: S.s5 - S.s4,
  s5: S.s6 - S.s5,
  s6: S.s7 - S.s6,
  s7: S.s8 - S.s7,
  s8: S.logic - S.s8,
  logic: S.graph - S.logic,
  graph: S.activity - S.graph,
  activity: S.consult - S.activity,
  consult: S.feed - S.consult,
  feed: S.outro - S.feed,
  outro: S.end - S.outro,
} as const;
