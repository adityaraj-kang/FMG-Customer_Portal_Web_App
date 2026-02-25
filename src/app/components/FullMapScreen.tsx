// FullMapScreen.tsx — Expanded full-screen SVG map (/home/map)
// Reuses DCMap component with address pins and user location.

import { useState } from "react";
import { useNavigate } from "react-router";
import { CaretLeft, MapPin, Crosshair, MagnifyingGlass, NavigationArrow } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { DCMap, type DCMapMarker } from "./DCMap";
import { T, font, R, HIG, TYPE } from "../tokens";
import { useIsMobile } from "./ui/use-mobile";
import { MapWithPanelLayout } from "./MapWithPanelLayout";

// ── Hex → tinted rgba ─────────────────────────────────────────
function tint(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const USER_POS: [number, number] = [33.7490, -84.3882];
const SAVED_LOCATIONS: { label: string; position: [number, number]; type: "home" | "work"; color: string }[] = [
  { label: "Home", position: [33.7520, -84.3850], type: "home", color: "#FF4D00" },
  { label: "Work", position: [33.7560, -84.3920], type: "work", color: "#FFC043" },
];

export function FullMapScreen() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const m = HIG.screenMargin;
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  const markers: DCMapMarker[] = [
    { position: USER_POS, type: "user" },
    ...SAVED_LOCATIONS.map((loc) => ({
      position: loc.position,
      type: "vendor" as const,
      initials: loc.label[0].toUpperCase(),
      avatarColor: loc.color,
      // no rating — these are saved places, not vendor profiles
    })),
  ];

  if (!isMobile) {
    return (
      <MapWithPanelLayout
        mapContent={
          <div style={{ height: "100%", position: "relative", overflow: "hidden", backgroundColor: T.bg, fontFamily: font }}>
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
              <DCMap center={USER_POS} zoom={13} markers={markers} style={{ width: "100%", height: "100%" }} />
            </div>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, zIndex: 5, background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 12, left: 12, right: 12, zIndex: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => navigate(-1)}
                style={{ width: 40, height: 40, borderRadius: R.full, backgroundColor: "rgba(0,0,0,0.65)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", flexShrink: 0 }}
              >
                <CaretLeft size={20} color="#FFFFFF" weight="bold" />
              </button>
              <div style={{ flex: 1, height: 40, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", borderRadius: R.full, display: "flex", alignItems: "center", paddingLeft: 14, paddingRight: 14, gap: 8 }}>
                <MagnifyingGlass size={14} color="rgba(255,255,255,0.6)" weight="regular" />
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: TYPE.subhead, fontFamily: font }}>Search location...</span>
              </div>
            </div>
            <button
              style={{ position: "absolute", bottom: 24, right: 16, zIndex: 20, width: 44, height: 44, borderRadius: R.full, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Crosshair size={20} color="#FFFFFF" weight="regular" />
            </button>
          </div>
        }
        panelContent={
          <div style={{ padding: "20px 20px 24px", fontFamily: font }}>
            <h3 style={{ margin: "0 0 16px", color: T.textPrimary, fontSize: TYPE.title3, fontWeight: 700, letterSpacing: "-0.022em", fontFamily: font }}>
              Saved Locations
            </h3>
            {SAVED_LOCATIONS.map((loc) => (
              <motion.button
                key={loc.label}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedPin(loc.label)}
                style={{ width: "100%", background: "none", border: `1px solid ${selectedPin === loc.label ? T.cta : T.border}`, borderRadius: R.md, backgroundColor: selectedPin === loc.label ? "rgba(255,77,0,0.06)" : T.surfaceElevated, padding: "14px 16px", marginBottom: 8, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12, transition: "border-color 0.18s, background-color 0.18s", fontFamily: font }}
              >
                <div style={{ width: 36, height: 36, borderRadius: R.sm, backgroundColor: tint(loc.color, 0.13), border: `1px solid ${tint(loc.color, 0.28)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={18} color={loc.color} weight="fill" />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 600, fontFamily: font, display: "block", marginBottom: 2 }}>{loc.label}</span>
                  <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>{loc.position[0].toFixed(4)}, {loc.position[1].toFixed(4)}</span>
                </div>
                <NavigationArrow size={14} color={selectedPin === loc.label ? T.cta : T.textTertiary} weight="fill" />
              </motion.button>
            ))}
            <AnimatePresence>
              {selectedPin && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.22 }} style={{ marginTop: 6 }}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(-1)}
                    style={{ width: "100%", height: 52, backgroundColor: T.cta, border: "none", borderRadius: R.md, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    <MapPin size={16} color="#000000" weight="fill" />
                    <span style={{ color: "#000000", fontSize: TYPE.callout, fontWeight: 600, fontFamily: font }}>Use {selectedPin}</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        }
      />
    );
  }

  // Mobile layout
  return (
    <div style={{ height: "100%", position: "relative", overflow: "hidden", backgroundColor: T.bg, fontFamily: font }}>
      {/* Full-screen map */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <DCMap
          center={USER_POS}
          zoom={13}
          markers={markers}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Top gradient */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 120, zIndex: 5,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Back button + search */}
      <div style={{
        position: "absolute", top: 12, left: 12, right: 12, zIndex: 20,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 40, height: 40, borderRadius: R.full,
            backgroundColor: "rgba(0,0,0,0.65)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)", flexShrink: 0,
          }}
        >
          <CaretLeft size={20} color="#FFFFFF" weight="bold" />
        </button>

        {/* Search bar */}
        <div style={{
          flex: 1, height: 40,
          backgroundColor: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(8px)",
          borderRadius: R.full,
          display: "flex", alignItems: "center",
          paddingLeft: 14, paddingRight: 14, gap: 8,
        }}>
          <MagnifyingGlass size={14} color="rgba(255,255,255,0.6)" weight="regular" />
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: TYPE.subhead, fontFamily: font }}>
            Search location...
          </span>
        </div>
      </div>

      {/* Recenter button */}
      <button
        style={{
          position: "absolute", bottom: 200, right: 16, zIndex: 20,
          width: 44, height: 44, borderRadius: R.full,
          backgroundColor: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(8px)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Crosshair size={20} color="#FFFFFF" weight="regular" />
      </button>

      {/* Bottom sheet */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 15,
          backgroundColor: T.bg,
          borderRadius: "20px 20px 0 0",
          paddingTop: 14, paddingBottom: 24,
          boxShadow: "0 -4px 32px rgba(0,0,0,0.5)",
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, backgroundColor: T.border, borderRadius: 2, margin: "0 auto 16px" }} />

        <div style={{ paddingLeft: m, paddingRight: m }}>
          <h3 style={{ margin: "0 0 16px", color: T.textPrimary, fontSize: TYPE.title3, fontWeight: 700, letterSpacing: "-0.022em", fontFamily: font }}>
            Saved Locations
          </h3>

          {SAVED_LOCATIONS.map((loc, idx) => (
            <motion.button
              key={loc.label}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedPin(loc.label)}
              style={{
                width: "100%", background: "none",
                border: `1px solid ${selectedPin === loc.label ? T.cta : T.border}`,
                borderRadius: R.md,
                backgroundColor: selectedPin === loc.label ? "rgba(255,77,0,0.06)" : T.surfaceElevated,
                padding: "14px 16px",
                marginBottom: 8,
                cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 12,
                transition: "border-color 0.18s, background-color 0.18s",
                fontFamily: font,
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: R.sm,
                backgroundColor: tint(loc.color, 0.13),
                border: `1px solid ${tint(loc.color, 0.28)}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <MapPin
                  size={18}
                  color={loc.color}
                  weight="fill"
                />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 600, fontFamily: font, display: "block", marginBottom: 2 }}>
                  {loc.label}
                </span>
                <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>
                  {loc.position[0].toFixed(4)}, {loc.position[1].toFixed(4)}
                </span>
              </div>
              <NavigationArrow
                size={14}
                color={selectedPin === loc.label ? T.cta : T.textTertiary}
                weight="fill"
              />
            </motion.button>
          ))}

          {/* Set location CTA */}
          <AnimatePresence>
            {selectedPin && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22 }}
                style={{ marginTop: 6 }}
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(-1)}
                  style={{
                    width: "100%", height: 52,
                    backgroundColor: T.cta, border: "none", borderRadius: R.md,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  <MapPin size={16} color="#000000" weight="fill" />
                  <span style={{ color: "#000000", fontSize: TYPE.callout, fontWeight: 600, fontFamily: font }}>
                    Use {selectedPin}
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}