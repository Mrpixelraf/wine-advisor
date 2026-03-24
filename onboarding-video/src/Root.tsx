import React from "react";
import { Composition } from "remotion";
import { OnboardingVideo } from "./OnboardingVideo";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="OnboardingVideo"
      component={OnboardingVideo}
      durationInFrames={1650} // 55s @ 30fps
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
