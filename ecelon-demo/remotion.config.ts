import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Use the container's pre-installed Chromium instead of downloading one.
Config.setBrowserExecutable(
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
);
Config.setChromiumOpenGlRenderer("angle-egl");
// Container CPUs get saturated during heavy glow/blur frames; give page-load
// delayRender calls plenty of headroom and don't oversubscribe tabs.
Config.setTimeoutInMilliseconds(180000);
Config.setConcurrency(4);
