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

// v5 §2E — the ~1.9 Mbps default is exactly what smooth dark gradients band
// at; CRF 16 (near-visually-lossless) + explicit high-bitrate audio fixes
// half the "banding" complaint on its own (the Grain overlay dither is the
// other half — see components/vfx.tsx).
Config.setCrf(16);
Config.setPixelFormat("yuv420p");
Config.setAudioCodec("aac");
Config.setAudioBitrate("320k");
