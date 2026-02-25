import { T, font, HIG } from "../tokens";

export function SharedStatusBar() {
  return (
    // Total height = HIG.statusBarHeight (59px) so all content below
    // clears the Dynamic Island (top:11, h:37 → bottom at y:48).
    // Items sit in the "ears" beside the DI at paddingTop:14.
    <div
      style={{
        height: HIG.statusBarHeight,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: `14px ${HIG.screenMargin}px 0`,
        fontFamily: font,
        flexShrink: 0,
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Time — left ear */}
      <span
        style={{
          color: T.textPrimary,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: "20px",
        }}
      >
        9:41
      </span>

      {/* Status icons — right ear (use currentColor for theme-awareness) */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 1, color: T.statusFill }}>
        {/* Cell Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0"    y="6.5"  width="2.8" height="5.5"  rx="0.7" fill="currentColor" />
          <rect x="4.2"  y="4"   width="2.8" height="8"   rx="0.7" fill="currentColor" />
          <rect x="8.4"  y="1.5" width="2.8" height="10.5" rx="0.7" fill="currentColor" />
          <rect x="12.6" y="0"   width="2.8" height="12"  rx="0.7" fill="currentColor" fillOpacity="0.35" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <circle cx="8" cy="10.5" r="1.5" fill="currentColor" />
          <path d="M4.8 7.6a4.5 4.5 0 016.4 0"  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M2.2 5a7.8 7.8 0 0111.6 0"   stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        </svg>
        {/* Battery */}
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="22" height="12" rx="2.5" stroke="currentColor" strokeOpacity="0.35" />
          <rect x="2"   y="2"   width="16" height="9"  rx="1.5" fill="currentColor" />
          <path d="M23.5 4.3v4.4a2 2 0 000-4.4z" fill="currentColor" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
