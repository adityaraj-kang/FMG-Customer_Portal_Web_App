// ─── Theme-aware design tokens ──────────────────────────────────
// Values resolve at runtime via CSS custom properties defined in
// /src/styles/index.css.  Toggle between .theme-dark / .theme-light
// on the phone shell container.

export const T = {
  bg:              "var(--dc-bg)",
  surface:         "var(--dc-surface)",
  surfaceElevated: "var(--dc-surface-elevated)",
  textPrimary:     "var(--dc-text-primary)",
  textSecondary:   "var(--dc-text-secondary)",
  textTertiary:    "var(--dc-text-tertiary)",
  border:          "var(--dc-border)",
  divider:         "var(--dc-divider)",
  cta:             "#FF4D00",
  ctaTint:         "var(--dc-cta-tint)",
  success:         "var(--dc-success)",
  successTint:     "var(--dc-success-tint)",
  navActive:       "var(--dc-nav-active)",
  navInactive:     "var(--dc-nav-inactive)",
  // Transparent overlays that flip between white-based and black-based
  glassOverlay:    "var(--dc-glass-overlay)",
  glassBorder:     "var(--dc-glass-border)",
  homeIndicator:   "var(--dc-home-indicator)",
  shellBg:         "var(--dc-shell-bg)",
  statusFill:      "var(--dc-status-fill)",
} as const;

export const font = "'DM Sans', sans-serif";

// ─── HIG Corner Radii (pt) ────────────────────────────────────
export const R = {
  xs:   6,    // small chips/badges
  sm:   10,   // inputs, form fields
  md:   12,   // cards, buttons, tiles
  lg:   16,   // sheets, large cards
  xl:   22,   // large panels
  full: 9999, // pills
} as const;

// ─── HIG Layout Constants (pt / px at 1×) ────────────────────
export const HIG = {
  statusBarHeight: 59,   // iPhone 15 Pro status bar safe area
  tabBarHeight:    49,   // Tab bar content area (excl. bottom safe area)
  safeAreaBottom:  34,   // Home indicator / bottom safe area
  minTapTarget:    44,   // Minimum interactive element size
  screenMargin:    16,   // Standard horizontal content margin
  listRowMin:      44,   // Minimum list row height
} as const;

// ─── HIG Type Scale (pt) ──────────────────────────────────────
export const TYPE = {
  largeTitle: 34,  // h1, screen greetings
  title1:     28,  // title wordmarks
  title2:     22,  // section title
  title3:     20,  // section headers
  headline:   17,  // emphasized body
  body:       17,  // primary body
  callout:    16,  // secondary body
  subhead:    15,  // subheading, input text
  footnote:   13,  // captions, timestamps
  caption1:   12,  // small labels
  caption2:   11,  // smallest labels, tab bar (HIG spec: 10)
  tabLabel:   10,  // tab bar labels per HIG
} as const;