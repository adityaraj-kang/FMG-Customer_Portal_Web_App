// HomeScreen.tsx — Uber-style map-first home (Phase 2 redesign)
// Full-bleed DCMap canvas with floating chrome and persistent bottom sheet.

import { useNavigate } from "react-router";
import {
  MapPin, Bell, MagnifyingGlass, ArrowUp,
  CaretDown, CaretRight,
} from "@phosphor-icons/react";
import {
  Truck, PipeWrench, Snowflake, Lightning,
  Tree, Hammer, HouseLine, Bug,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";
import { SERVICES, JOBS } from "../data";
import { DCMap, type DCMapMarker } from "./DCMap";
import { InitialsAvatar } from "./InitialsAvatar";
import { useIsMobile } from "./ui/use-mobile";
import { MapWithPanelLayout } from "./MapWithPanelLayout";

// ─── Icon map ────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  towing:      Truck,
  plumber:     PipeWrench,
  hvac:        Snowflake,
  electrician: Lightning,
  lawn:        Tree,
  handyman:    Hammer,
  roofing:     HouseLine,
  pest:        Bug,
};

// ─── Hex → tinted rgba ──────────────────────────────────────────
function tint(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── Dynamic greeting ────────────────────────────────────────────
function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 21) return "Good evening";
  return "Good night";
}

// ─── Map configuration ───────────────────────────────────────────
// User pinned at Peachtree & Baker — downtown Atlanta
const USER_POS: [number, number] = [33.7490, -84.3882];

// Ambient vendor avatar pins — make the map feel alive on home
const MAP_MARKERS: DCMapMarker[] = [
  { position: USER_POS,                    type: "user" },
  { position: [33.7600, -84.4030],         type: "vendor", initials: "MR", avatarColor: "#2E93FA", rating: "4.9" },
  { position: [33.7420, -84.3710],         type: "vendor", initials: "JS", avatarColor: "#34C759", rating: "4.7" },
  { position: [33.7555, -84.3800],         type: "vendor", initials: "AL", avatarColor: "#A78BFA", rating: "4.8" },
  { position: [33.7480, -84.3960],         type: "vendor", initials: "DK", avatarColor: "#FFC043", rating: "4.6" },
];

// ─── Pulsing live indicator ──────────────────────────────────────
function PulsingDot() {
  return (
    <div style={{ position: "relative", width: 8, height: 8, flexShrink: 0 }}>
      <motion.div
        animate={{ scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: 0,
          borderRadius: "50%", backgroundColor: T.cta,
        }}
      />
      <div style={{
        position: "absolute",
        width: 6, height: 6, top: 1, left: 1,
        borderRadius: "50%", backgroundColor: T.cta,
      }} />
    </div>
  );
}

// ─── Glass chip used for the top bar ────────────────────────────
const GLASS = {
  backgroundColor: "rgba(0,0,0,0.52)",
  backdropFilter:  "blur(14px) saturate(1.6)",
  WebkitBackdropFilter: "blur(14px) saturate(1.6)",
  border: "1px solid rgba(255,255,255,0.11)",
} as const;

// ─── Nearby vendor previews per service ─────────────────────────
// Two representative vendor names per service for the stacked avatar hint
const NEARBY_VENDORS: Record<string, [string, string]> = {
  towing:      ["Mike T.",    "QuickFix P."],
  plumber:     ["Atlanta P.", "QuickFix Pl."],
  hvac:        ["CoolAir P.", "ThermoTech"],
  electrician: ["Watts Up",   "PowerPro"],
  lawn:        ["GreenScape", "CleanCut"],
  handyman:    ["FixIt Fast", "AllFix H."],
  roofing:     ["AtlantaRoof","StormGuard"],
  pest:        ["PestAway",   "CleanHome"],
};

// ─── Shared panel content (services + saved places + active job) ─
function HomePanel({
  m,
  navigate,
  activeJob,
}: {
  m: number;
  navigate: ReturnType<typeof useNavigate>;
  activeJob: typeof JOBS[number] | undefined;
}) {
  return (
    <>
      {/* ── Services strip header ─────────────────────────────── */}
      <div
        style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: m, paddingRight: m,
          paddingTop: 20, marginBottom: 14,
        }}
      >
        <span
          style={{
            color: T.textTertiary,
            fontSize: TYPE.caption2,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            fontFamily: font,
          }}
        >
          Services
        </span>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate("/home/services")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 2,
            color: "#FF4D00", fontSize: TYPE.caption1,
            fontWeight: 500, fontFamily: font,
            paddingTop: 4, paddingBottom: 4,
          }}
        >
          All
          <CaretRight size={12} color="#FF4D00" weight="bold" />
        </motion.button>
      </div>

      {/* Service chips — vertical list in panel */}
      <div style={{ paddingLeft: m, paddingRight: m, display: "flex", flexDirection: "column", gap: 8 }}>
        {SERVICES.map((svc, i) => {
          const Icon    = ICON_MAP[svc.id] ?? Truck;
          const vendors = NEARBY_VENDORS[svc.id] ?? ["A", "B"];
          return (
            <motion.button
              key={svc.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 + i * 0.03, duration: 0.26, ease: [0.32, 0.72, 0, 1] }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/home/chat/${svc.id}`)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "none", border: "none", cursor: "pointer",
                padding: "8px 0", textAlign: "left",
                borderBottom: `0.5px solid ${T.divider}`,
              }}
            >
              <div
                style={{
                  width: 44, height: 44, borderRadius: R.md, flexShrink: 0,
                  backgroundColor: tint(svc.color, 0.13),
                  border: `1px solid ${tint(svc.color, 0.28)}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Icon size={20} color={svc.color} weight="regular" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 600, fontFamily: font, letterSpacing: "-0.01em" }}>
                  {svc.label}
                </span>
                <span style={{ display: "block", color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>
                  {svc.avgPrice} · {svc.avgEta}
                </span>
              </div>
              {/* Vendor avatars */}
              <div style={{ display: "flex", marginRight: 4 }}>
                {vendors.map((name, ai) => (
                  <div key={name} style={{ marginLeft: ai > 0 ? -5 : 0 }}>
                    <InitialsAvatar name={name} size={18} style={{ border: `1px solid ${T.border}` }} />
                  </div>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ height: "0.5px", backgroundColor: T.divider, marginTop: 18, marginBottom: 14 }} />

      {/* ── Saved places ─────────────────────────────────────── */}
      <div style={{ paddingLeft: m, paddingRight: m, display: "flex", gap: 10 }}>
        {(
          [
            { label: "Home", sub: "124 Peachtree St",  pinColor: "#FF4D00" },
            { label: "Work", sub: "Midtown Atlanta",   pinColor: "#FFC043" },
          ] as const
        ).map((place, i) => (
          <motion.button
            key={place.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 + i * 0.07, duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/home/chat")}
            style={{
              flex: 1,
              display: "flex", alignItems: "center", gap: 10,
              backgroundColor: T.surfaceElevated,
              border: `1px solid ${T.border}`,
              borderRadius: R.md,
              paddingTop: 10, paddingBottom: 10,
              paddingLeft: 12, paddingRight: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ width: 30, height: 30, borderRadius: R.xs, backgroundColor: tint(place.pinColor, 0.11), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MapPin size={15} color={place.pinColor} weight="fill" />
            </div>
            <div style={{ textAlign: "left", minWidth: 0 }}>
              <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.caption1, fontWeight: 600, fontFamily: font, letterSpacing: "-0.012em" }}>{place.label}</span>
              <span style={{ display: "block", color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{place.sub}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* ── Active job row ────────────────────────────────────── */}
      {activeJob && (
        <>
          <div style={{ height: "0.5px", backgroundColor: T.divider, marginTop: 14 }} />
          <motion.button
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate(`/home/activity/${activeJob.id}`)}
            style={{
              width: "100%",
              background: "rgba(255,77,0,0.04)", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              paddingTop: 12, paddingBottom: 12,
              paddingLeft: m + 6, paddingRight: m,
              position: "relative", textAlign: "left",
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, backgroundColor: "#FF4D00", borderRadius: "0 1.5px 1.5px 0" }} />
            <PulsingDot />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.footnote, fontWeight: 600, fontFamily: font, letterSpacing: "-0.012em", marginBottom: 1 }}>{activeJob.serviceLabel} — In Progress</span>
              <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>{activeJob.detail}</span>
            </div>
            <span style={{ color: T.cta, fontSize: TYPE.caption1, fontWeight: 600, fontFamily: font, whiteSpace: "nowrap", flexShrink: 0 }}>Track</span>
            <CaretRight size={14} color={T.cta} weight="bold" />
          </motion.button>
        </>
      )}
    </>
  );
}

// ─── Main component ──────────────────────────────────────────────
export function HomeScreen() {
  const navigate   = useNavigate();
  const isMobile   = useIsMobile();
  const m          = HIG.screenMargin;
  const greeting   = getGreeting();
  const activeJob  = JOBS.find((j) => j.status === "active");

  // ── Shared: map layers 0-3 (used in both desktop and mobile) ─
  // Rendered as a fragment — the parent container provides positioning context.
  const mapLayers = (
    <>
      {/* ── Layer 0: Full-bleed map ─────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <DCMap
          center={USER_POS}
          zoom={13}
          markers={MAP_MARKERS}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* ── Layer 1: Top vignette ────────────────────────────── */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 160, zIndex: 5, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 75%, transparent 100%)",
        }}
      />

      {/* ── Layer 2: Floating top bar ─────────────────────────── */}
      <div
        style={{
          position: "absolute", top: 14, left: m, right: m,
          zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        {/* Location chip */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          style={{
            ...GLASS,
            display: "flex", alignItems: "center", gap: 6,
            borderRadius: R.full,
            paddingTop: 9, paddingBottom: 9,
            paddingLeft: 12, paddingRight: 14,
            cursor: "pointer",
          }}
        >
          <MapPin size={13} color="#FF4D00" weight="fill" />
          <span
            style={{
              color: "#FFFFFF",
              fontSize: TYPE.footnote,
              fontWeight: 600,
              fontFamily: font,
              letterSpacing: "-0.01em",
            }}
          >
            Atlanta, GA
          </span>
          <CaretDown size={10} color="rgba(255,255,255,0.55)" weight="bold" />
        </motion.button>

        {/* Notification bell */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => navigate("/home/profile/notifications")}
          style={{
            ...GLASS,
            width: 40, height: 40, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Bell size={17} color="#FFFFFF" weight="regular" />
        </motion.button>
      </div>

      {/* ── Layer 3: Search bar — the primary CTA ─────────────── */}
      <div
        style={{
          position: "absolute", top: 62, left: m, right: m,
          zIndex: 20,
        }}
      >
        <motion.div
          role="button"
          tabIndex={0}
          onClick={() => navigate("/home/chat")}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && navigate("/home/chat")
          }
          whileTap={{ scale: 0.982 }}
          transition={{ type: "spring", stiffness: 600, damping: 38 }}
          style={{
            height: 62,
            backgroundColor: T.surfaceElevated,
            border: `1px solid ${T.border}`,
            borderRadius: R.lg,
            display: "flex", alignItems: "center",
            paddingLeft: 14, paddingRight: 10, gap: 12,
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(0,0,0,0.48), 0 2px 8px rgba(0,0,0,0.28)",
          }}
        >
          {/* Search icon — CTA-tinted */}
          <div
            style={{
              width: 38, height: 38, borderRadius: R.full,
              backgroundColor: "rgba(255,77,0,0.13)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <MagnifyingGlass size={17} color="#FF4D00" weight="bold" />
          </div>

          {/* Question is dominant — greeting is the quiet subtext */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                display: "block",
                color: T.textPrimary,
                fontSize: TYPE.subhead,
                fontFamily: font,
                fontWeight: 600,
                letterSpacing: "-0.022em",
              }}
            >
              What do you need?
            </span>
            <span
              style={{
                display: "block",
                color: T.textTertiary,
                fontSize: TYPE.caption1,
                fontFamily: font,
                letterSpacing: "-0.008em",
              }}
            >
              {greeting}, Dinesh
            </span>
          </div>

          {/* Send */}
          <div
            style={{
              width: 38, height: 38, borderRadius: R.full,
              backgroundColor: "#FF4D00",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 12px rgba(255,77,0,0.5)",
            }}
          >
            <ArrowUp size={16} color="#000000" weight="bold" />
          </div>
        </motion.div>
      </div>
    </>
  );

  // ── Desktop: MapWithPanelLayout ───────────────────────────────
  if (!isMobile) {
    return (
      <MapWithPanelLayout
        mapContent={
          <div style={{ height: "100%", position: "relative", overflow: "hidden", backgroundColor: T.bg, fontFamily: font }}>
            {mapLayers}
          </div>
        }
        panelContent={<HomePanel m={m} navigate={navigate} activeJob={activeJob} />}
      />
    );
  }

  // ── Mobile: full-screen map + floating layers + bottom sheet ─
  return (
    <div
      style={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: T.bg,
        fontFamily: font,
      }}
    >
      {mapLayers}

      {/* ── Layer 4.5: Vendors nearby chip (mobile only) ────────── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
        style={{
          position: "absolute",
          bottom: 300,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 12,
        }}
      >
        <div
          style={{
            ...GLASS,
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            borderRadius: R.full,
            paddingTop: 8, paddingBottom: 8,
            paddingLeft: 14, paddingRight: 16,
          }}
        >
          {/* Pulsing dot — live signal */}
          <div style={{ position: "relative", width: 7, height: 7, flexShrink: 0 }}>
            <motion.div
              animate={{ scale: [1, 2.1, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute", inset: 0,
                borderRadius: "50%", backgroundColor: "#FF4D00",
              }}
            />
            <div style={{
              position: "absolute",
              width: 5, height: 5, top: 1, left: 1,
              borderRadius: "50%", backgroundColor: "#FF4D00",
            }} />
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.90)",
              fontSize: TYPE.caption1,
              fontWeight: 600,
              fontFamily: font,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            4 providers nearby
          </span>
        </div>
      </motion.div>

      {/* ── Layer 4: Persistent bottom sheet ─────────────────── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08, duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 15,
          backgroundColor: T.bg,
          borderRadius: "20px 20px 0 0",
          borderTop: `0.5px solid ${T.border}`,
          boxShadow: "0 -8px 40px rgba(0,0,0,0.38)",
          paddingBottom: 12,
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 36, height: 4, borderRadius: 2,
            backgroundColor: T.border,
            margin: "14px auto 18px",
          }}
        />

        {/* ── Services strip ─────────────────────────────────── */}
        <div
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: m, paddingRight: m,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              color: T.textTertiary,
              fontSize: TYPE.caption2,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              fontFamily: font,
            }}
          >
            Services
          </span>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/home/services")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 2,
              color: "#FF4D00", fontSize: TYPE.caption1,
              fontWeight: 500, fontFamily: font,
              paddingTop: 4, paddingBottom: 4,
            }}
          >
            All
            <CaretRight size={12} color="#FF4D00" weight="bold" />
          </motion.button>
        </div>

        {/* Horizontal chip scroll */}
        <div
          style={{
            display: "flex",
            gap: 12,
            paddingLeft: m,
            overflowX: "auto",
            paddingBottom: 2,
          }}
        >
          {SERVICES.map((svc, i) => {
            const Icon    = ICON_MAP[svc.id] ?? Truck;
            const vendors = NEARBY_VENDORS[svc.id] ?? ["A", "B"];
            return (
              <motion.button
                key={svc.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.18 + i * 0.045,
                  type: "spring", stiffness: 380, damping: 24,
                }}
                whileTap={{ scale: 0.90 }}
                onClick={() => navigate(`/home/chat/${svc.id}`)}
                style={{
                  flexShrink: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 7,
                  background: "none", border: "none",
                  cursor: "pointer", padding: 0,
                  width: 64,
                }}
              >
                {/* Per-service color tint tile — with vendor avatar hints */}
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  style={{
                    position: "relative",
                    width: 52, height: 52, borderRadius: R.md,
                    backgroundColor: tint(svc.color, 0.13),
                    border: `1px solid ${tint(svc.color, 0.28)}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Icon size={22} color={svc.color} weight="regular" />

                  {/* Stacked vendor initials — bottom-right corner */}
                  <div
                    style={{
                      position: "absolute", bottom: 3, right: 3,
                      display: "flex", flexDirection: "row",
                    }}
                  >
                    {vendors.map((name, ai) => (
                      <div key={name} style={{ marginLeft: ai > 0 ? -5 : 0 }}>
                        <InitialsAvatar
                          name={name}
                          size={14}
                          style={{ border: `1px solid ${tint(svc.color, 0.55)}` }}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
                <span
                  style={{
                    color: T.textSecondary,
                    fontSize: TYPE.caption2,
                    fontWeight: 500,
                    textAlign: "center",
                    maxWidth: 62,
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                    fontFamily: font,
                  }}
                >
                  {svc.label}
                </span>
              </motion.button>
            );
          })}
          {/* Right breathing room */}
          <div style={{ width: m - 4, flexShrink: 0 }} />
        </div>

        {/* Divider */}
        <div
          style={{
            height: "0.5px",
            backgroundColor: T.divider,
            marginTop: 18, marginBottom: 14,
          }}
        />

        {/* ── Saved places — 2-col ─────────────────────────────── */}
        <div
          style={{
            paddingLeft: m, paddingRight: m,
            display: "flex", gap: 10,
          }}
        >
          {(
            [
              { label: "Home", sub: "124 Peachtree St",  pinColor: "#FF4D00" },
              { label: "Work", sub: "Midtown Atlanta",   pinColor: "#FFC043" },
            ] as const
          ).map((place, i) => (
            <motion.button
              key={place.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 + i * 0.07, duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/home/chat")}
              style={{
                flex: 1,
                display: "flex", alignItems: "center", gap: 10,
                backgroundColor: T.surfaceElevated,
                border: `1px solid ${T.border}`,
                borderRadius: R.md,
                paddingTop: 10, paddingBottom: 10,
                paddingLeft: 12, paddingRight: 12,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 30, height: 30, borderRadius: R.xs,
                  backgroundColor: tint(place.pinColor, 0.11),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MapPin size={15} color={place.pinColor} weight="fill" />
              </div>
              <div style={{ textAlign: "left", minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    color: T.textPrimary,
                    fontSize: TYPE.caption1,
                    fontWeight: 600,
                    fontFamily: font,
                    letterSpacing: "-0.012em",
                  }}
                >
                  {place.label}
                </span>
                <span
                  style={{
                    display: "block",
                    color: T.textTertiary,
                    fontSize: TYPE.caption2,
                    fontFamily: font,
                    letterSpacing: "-0.005em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {place.sub}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── Active job row — shown only when a job is live ────── */}
        {activeJob && (
          <>
            <div
              style={{
                height: "0.5px",
                backgroundColor: T.divider,
                marginTop: 14, marginBottom: 0,
              }}
            />
            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate(`/home/activity/${activeJob.id}`)}
              style={{
                width: "100%",
                background: "rgba(255,77,0,0.04)", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10,
                paddingTop: 12, paddingBottom: 12,
                paddingLeft: m + 6, paddingRight: m,
                position: "relative",
                textAlign: "left",
              }}
            >
              {/* Blinkit 3px live stripe */}
              <div
                style={{
                  position: "absolute",
                  left: 0, top: 0, bottom: 0,
                  width: 3, backgroundColor: "#FF4D00",
                  borderRadius: "0 1.5px 1.5px 0",
                }}
              />
              <PulsingDot />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    color: T.textPrimary,
                    fontSize: TYPE.footnote,
                    fontWeight: 600,
                    fontFamily: font,
                    letterSpacing: "-0.012em",
                    marginBottom: 1,
                  }}
                >
                  {activeJob.serviceLabel} — In Progress
                </span>
                <span
                  style={{
                    color: T.textTertiary,
                    fontSize: TYPE.caption2,
                    fontFamily: font,
                  }}
                >
                  {activeJob.detail}
                </span>
              </div>
              <span
                style={{
                  color: T.cta,
                  fontSize: TYPE.caption1,
                  fontWeight: 600,
                  fontFamily: font,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Track
              </span>
              <CaretRight size={14} color={T.cta} weight="bold" />
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
}