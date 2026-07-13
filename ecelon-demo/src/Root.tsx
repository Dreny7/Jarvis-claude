import React from "react";
import { Composition } from "remotion";
import { EcelonDemo, TOTAL_FRAMES } from "./EcelonDemo";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="EcelonDemo"
    component={EcelonDemo}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
);
