// ServiceTrackingScreen.tsx — Live vendor tracking (/home/tracking)
// Map-first. Sheet answers three questions: who, when, how to reach.
// Stat chips and license row removed — credibility lives in one tight line.

import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  CaretLeft, Phone, ChatText, Star,
  CheckFat, ShieldCheck,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { DCMap, type DCMapMarker } from "./DCMap";
import { T, font, R, HIG, TYPE } from "../tokens";
import { useIsMobile } from "./ui/use-mobile";
import { MapWithPanelLayout } from "./MapWithPanelLayout";

const IOS = [0.32, 0.72, 0, 1] as const;

// ─── Glass pill — matches HomeScreen / VendorOptionsScreen ───────
const GLASS = {
  backgroundColor: "rgba(0,0,0,0.52)",
  backdropFilter: "blur(14px) saturate(1.6)",
  WebkitBackdropFilter: "blur(14px) saturate(1.6)",
  border: "1px solid rgba(255,255,255,0.11)",
} as const;

// ─── Atlanta coordinates ──────────────────────────────────────────
const USER_POS:     [number, number] = [33.7490, -84.3882];
const VENDOR_START: [number, number] = [33.7710, -84.4150];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function parseEtaMinutes(eta: string): number {
  const m = eta.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 15;
}

// ─── Vendor profiles ──────────────────────────────────────────────
interface VendorProfile {
  fullName:   string;
  initials:   string;
  avatarHue:  number;
  jobs:       number;
  response:   string;
  licenseNo:  string;
  verified:   boolean;
}

const VENDOR_PROFILES: Record<string, VendorProfile> = {
  "Mike's Towing":        { fullName: "Marcus Williams",  initials: "MW", avatarHue: 220, jobs: 234, response: "< 4 min",  licenseNo: "GA-TWR-8821", verified: true },
  "QuickFix Pro":         { fullName: "Devon Carter",     initials: "DC", avatarHue: 170, jobs: 187, response: "< 5 min",  licenseNo: "GA-SVC-3310", verified: true },
  "Atlanta Plumbing Co.": { fullName: "James Okafor",     initials: "JO", avatarHue: 195, jobs: 512, response: "< 8 min",  licenseNo: "GA-PLB-1195", verified: true },
  "QuickFix Plumbing":    { fullName: "Terrell Hayes",    initials: "TH", avatarHue: 155, jobs: 298, response: "< 4 min",  licenseNo: "GA-PLB-4477", verified: true },
  "CoolAir Pro":          { fullName: "Sandra Reyes",     initials: "SR", avatarHue: 200, jobs: 389, response: "< 6 min",  licenseNo: "GA-HVC-2209", verified: true },
  "ThermoTech HVAC":      { fullName: "Brian Nguyen",     initials: "BN", avatarHue: 185, jobs: 201, response: "< 4 min",  licenseNo: "GA-HVC-5530", verified: true },
  "Watts Up Electric":    { fullName: "Andre Morrison",   initials: "AM", avatarHue: 35,  jobs: 441, response: "< 7 min",  licenseNo: "GA-ELC-7741", verified: true },
  "PowerPro Electric":    { fullName: "Chris Delgado",    initials: "CD", avatarHue: 25,  jobs: 183, response: "< 4 min",  licenseNo: "GA-ELC-9902", verified: true },
  "GreenScape Crew":      { fullName: "Malik Thompson",   initials: "MT", avatarHue: 130, jobs: 670, response: "< 5 min",  licenseNo: "GA-LSC-3381", verified: true },
  "CleanCut Pro":         { fullName: "Jamal Edwards",    initials: "JE", avatarHue: 115, jobs: 312, response: "< 3 min",  licenseNo: "GA-LSC-6612", verified: true },
  "FixIt Fast":           { fullName: "Roberto Sanchez",  initials: "RS", avatarHue: 260, jobs: 528, response: "< 5 min",  licenseNo: "GA-HMN-1124", verified: true },
  "AllFix Handyman":      { fullName: "Kevin Park",       initials: "KP", avatarHue: 280, jobs: 244, response: "< 3 min",  licenseNo: "GA-HMN-8873", verified: true },
  "AtlantaRoof Co.":      { fullName: "Darnell Brooks",   initials: "DB", avatarHue: 10,  jobs: 381, response: "< 10 min", licenseNo: "GA-RFG-0045", verified: true },
  "StormGuard Roofing":   { fullName: "Tyler Watts",      initials: "TW", avatarHue: 355, jobs: 196, response: "< 5 min",  licenseNo: "GA-RFG-3318", verified: true },
  "PestAway Atlanta":     { fullName: "Priya Nair",       initials: "PN", avatarHue: 80,  jobs: 492, response: "< 6 min",  licenseNo: "GA-PCT-7729", verified: true },
  "CleanHome Pest":       { fullName: "David Kim",        initials: "DK", avatarHue: 60,  jobs: 261, response: "< 4 min",  licenseNo: "GA-PCT-5540", verified: true },
};

const DEFAULT_PROFILE: VendorProfile = {
  fullName: "Alex Rivera", initials: "AR", avatarHue: 220,
  jobs: 300, response: "< 5 min", licenseNo: "GA-SVC-0000", verified: true,
};

// ─── Compact contact pill ─────────────────────────────────────────
function ContactPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      style={{
        flex: 1, height: 44,
        backgroundColor: T.surfaceElevated,
        border: `1px solid ${T.border}`,
        borderRadius: R.md,
        cursor: "pointer",
        display: "flex", alignItems: "center",
        justifyContent: "center", gap: 7,
      }}
    >
      {icon}
      <span style={{
        color: T.textSecondary,
        fontSize: TYPE.footnote,
        fontWeight: 600,
        fontFamily: font,
        letterSpacing: "-0.01em",
      }}>
        {label}
      </span>
    </motion.button>
  );
}

// ─── Main component ───────────────────────────────────────────────
export function ServiceTrackingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state    = location.state as Record<string, unknown> | null;
  const isMobile = useIsMobile();
  const m        = HIG.screenMargin;

  const vendor  = state?.vendor as { name: string; price: number; eta: string; rating: number } | undefined;
  const profile = VENDOR_PROFILES[vendor?.name ?? ""] ?? DEFAULT_PROFILE;

  const initialEta = parseEtaMinutes(vendor?.eta ?? "15 min");
  const [etaMins, setEtaMins]     = useState(initialEta);
  const [completed, setCompleted] = useState(false);

  // Countdown: 1 min every 8 s (demo pacing)
  useEffect(() => {
    if (etaMins <= 0) return;
    const t = setTimeout(() => setEtaMins((n) => Math.max(0, n - 1)), 8000);
    return () => clearTimeout(t);
  }, [etaMins]);

  // Vendor dot moves toward user as ETA counts down
  const progress   = initialEta > 0 ? Math.min(1, 1 - etaMins / initialEta) : 1;
  const vendorPos: [number, number] = [
    lerp(VENDOR_START[0], USER_POS[0], progress),
    lerp(VENDOR_START[1], USER_POS[1], progress),
  ];
  const midPoint: [number, number] = [
    lerp(vendorPos[0], USER_POS[0], 0.5),
    lerp(vendorPos[1], USER_POS[1], 0.5),
  ];

  const isArrived  = etaMins <= 0;
  const etaLabel   = isArrived ? "Arriving now" : `${etaMins} min away`;
  const statusText = isArrived ? "Arrived"      : "En route";

  const mapMarkers: DCMapMarker[] = useMemo(() => [
    { position: USER_POS,  type: "user" },
    { position: vendorPos, type: "vendor", initials: profile.initials, avatarColor: `hsl(${profile.avatarHue}, 55%, 42%)`, rating: String(vendor?.rating ?? 4.8) },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [vendorPos[0], vendorPos[1], vendor?.rating]);

  // Avatar colors — muted, dark-friendly
  const avatarBg     = `linear-gradient(135deg, hsl(${profile.avatarHue},42%,17%), hsl(${profile.avatarHue},32%,11%))`;
  const avatarBorder = `hsl(${profile.avatarHue},38%,26%)`;
  const avatarText   = `hsl(${profile.avatarHue},65%,68%)`;

  function handleCompleted() {
    setCompleted(true);
    setTimeout(() => navigate("/home/feedback", { state }), 900);
  }

  if (!isMobile) {
    return (
      <MapWithPanelLayout
        mapContent={
          <div style={{ height: "100%", position: "relative", overflow: "hidden", backgroundColor: T.bg, fontFamily: font }}>
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
              <DCMap center={midPoint} zoom={14} markers={mapMarkers} panTarget={midPoint} style={{ width: "100%", height: "100%" }} />
            </div>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 110, zIndex: 5, pointerEvents: "none", background: "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, transparent 100%)" }} />
            <motion.button
              whileTap={{ scale: 0.90 }}
              onClick={() => navigate(-1)}
              style={{ ...GLASS, position: "absolute", top: 14, left: m, zIndex: 20, width: 40, height: 40, borderRadius: R.full, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <CaretLeft size={18} color="#FFFFFF" weight="bold" />
            </motion.button>
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.28, ease: IOS }}
              style={{ position: "absolute", top: 14, right: m, zIndex: 20, ...GLASS, display: "flex", alignItems: "center", gap: 7, borderRadius: R.full, paddingTop: 9, paddingBottom: 9, paddingLeft: 12, paddingRight: 14 }}
            >
              <div style={{ position: "relative", width: 7, height: 7, flexShrink: 0 }}>
                <motion.div
                  animate={isArrived ? { scale: 1, opacity: 1 } : { scale: [1, 2.0, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: isArrived ? 0 : Infinity, ease: "easeInOut" }}
                  style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundColor: isArrived ? "#34C759" : "#FF4D00" }}
                />
                <div style={{ position: "absolute", width: 5, height: 5, top: 1, left: 1, borderRadius: "50%", backgroundColor: isArrived ? "#34C759" : "#FF4D00" }} />
              </div>
              <span style={{ color: "rgba(255,255,255,0.90)", fontSize: TYPE.caption1, fontWeight: 600, fontFamily: font, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{statusText}</span>
            </motion.div>
          </div>
        }
        panelContent={
          <div style={{ padding: "20px 20px 28px", fontFamily: font, display: "flex", flexDirection: "column" }}>
            <div style={{ height: 3, backgroundColor: T.border, borderRadius: 2, marginBottom: 18 }}>
              <motion.div
                animate={{ width: `${Math.round(progress * 100)}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                style={{ height: 3, borderRadius: 2, background: isArrived ? "#34C759" : `linear-gradient(to right, #FF4D00, #FF6A2B)`, boxShadow: isArrived ? "0 0 8px rgba(52,199,89,0.5)" : "0 0 8px rgba(255,77,0,0.45)", minWidth: 6 }}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <motion.div key={etaLabel} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: IOS }}>
                <span style={{ color: T.cta, fontSize: TYPE.title1, fontWeight: 800, fontFamily: font, letterSpacing: "-0.036em", lineHeight: 1 }}>{isArrived ? "Here" : etaMins}</span>
                {!isArrived && <span style={{ color: T.textTertiary, fontSize: TYPE.title3, fontWeight: 600, fontFamily: font, letterSpacing: "-0.022em", marginLeft: 6 }}>min away</span>}
                {isArrived && <span style={{ color: T.textTertiary, fontSize: TYPE.title3, fontWeight: 600, fontFamily: font, letterSpacing: "-0.022em", marginLeft: 6 }}>· Arriving now</span>}
              </motion.div>
            </div>
            <div style={{ height: "0.5px", backgroundColor: T.border, marginBottom: 16 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                {isArrived && (
                  <motion.div animate={{ scale: [1, 1.55, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", inset: -7, borderRadius: "50%", border: "2px solid #34C759", pointerEvents: "none" }} />
                )}
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: avatarBg, border: isArrived ? "1.5px solid #34C759" : `1.5px solid ${avatarBorder}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.4s" }}>
                  <span style={{ color: avatarText, fontSize: 15, fontWeight: 800, fontFamily: font, letterSpacing: "-0.02em" }}>{profile.initials}</span>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                  <span style={{ color: T.textPrimary, fontSize: TYPE.callout, fontWeight: 700, fontFamily: font, letterSpacing: "-0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.fullName}</span>
                  {profile.verified && <ShieldCheck size={13} color={T.cta} weight="fill" style={{ flexShrink: 0 }} />}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Star size={11} color="#FFC043" weight="fill" />
                  <span style={{ color: T.textSecondary, fontSize: TYPE.caption1, fontFamily: font }}>{vendor?.rating ?? "4.8"}</span>
                  <span style={{ color: T.divider, fontSize: TYPE.caption1, fontFamily: font }}>·</span>
                  <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>{profile.jobs} jobs</span>
                  <span style={{ color: T.divider, fontSize: TYPE.caption1, fontFamily: font }}>·</span>
                  <ShieldCheck size={10} color="#34C759" weight="fill" />
                  <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>Licensed</span>
                </div>
              </div>
              <div style={{ flexShrink: 0, textAlign: "right" }}>
                <span style={{ color: T.cta, fontSize: TYPE.title3, fontWeight: 800, fontFamily: font, letterSpacing: "-0.03em" }}>${vendor?.price ?? 0}</span>
              </div>
            </div>
            <div style={{ height: "0.5px", backgroundColor: T.border, marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <ContactPill label="Call" icon={<Phone    size={17} color={T.textSecondary} />} />
              <ContactPill label="Text" icon={<ChatText size={17} color={T.textSecondary} />} />
            </div>
            <div style={{ height: "0.5px", backgroundColor: T.border, marginBottom: 14 }} />
            <AnimatePresence mode="wait">
              {!completed ? (
                <motion.button
                  key="complete"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCompleted}
                  style={{ width: "100%", height: 52, backgroundColor: isArrived ? T.cta : "transparent", border: `1px solid ${isArrived ? "transparent" : T.border}`, borderRadius: R.md, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: isArrived ? "0 4px 20px rgba(255,77,0,0.38)" : "none", transition: "background-color 0.3s, border-color 0.3s, box-shadow 0.3s" }}
                >
                  <CheckFat size={17} color={isArrived ? "#000000" : T.textSecondary} weight={isArrived ? "fill" : "regular"} />
                  <span style={{ color: isArrived ? "#000000" : T.textSecondary, fontSize: TYPE.callout, fontWeight: 600, letterSpacing: "-0.012em", fontFamily: font, transition: "color 0.3s" }}>{isArrived ? "Confirm arrival & complete" : "Mark as complete"}</span>
                </motion.button>
              ) : (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.28, ease: IOS }}
                  style={{ height: 52, borderRadius: R.md, backgroundColor: "rgba(52,199,89,0.10)", border: "1px solid rgba(52,199,89,0.22)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <CheckFat size={17} color="#34C759" weight="fill" />
                  <span style={{ color: "#34C759", fontSize: TYPE.callout, fontWeight: 600, letterSpacing: "-0.012em", fontFamily: font }}>Service complete!</span>
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

      {/* ── Full-bleed live map ───────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <DCMap
          center={midPoint}
          zoom={14}
          markers={mapMarkers}
          panTarget={midPoint}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* ── Top vignette — back button legibility only ─────────── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 110, zIndex: 5, pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, transparent 100%)",
      }} />

      {/* ── Back button — frosted glass ───────────────────────── */}
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

      {/* ── Live status chip — top right ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.28, ease: IOS }}
        style={{
          position: "absolute", top: 14, right: m, zIndex: 20,
          ...GLASS,
          display: "flex", alignItems: "center", gap: 7,
          borderRadius: R.full,
          paddingTop: 9, paddingBottom: 9,
          paddingLeft: 12, paddingRight: 14,
        }}
      >
        {/* Pulsing dot */}
        <div style={{ position: "relative", width: 7, height: 7, flexShrink: 0 }}>
          <motion.div
            animate={isArrived ? { scale: 1, opacity: 1 } : { scale: [1, 2.0, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: isArrived ? 0 : Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              backgroundColor: isArrived ? "#34C759" : "#FF4D00",
            }}
          />
          <div style={{
            position: "absolute",
            width: 5, height: 5, top: 1, left: 1,
            borderRadius: "50%",
            backgroundColor: isArrived ? "#34C759" : "#FF4D00",
          }} />
        </div>
        <span style={{
          color: "rgba(255,255,255,0.90)",
          fontSize: TYPE.caption1,
          fontWeight: 600,
          fontFamily: font,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
        }}>
          {statusText}
        </span>
      </motion.div>

      {/* ── Bottom sheet ──────────────────────────────────────── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.14, duration: 0.44, ease: IOS }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 15,
          backgroundColor: T.bg,
          borderRadius: "20px 20px 0 0",
          borderTop: `0.5px solid ${T.border}`,
          paddingTop: 16, paddingBottom: 28,
          boxShadow: "0 -8px 40px rgba(0,0,0,0.42)",
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: 36, height: 4, backgroundColor: T.border,
          borderRadius: 2, margin: "0 auto 14px",
        }} />

        {/* ── Route progress bar — fills as vendor approaches ─── */}
        <div style={{ height: 3, backgroundColor: T.border, borderRadius: 2, marginBottom: 18, marginLeft: m, marginRight: m }}>
          <motion.div
            animate={{ width: `${Math.round(progress * 100)}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              height: 3, borderRadius: 2,
              background: isArrived
                ? "#34C759"
                : `linear-gradient(to right, #FF4D00, #FF6A2B)`,
              boxShadow: isArrived
                ? "0 0 8px rgba(52,199,89,0.5)"
                : "0 0 8px rgba(255,77,0,0.45)",
              minWidth: 6,
            }}
          />
        </div>

        <div style={{ paddingLeft: m, paddingRight: m }}>

          {/* ── ETA headline — dominant, answers "when?" ──────── */}
          <div style={{ marginBottom: 18 }}>
            <motion.div
              key={etaLabel}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: IOS }}
            >
              <span style={{
                color: T.cta,
                fontSize: TYPE.title1,
                fontWeight: 800,
                fontFamily: font,
                letterSpacing: "-0.036em",
                lineHeight: 1,
              }}>
                {isArrived ? "Here" : etaMins}
              </span>
              {!isArrived && (
                <span style={{
                  color: T.textTertiary,
                  fontSize: TYPE.title3,
                  fontWeight: 600,
                  fontFamily: font,
                  letterSpacing: "-0.022em",
                  marginLeft: 6,
                }}>
                  min away
                </span>
              )}
              {isArrived && (
                <span style={{
                  color: T.textTertiary,
                  fontSize: TYPE.title3,
                  fontWeight: 600,
                  fontFamily: font,
                  letterSpacing: "-0.022em",
                  marginLeft: 6,
                }}>
                  · Arriving now
                </span>
              )}
            </motion.div>
          </div>

          {/* ── Divider ───────────────────────────────────────── */}
          <div style={{ height: "0.5px", backgroundColor: T.border, marginBottom: 16 }} />

          {/* ── Vendor identity row — answers "who?" ──────────── */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            marginBottom: 12,
          }}>
            {/* Avatar with arrived pulse ring */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {isArrived && (
                <motion.div
                  animate={{ scale: [1, 1.55, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    inset: -7, borderRadius: "50%",
                    border: "2px solid #34C759",
                    pointerEvents: "none",
                  }}
                />
              )}
              <div style={{
                width: 46, height: 46, borderRadius: "50%",
                background: avatarBg,
                border: isArrived ? "1.5px solid #34C759" : `1.5px solid ${avatarBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "border-color 0.4s",
              }}>
                <span style={{
                  color: avatarText,
                  fontSize: 15, fontWeight: 800,
                  fontFamily: font, letterSpacing: "-0.02em",
                }}>
                  {profile.initials}
                </span>
              </div>
            </div>

            {/* Name + meta */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                <span style={{
                  color: T.textPrimary,
                  fontSize: TYPE.callout,
                  fontWeight: 700,
                  fontFamily: font,
                  letterSpacing: "-0.02em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {profile.fullName}
                </span>
                {profile.verified && (
                  <ShieldCheck size={13} color={T.cta} weight="fill" style={{ flexShrink: 0 }} />
                )}
              </div>
              {/* Single meta line: rating · jobs · responds */}
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Star size={11} color="#FFC043" weight="fill" />
                <span style={{ color: T.textSecondary, fontSize: TYPE.caption1, fontFamily: font }}>
                  {vendor?.rating ?? "4.8"}
                </span>
                <span style={{ color: T.divider, fontSize: TYPE.caption1, fontFamily: font }}>·</span>
                <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>
                  {profile.jobs} jobs
                </span>
                <span style={{ color: T.divider, fontSize: TYPE.caption1, fontFamily: font }}>·</span>
                <ShieldCheck size={10} color="#34C759" weight="fill" />
                <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>
                  Licensed
                </span>
              </div>
            </div>

            {/* Price — right-aligned */}
            <div style={{ flexShrink: 0, textAlign: "right" }}>
              <span style={{
                color: T.cta,
                fontSize: TYPE.title3,
                fontWeight: 800,
                fontFamily: font,
                letterSpacing: "-0.03em",
              }}>
                ${vendor?.price ?? 0}
              </span>
            </div>
          </div>

          {/* ── Divider ───────────────────────────────────────── */}
          <div style={{ height: "0.5px", backgroundColor: T.border, marginBottom: 12 }} />

          {/* ── Contact pills — answers "how to reach?" ───────── */}
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <ContactPill label="Call" icon={<Phone    size={17} color={T.textSecondary} />} />
            <ContactPill label="Text" icon={<ChatText size={17} color={T.textSecondary} />} />
          </div>

          {/* ── Divider ───────────────────────────────────────── */}
          <div style={{ height: "0.5px", backgroundColor: T.border, marginBottom: 14 }} />

          {/* ── Mark complete CTA — upgrades to orange on arrival ─── */}
          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.button
                key="complete"
                whileTap={{ scale: 0.97 }}
                onClick={handleCompleted}
                style={{
                  width: "100%", height: 52,
                  backgroundColor: isArrived ? T.cta : "transparent",
                  border: `1px solid ${isArrived ? "transparent" : T.border}`,
                  borderRadius: R.md, cursor: "pointer",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 8,
                  boxShadow: isArrived ? "0 4px 20px rgba(255,77,0,0.38)" : "none",
                  transition: "background-color 0.3s, border-color 0.3s, box-shadow 0.3s",
                }}
              >
                <CheckFat
                  size={17}
                  color={isArrived ? "#000000" : T.textSecondary}
                  weight={isArrived ? "fill" : "regular"}
                />
                <span style={{
                  color: isArrived ? "#000000" : T.textSecondary,
                  fontSize: TYPE.callout,
                  fontWeight: 600,
                  letterSpacing: "-0.012em",
                  fontFamily: font,
                  transition: "color 0.3s",
                }}>
                  {isArrived ? "Confirm arrival & complete" : "Mark as complete"}
                </span>
              </motion.button>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28, ease: IOS }}
                style={{
                  height: 52, borderRadius: R.md,
                  backgroundColor: "rgba(52,199,89,0.10)",
                  border: "1px solid rgba(52,199,89,0.22)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 8,
                }}
              >
                <CheckFat size={17} color="#34C759" weight="fill" />
                <span style={{
                  color: "#34C759",
                  fontSize: TYPE.callout,
                  fontWeight: 600,
                  letterSpacing: "-0.012em",
                  fontFamily: font,
                }}>
                  Service complete!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}