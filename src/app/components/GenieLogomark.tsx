// GenieLogomark.tsx — Thin wrapper around GenieLogo for backward compatibility.
// Previously a hand-drawn lamp SVG; now uses the official Figma logomark.

import { GenieLogo } from "./GenieLogo";

export function GenieLogomark({ size = 80 }: { size?: number }) {
  return <GenieLogo size={size} color="#FF4D00" />;
}
