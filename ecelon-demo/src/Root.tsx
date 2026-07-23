import React from "react";
import { Composition } from "remotion";
import { EcelonDemo, TOTAL_FRAMES } from "./EcelonDemo";
import { EcelonDemoV4, V4_TOTAL_FRAMES } from "./v4/EcelonDemoV4";
import { EcelonUI, UI_TOTAL } from "./ui/EcelonUI";
import { EcelonLaunch, LAUNCH_TOTAL } from "./ui/EcelonLaunch";
import { EcelonRebuild, REBUILD_TOTAL } from "./ui/EcelonRebuild";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="EcelonRebuild"
      component={EcelonRebuild}
      durationInFrames={REBUILD_TOTAL}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="EcelonLaunch"
      component={EcelonLaunch}
      durationInFrames={LAUNCH_TOTAL}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="EcelonUI"
      component={EcelonUI}
      durationInFrames={UI_TOTAL}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="EcelonDemoV4"
      component={EcelonDemoV4}
      durationInFrames={V4_TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="EcelonDemo"
      component={EcelonDemo}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
