// GenieLogo.tsx — Official Genie G+ logomark from Figma source.
// Uses the exact SVG path from /src/imports/svg-afozofwi9h.ts.
// The filter/drop-shadow from Figma is omitted — control shadows via CSS on the parent.

import svgPaths from "../../imports/svg-afozofwi9h";

interface GenieLogoProps {
  /** Width in px — height auto-scales to preserve the 264:260 aspect ratio */
  size?: number;
  /** Fill colour — defaults to #FF4D00 brand orange */
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Natural aspect ratio from Figma viewBox (264 × 260)
const ASPECT = 260 / 264;

export function GenieLogo({
  size = 80,
  color = "#FF4D00",
  className,
  style,
}: GenieLogoProps) {
  const h = Math.round(size * ASPECT);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 264 260"
      fill="none"
      className={className}
      style={style}
    >
      <path d={svgPaths.p3b873680} fill={color} />
    </svg>
  );
}
