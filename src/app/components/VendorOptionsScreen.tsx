// VendorOptionsScreen.tsx — Uber-style vendor selection
// Map-first paradigm. Two cards: badge → price → single meta line.
// Confirm CTA slides in on selection — no clutter until needed.

import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  CaretLeft, Star, Clock, ArrowRight, Trophy, Lightning,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { DCMap, type DCMapMarker } from "./DCMap";
import { T, font, R, HIG, TYPE } from "../tokens";
import { useIsMobile } from "./ui/use-mobile";
import { MapWithPanelLayout } from "./MapWithPanelLayout";

const IOS = [0.32, 0.72, 0, 1] as const;

// ─── Glass style (matches HomeScreen top bar) ─────────────────────
const GLASS = {
  backgroundColor: "rgba(0,0,0,0.52)",
  backdropFilter: "blur(14px) saturate(1.6)",
  WebkitBackdropFilter: "blur(14px) saturate(1.6)",
  border: "1px solid rgba(255,255,255,0.11)",
} as const;

// ─── Map positions ────────────────────────────────────────────────
const USER_POS: [number, number] = [33.7490, -84.3882];

const VENDOR_POSITIONS: Record<string, [[number, number], [number, number]]> = {
  towing:      [[33.7600, -84.4030], [33.7420, -84.3690]],
  plumber:     [[33.7570, -84.3960], [33.7440, -84.3720]],
  hvac:        [[33.7630, -84.4080], [33.7390, -84.3650]],
  electrician: [[33.7580, -84.4010], [33.7460, -84.3700]],
  lawn:        [[33.7540, -84.3920], [33.7410, -84.3760]],
  handyman:    [[33.7610, -84.4050], [33.7430, -84.3710]],
  roofing:     [[33.7650, -84.4100], [33.7380, -84.3630]],
  pest:        [[33.7520, -84.3870], [33.7470, -84.3820]],
};
const DEFAULT_POSITIONS: [[number, number], [number, number]] = [
  [33.7590, -84.4010],
  [33.7440, -84.3720],
];
const MAP_CENTER: [number, number] = [33.7520, -84.3890];

// ─── Vendor data ──────────────────────────────────────────────────
interface Vendor {
  type:    "best" | "fastest";
  badge:   string;
  name:    string;
  price:   number;
  eta:     string;
  rating:  number;
  jobs:    number;
  address: string;
}

const VENDORS: Record<string, [Vendor, Vendor]> = {
  towing: [
    { type: "best",    badge: "Best Value",  name: "Mike's Towing",        price: 85,  eta: "15 min",   rating: 4.8, jobs: 234, address: "847 Howell Mill Rd NW, Atlanta, GA 30318" },
    { type: "fastest", badge: "Fastest ETA", name: "QuickFix Pro",          price: 75,  eta: "12 min",   rating: 4.6, jobs: 187, address: "2130 Peachtree Rd NE, Atlanta, GA 30309" },
  ],
  plumber: [
    { type: "best",    badge: "Best Value",  name: "Atlanta Plumbing Co.",  price: 110, eta: "30 min",   rating: 4.9, jobs: 512, address: "1501 Monroe Dr NE, Atlanta, GA 30324" },
    { type: "fastest", badge: "Fastest ETA", name: "QuickFix Plumbing",     price: 130, eta: "20 min",   rating: 4.7, jobs: 298, address: "3180 Maple Dr NE, Atlanta, GA 30305" },
  ],
  hvac: [
    { type: "best",    badge: "Best Value",  name: "CoolAir Pro",           price: 155, eta: "45 min",   rating: 4.8, jobs: 389, address: "1650 Johnson Rd NW, Atlanta, GA 30318" },
    { type: "fastest", badge: "Fastest ETA", name: "ThermoTech HVAC",       price: 200, eta: "25 min",   rating: 4.7, jobs: 201, address: "4400 Roswell Rd NE, Atlanta, GA 30342" },
  ],
  electrician: [
    { type: "best",    badge: "Best Value",  name: "Watts Up Electric",     price: 120, eta: "35 min",   rating: 4.9, jobs: 441, address: "965 Murphy Ave SW, Atlanta, GA 30310" },
    { type: "fastest", badge: "Fastest ETA", name: "PowerPro Electric",     price: 160, eta: "25 min",   rating: 4.7, jobs: 183, address: "2260 Marietta Blvd NW, Atlanta, GA 30318" },
  ],
  lawn: [
    { type: "best",    badge: "Best Value",  name: "GreenScape Crew",       price: 55,  eta: "Next day", rating: 4.8, jobs: 670, address: "1823 Briarcliff Rd NE, Atlanta, GA 30306" },
    { type: "fastest", badge: "Fastest ETA", name: "CleanCut Pro",          price: 80,  eta: "Same day", rating: 4.6, jobs: 312, address: "785 Edgewood Ave SE, Atlanta, GA 30312" },
  ],
  handyman: [
    { type: "best",    badge: "Best Value",  name: "FixIt Fast",            price: 70,  eta: "2–4 hrs",  rating: 4.8, jobs: 528, address: "1240 Euclid Ave NE, Atlanta, GA 30307" },
    { type: "fastest", badge: "Fastest ETA", name: "AllFix Handyman",       price: 90,  eta: "1–2 hrs",  rating: 4.7, jobs: 244, address: "3450 Clairmont Rd NE, Atlanta, GA 30329" },
  ],
  roofing: [
    { type: "best",    badge: "Best Value",  name: "AtlantaRoof Co.",       price: 150, eta: "Next day", rating: 4.9, jobs: 381, address: "2890 Peachtree Industrial Blvd, Atlanta, GA 30341" },
    { type: "fastest", badge: "Fastest ETA", name: "StormGuard Roofing",    price: 200, eta: "3 hrs",    rating: 4.7, jobs: 196, address: "1560 Piedmont Ave NE, Atlanta, GA 30324" },
  ],
  pest: [
    { type: "best",    badge: "Best Value",  name: "PestAway Atlanta",      price: 80,  eta: "Same day", rating: 4.8, jobs: 492, address: "690 Ponce De Leon Ave NE, Atlanta, GA 30308" },
    { type: "fastest", badge: "Fastest ETA", name: "CleanHome Pest",        price: 110, eta: "2 hrs",    rating: 4.7, jobs: 261, address: "2105 Cheshire Bridge Rd NE, Atlanta, GA 30324" },
  ],
};

const DEFAULT_VENDORS: [Vendor, Vendor] = [
  { type: "best",    badge: "Best Value",  name: "TopService Pro", price: 95,  eta: "30 min", rating: 4.8, jobs: 310, address: "500 Peachtree St NE, Atlanta, GA 30308" },
  { type: "fastest", badge: "Fastest ETA", name: "QuickFix Pro",   price: 120, eta: "18 min", rating: 4.6, jobs: 198, address: "800 Spring St NW, Atlanta, GA 30308" },
];

const SERVICE_LABELS: Record<string, string> = {
  towing: "Towing", plumber: "Plumbing", hvac: "HVAC",
  electrician: "Electrical", lawn: "Lawn Care", handyman: "Handyman",
  roofing: "Roofing", pest: "Pest Control",
};

// ─── Derive two-letter initials from a vendor name ────────────────
function vendorInitials(name: string): string {
  const words = name.split(/\s+/).filter((w) => /[A-Za-z]/.test(w[0] ?? ""));
  return words.slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

// ─── Main component ───────────────────────────────────────────────
export function VendorOptionsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state     = location.state as Record<string, unknown> | null;
  const isMobile  = useIsMobile();
  const m         = HIG.screenMargin;

  const serviceId    = (state?.serviceId as string | undefined) ?? "";
  const serviceLabel = SERVICE_LABELS[serviceId] ?? "Service";
  const vendors      = VENDORS[serviceId] ?? DEFAULT_VENDORS;
  const positions    = VENDOR_POSITIONS[serviceId] ?? DEFAULT_POSITIONS;

  const [selected, setSelected] = useState<"best" | "fastest" | null>(null);
  const chosenVendor = vendors.find((v) => v.type === selected);

  const mapMarkers: DCMapMarker[] = [
    { position: USER_POS,     type: "user" },
    { position: positions[0], type: "vendor", initials: vendorInitials(vendors[0].name), avatarColor: "#FFC043", rating: String(vendors[0].rating) },
    { position: positions[1], type: "vendor", initials: vendorInitials(vendors[1].name), avatarColor: "#FF4D00", rating: String(vendors[1].rating) },
  ];

  function handleConfirm() {
    if (!chosenVendor) return;
    navigate("/home/verification", {
      state: {
        ...(state ?? {}),
        vendor: {
          name:    chosenVendor.name,
          price:   chosenVendor.price,
          eta:     chosenVendor.eta,
          rating:  chosenVendor.rating,
          type:    chosenVendor.type,
          address: chosenVendor.address,
        },
      },
    });
  }

  if (!isMobile) {
    return (
      <MapWithPanelLayout
        mapContent={
          <div style={{ height: "100%", position: "relative", overflow: "hidden", backgroundColor: T.bg, fontFamily: font }}>
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
              <DCMap center={MAP_CENTER} zoom={13} markers={mapMarkers} style={{ width: "100%", height: "100%" }} />
            </div>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, zIndex: 5, pointerEvents: "none", background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)" }} />
            <motion.button
              whileTap={{ scale: 0.90 }}
              onClick={() => navigate(-1)}
              style={{ ...GLASS, position: "absolute", top: 14, left: m, zIndex: 20, width: 40, height: 40, borderRadius: R.full, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <CaretLeft size={18} color="#FFFFFF" weight="bold" />
            </motion.button>
          </div>
        }
        panelContent={
          <div style={{ padding: "20px 20px 24px", fontFamily: font, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L8.2 5.8L13 7L8.2 8.2L7 13L5.8 8.2L1 7L5.8 5.8L7 1Z" fill="#FF4D00" />
              </svg>
              <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font, letterSpacing: "-0.01em" }}>
                Genie found 2 {serviceLabel} pros
              </span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ margin: "0 0 3px", color: T.textPrimary, fontSize: TYPE.title3, fontWeight: 700, letterSpacing: "-0.026em", fontFamily: font }}>Choose your pro</h2>
              <p style={{ margin: 0, color: T.textTertiary, fontSize: TYPE.footnote, letterSpacing: "-0.01em", fontFamily: font }}>Tap a card to compare, then confirm</p>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              {vendors.map((vendor) => {
                const isSel  = selected === vendor.type;
                const isBest = vendor.type === "best";
                return (
                  <motion.button
                    key={vendor.type}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                    onClick={() => setSelected(vendor.type)}
                    style={{ flex: 1, background: "none", border: `1.5px solid ${isSel ? T.cta : T.border}`, borderRadius: R.lg, backgroundColor: isSel ? "rgba(255,77,0,0.07)" : T.surfaceElevated, padding: "13px 12px", cursor: "pointer", textAlign: "left", position: "relative", overflow: "hidden", transition: "border-color 0.16s, background-color 0.16s" }}
                  >
                    <AnimatePresence>
                      {isSel && (
                        <motion.div key="bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
                          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: T.cta, transformOrigin: "left" }}
                          transition={{ duration: 0.2, ease: IOS }} />
                      )}
                    </AnimatePresence>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, backgroundColor: isSel ? "rgba(255,77,0,0.14)" : T.bg, border: `1px solid ${isSel ? "rgba(255,77,0,0.30)" : T.divider}`, borderRadius: R.xs, paddingTop: 3, paddingBottom: 3, paddingLeft: 7, paddingRight: 8, marginBottom: 10, transition: "background-color 0.16s, border-color 0.16s" }}>
                      {isBest ? <Trophy size={10} color={isSel ? T.cta : "#FFC043"} weight="fill" /> : <Lightning size={10} color={T.cta} weight="fill" />}
                      <span style={{ color: isSel ? T.cta : T.textSecondary, fontSize: TYPE.caption2, fontWeight: 700, fontFamily: font, letterSpacing: "0.02em", transition: "color 0.16s" }}>{vendor.badge}</span>
                    </div>
                    <div style={{ color: T.textPrimary, fontSize: TYPE.footnote, fontWeight: 600, fontFamily: font, letterSpacing: "-0.014em", marginBottom: 10, lineHeight: 1.25, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{vendor.name}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 1, marginBottom: 10 }}>
                      <span style={{ color: T.cta, fontSize: TYPE.caption1, fontWeight: 700, fontFamily: font, lineHeight: 1, alignSelf: "flex-start", paddingTop: 4 }}>$</span>
                      <span style={{ color: T.cta, fontSize: 30, fontWeight: 800, fontFamily: font, letterSpacing: "-0.04em", lineHeight: 1 }}>{vendor.price}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" as const }}>
                      <Star size={11} color="#FFC043" weight="fill" />
                      <span style={{ color: T.textSecondary, fontSize: TYPE.caption2, fontFamily: font }}>{vendor.rating}</span>
                      <span style={{ color: T.divider, fontSize: TYPE.caption2, fontFamily: font }}>·</span>
                      <Clock size={10} color={T.textTertiary} />
                      <span style={{ color: T.textSecondary, fontSize: TYPE.caption2, fontFamily: font }}>{vendor.eta}</span>
                      <span style={{ color: T.divider, fontSize: TYPE.caption2, fontFamily: font }}>·</span>
                      <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>{vendor.jobs} jobs</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence>
              {selected && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.22, ease: IOS }}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleConfirm}
                    style={{ width: "100%", height: 52, backgroundColor: T.cta, border: "none", borderRadius: R.md, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(255,77,0,0.38)" }}
                  >
                    <span style={{ color: "#000000", fontSize: TYPE.callout, fontWeight: 700, letterSpacing: "-0.012em", fontFamily: font }}>Book {chosenVendor?.name}</span>
                    <span style={{ color: "rgba(0,0,0,0.55)", fontSize: TYPE.callout, fontWeight: 600, fontFamily: font }}>· ${chosenVendor?.price}</span>
                    <ArrowRight size={16} color="#000000" weight="bold" />
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

      {/* ── Full-bleed map ────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <DCMap
          center={MAP_CENTER}
          zoom={13}
          markers={mapMarkers}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* ── Top vignette — legibility for back button ─────────── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 120, zIndex: 5, pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)",
      }} />

      {/* ── Back button — frosted glass, same as HomeScreen ───── */}
      <motion.button
        whileTap={{ scale: 0.90 }}
        onClick={() => navigate(-1)}
        style={{
          ...GLASS,
          position: "absolute", top: 14, left: m, zIndex: 20,
          width: 40, height: 40, borderRadius: R.full,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <CaretLeft size={18} color="#FFFFFF" weight="bold" />
      </motion.button>

      {/* ── Service context chip — floats above the sheet ─────── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.28, ease: IOS }}
        style={{
          position: "absolute",
          bottom: 308,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 12,
        }}
      >
        <div style={{
          ...GLASS,
          display: "inline-flex", alignItems: "center", gap: 8,
          borderRadius: R.full,
          paddingTop: 8, paddingBottom: 8,
          paddingLeft: 14, paddingRight: 16,
        }}>
          {/* Genie spark */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L8.2 5.8L13 7L8.2 8.2L7 13L5.8 8.2L1 7L5.8 5.8L7 1Z"
              fill="#FF4D00" />
          </svg>
          <span style={{
            color: "rgba(255,255,255,0.90)",
            fontSize: TYPE.caption1,
            fontWeight: 600,
            fontFamily: font,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}>
            Genie found 2 {serviceLabel} pros
          </span>
        </div>
      </motion.div>

      {/* ── Bottom sheet ──────────────────────────────────────── */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.44, ease: IOS }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 15,
          backgroundColor: T.bg,
          borderRadius: "20px 20px 0 0",
          borderTop: `0.5px solid ${T.border}`,
          paddingTop: 16, paddingBottom: 24,
          boxShadow: "0 -8px 40px rgba(0,0,0,0.42)",
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: 36, height: 4, backgroundColor: T.border,
          borderRadius: 2, margin: "0 auto 18px",
        }} />

        <div style={{ paddingLeft: m, paddingRight: m }}>

          {/* Sheet header */}
          <div style={{ marginBottom: 16 }}>
            <h2 style={{
              margin: "0 0 3px",
              color: T.textPrimary,
              fontSize: TYPE.title3,
              fontWeight: 700,
              letterSpacing: "-0.026em",
              fontFamily: font,
            }}>
              Choose your pro
            </h2>
            <p style={{
              margin: 0,
              color: T.textTertiary,
              fontSize: TYPE.footnote,
              letterSpacing: "-0.01em",
              fontFamily: font,
            }}>
              Tap a card to compare, then confirm
            </p>
          </div>

          {/* ── Vendor cards — side-by-side ─────────────────── */}
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            {vendors.map((vendor) => {
              const isSel  = selected === vendor.type;
              const isBest = vendor.type === "best";

              return (
                <motion.button
                  key={vendor.type}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  onClick={() => setSelected(vendor.type)}
                  style={{
                    flex: 1,
                    background: "none",
                    border: `1.5px solid ${isSel ? T.cta : T.border}`,
                    borderRadius: R.lg,
                    backgroundColor: isSel ? "rgba(255,77,0,0.07)" : T.surfaceElevated,
                    padding: "13px 12px",
                    cursor: "pointer",
                    textAlign: "left",
                    position: "relative",
                    overflow: "hidden",
                    transition: "border-color 0.16s, background-color 0.16s",
                  }}
                >
                  {/* Top accent bar — slides in on select */}
                  <AnimatePresence>
                    {isSel && (
                      <motion.div
                        key="bar"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        style={{
                          position: "absolute", top: 0, left: 0, right: 0,
                          height: 2, backgroundColor: T.cta,
                          transformOrigin: "left",
                        }}
                        transition={{ duration: 0.2, ease: IOS }}
                      />
                    )}
                  </AnimatePresence>

                  {/* ── Row 1: Badge chip ─────────────────────── */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    backgroundColor: isSel ? "rgba(255,77,0,0.14)" : T.bg,
                    border: `1px solid ${isSel ? "rgba(255,77,0,0.30)" : T.divider}`,
                    borderRadius: R.xs,
                    paddingTop: 3, paddingBottom: 3,
                    paddingLeft: 7, paddingRight: 8,
                    marginBottom: 10,
                    transition: "background-color 0.16s, border-color 0.16s",
                  }}>
                    {isBest
                      ? <Trophy size={10} color={isSel ? T.cta : "#FFC043"} weight="fill" />
                      : <Lightning size={10} color={T.cta} weight="fill" />
                    }
                    <span style={{
                      color: isSel ? T.cta : T.textSecondary,
                      fontSize: TYPE.caption2,
                      fontWeight: 700,
                      fontFamily: font,
                      letterSpacing: "0.02em",
                      transition: "color 0.16s",
                    }}>
                      {vendor.badge}
                    </span>
                  </div>

                  {/* ── Row 2: Dominant price ─────────────────── */}
                  <div style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 1,
                    marginBottom: 10,
                  }}>
                    <span style={{
                      color: T.cta,
                      fontSize: TYPE.caption1,
                      fontWeight: 700,
                      fontFamily: font,
                      lineHeight: 1,
                      alignSelf: "flex-start",
                      paddingTop: 4,
                    }}>
                      $
                    </span>
                    <span style={{
                      color: T.cta,
                      fontSize: 30,
                      fontWeight: 800,
                      fontFamily: font,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}>
                      {vendor.price}
                    </span>
                  </div>

                  {/* ── Row 3: Single meta line — nowrap ─────── */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    flexWrap: "nowrap" as const,
                    overflow: "hidden",
                  }}>
                    <Star size={11} color="#FFC043" weight="fill" />
                    <span style={{
                      color: T.textSecondary,
                      fontSize: TYPE.caption2,
                      fontFamily: font,
                    }}>
                      {vendor.rating}
                    </span>
                    <span style={{ color: T.divider, fontSize: TYPE.caption2, fontFamily: font }}>·</span>
                    <Clock size={10} color={T.textTertiary} />
                    <span style={{
                      color: T.textSecondary,
                      fontSize: TYPE.caption2,
                      fontFamily: font,
                    }}>
                      {vendor.eta}
                    </span>
                    <span style={{ color: T.divider, fontSize: TYPE.caption2, fontFamily: font }}>·</span>
                    <span style={{
                      color: T.textTertiary,
                      fontSize: TYPE.caption2,
                      fontFamily: font,
                    }}>
                      {vendor.jobs} jobs
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* ── Confirm CTA — appears on selection ───────────── */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.22, ease: IOS }}
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirm}
                  style={{
                    width: "100%", height: 52,
                    backgroundColor: T.cta,
                    border: "none", borderRadius: R.md,
                    cursor: "pointer",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8,
                    boxShadow: "0 4px 20px rgba(255,77,0,0.38)",
                  }}
                >
                  <span style={{
                    color: "#000000",
                    fontSize: TYPE.callout,
                    fontWeight: 700,
                    letterSpacing: "-0.012em",
                    fontFamily: font,
                  }}>
                    {selected === "best" ? "Book Best Value" : "Book Fastest ETA"}
                  </span>
                  <span style={{
                    color: "rgba(0,0,0,0.55)",
                    fontSize: TYPE.callout,
                    fontWeight: 600,
                    fontFamily: font,
                  }}>
                    · ${chosenVendor?.price}
                  </span>
                  <ArrowRight size={16} color="#000000" weight="bold" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}