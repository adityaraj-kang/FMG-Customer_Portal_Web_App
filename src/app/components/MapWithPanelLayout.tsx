// MapWithPanelLayout.tsx — Responsive two-column layout for map screens.
// Desktop: map fills left column, panel appears in right column.
// Mobile: renders children directly (each screen handles its own mobile layout).

import { T } from "../tokens";

interface MapWithPanelLayoutProps {
  /** The full-bleed map content — should fill 100% of its container */
  mapContent: React.ReactNode;
  /** The panel content shown on the right on desktop */
  panelContent: React.ReactNode;
  /** Width of the right panel in px (default: 420) */
  panelWidth?: number;
}

export function MapWithPanelLayout({
  mapContent,
  panelContent,
  panelWidth = 420,
}: MapWithPanelLayoutProps) {
  return (
    <div
      style={{
        height: "100svh",
        display: "grid",
        gridTemplateColumns: `1fr ${panelWidth}px`,
        backgroundColor: T.bg,
      }}
    >
      {/* Left: full-bleed map column */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {mapContent}
      </div>

      {/* Right: scrollable panel */}
      <div
        style={{
          borderLeft: `1px solid ${T.border}`,
          backgroundColor: T.bg,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {panelContent}
      </div>
    </div>
  );
}
