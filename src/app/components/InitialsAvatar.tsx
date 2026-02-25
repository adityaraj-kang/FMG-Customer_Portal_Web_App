// InitialsAvatar.tsx — Deterministic initials avatar.
// Derives a hue from the name string so the same person always
// gets the same color across every screen. Matches the vendor
// avatar pattern already established in ServiceTrackingScreen.

import { font } from "../tokens";

// ─── Helpers ─────────────────────────────────────────────────────
function nameToHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = name.charCodeAt(i) + ((h << 5) - h);
  }
  return ((h % 360) + 360) % 360;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────
interface InitialsAvatarProps {
  name:   string;
  size?:  number;
  style?: React.CSSProperties;
}

export function InitialsAvatar({ name, size = 44, style }: InitialsAvatarProps) {
  const hue     = nameToHue(name);
  const bg      = `linear-gradient(135deg, hsl(${hue},42%,17%), hsl(${hue},32%,11%))`;
  const ring    = `hsl(${hue},38%,26%)`;
  const color   = `hsl(${hue},65%,68%)`;
  const fontSize = Math.round(size * 0.34);

  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: "50%",
        background: bg,
        border: `1.5px solid ${ring}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      <span
        style={{
          color,
          fontSize,
          fontWeight: 800,
          fontFamily: font,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {getInitials(name)}
      </span>
    </div>
  );
}
