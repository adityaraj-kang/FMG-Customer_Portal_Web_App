// AddressScreen.tsx — Confirm service location (/home/address)
// Features: floating search bar, map-pin mode, saved addresses with icons, 2 recent locations.

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  CaretLeft, MapPin, MagnifyingGlass, House, Briefcase,
  Clock, X, MapTrifold, Check, NavigationArrow,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { DCMap } from "./DCMap";
import { T, font, R, HIG, TYPE } from "../tokens";

const IOS = [0.32, 0.72, 0, 1] as const;

// ─── Data ─────────────────────────────────────────────────────
interface AddrOption {
  id: string;
  label: string;
  address: string;
  sub: string;
  icon: "home" | "work";
}
interface RecentAddr {
  id: string;
  address: string;
  sub: string;
  service: string;
  time: string;
}

const SAVED: AddrOption[] = [
  { id: "home", label: "Home",  address: "3285 Peachtree Rd NE",  sub: "Atlanta, GA 30305", icon: "home" },
  { id: "work", label: "Work",  address: "191 Peachtree St NE",   sub: "Atlanta, GA 30303", icon: "work" },
];

const RECENT: RecentAddr[] = [
  { id: "r1", address: "45 Ivan Allen Jr Blvd NW", sub: "Atlanta, GA 30308", service: "Plumber", time: "2 days ago"  },
  { id: "r2", address: "500 10th St NE",            sub: "Atlanta, GA 30309", service: "Towing",  time: "1 week ago" },
];

const SEARCH_POOL = [
  { address: "3285 Peachtree Rd NE",           sub: "Atlanta, GA 30305" },
  { address: "191 Peachtree St NE",            sub: "Atlanta, GA 30303" },
  { address: "45 Ivan Allen Jr Blvd NW",       sub: "Atlanta, GA 30308" },
  { address: "500 10th St NE",                 sub: "Atlanta, GA 30309" },
  { address: "1 Hartsfield-Jackson Blvd",      sub: "Atlanta, GA 30320" },
  { address: "100 Centennial Olympic Park Dr", sub: "Atlanta, GA 30313" },
  { address: "75 5th St NW",                   sub: "Atlanta, GA 30308" },
  { address: "837 Memorial Dr SE",             sub: "Atlanta, GA 30316" },
  { address: "550 Pharr Rd NE",                sub: "Atlanta, GA 30305" },
  { address: "620 Joseph E Lowery Blvd",       sub: "Atlanta, GA 30310" },
];

// Map tap zones → resolved addresses
const MAP_ZONES = [
  { xMax: 0.33, yMax: 0.5,  address: "25 Park Place NE",           sub: "Atlanta, GA 30303" },
  { xMax: 0.66, yMax: 0.5,  address: "191 Peachtree St NE",        sub: "Atlanta, GA 30303" },
  { xMax: 1.0,  yMax: 0.5,  address: "550 Pharr Rd NE",            sub: "Atlanta, GA 30305" },
  { xMax: 0.33, yMax: 1.0,  address: "620 Joseph E Lowery Blvd",   sub: "Atlanta, GA 30310" },
  { xMax: 0.66, yMax: 1.0,  address: "500 10th St NE",             sub: "Atlanta, GA 30309" },
  { xMax: 1.0,  yMax: 1.0,  address: "1201 W Peachtree St NW",     sub: "Atlanta, GA 30309" },
];

function resolveMapAddress(xPct: number, yPct: number) {
  return (
    MAP_ZONES.find((z) => xPct <= z.xMax && yPct <= z.yMax) ??
    { address: "Unknown location", sub: "Atlanta, GA" }
  );
}

type Mode = "default" | "searching" | "mapping";

export function AddressScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state    = location.state as Record<string, unknown> | null;
  const m        = HIG.screenMargin;

  // ── State ──────────────────────────────────────────────────
  const [mode,        setMode]        = useState<Mode>("default");
  const [selected,    setSelected]    = useState({ address: SAVED[0].address, sub: SAVED[0].sub });
  const [searchQuery, setSearchQuery] = useState("");
  const [pinPos,      setPinPos]      = useState<{ x: number; y: number } | null>(null);
  const [resolving,   setResolving]   = useState(false);

  const mapRef   = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering search mode
  useEffect(() => {
    if (mode === "searching") setTimeout(() => inputRef.current?.focus(), 100);
  }, [mode]);

  // ── Search results ─────────────────────────────────────────
  const searchResults = searchQuery.trim().length > 0
    ? SEARCH_POOL.filter((r) =>
        r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.sub.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : SEARCH_POOL.slice(0, 5);

  // ── Map tap handler ────────────────────────────────────────
  function handleMapTap(e: React.MouseEvent<HTMLDivElement>) {
    if (mode !== "mapping" || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top)  / rect.height;
    setPinPos({ x: xPct * 100, y: yPct * 100 });
    setResolving(true);
    const resolved = resolveMapAddress(xPct, yPct);
    setTimeout(() => {
      setSelected(resolved);
      setResolving(false);
    }, 800);
  }

  // ── Confirm selection ──────────────────────────────────────
  function handleConfirm() {
    navigate("/home/loading", {
      state: { ...(state ?? {}), address: `${selected.address}, ${selected.sub}` },
    });
  }

  function pickAddress(address: string, sub: string) {
    setSelected({ address, sub });
    setMode("default");
    setSearchQuery("");
  }

  // ── Pin coordinates (as % of map container) ───────────────
  const pinX = pinPos ? pinPos.x : 50;
  const pinY = pinPos ? pinPos.y : 38;

  // ── Sheet height by mode ───────────────────────────────────
  const sheetHeightByMode: Record<Mode, string | number> = {
    default:  "auto",
    searching: "85%",
    mapping:  "auto",
  };

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
      {/* ── Map background ── */}
      <div
        ref={mapRef}
        onClick={handleMapTap}
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          cursor: mode === "mapping" ? "crosshair" : "default",
        }}
      >
        <DCMap markers={[]} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Map gradient */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.65) 72%, rgba(0,0,0,0.98) 100%)",
        }}
      />

      {/* ── Animated pin ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${pinX}-${pinY}`}
          style={{
            position: "absolute",
            left: `${pinX}%`,
            top: `${pinY}%`,
            transform: "translate(-50%, -100%)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: "none",
          }}
          initial={{ y: -16, opacity: 0, scale: 0.7 }}
          animate={{ y: 0,   opacity: 1, scale: 1   }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
        >
          {mode !== "mapping" && (
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.78)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.13)",
                borderRadius: R.md,
                paddingTop: 5, paddingBottom: 5, paddingLeft: 11, paddingRight: 11,
                marginBottom: 8,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "#fff", fontSize: TYPE.footnote, fontFamily: font, fontWeight: 500, letterSpacing: "-0.01em" }}>
                {resolving ? "Locating…" : selected.address.split(",")[0]}
              </span>
            </div>
          )}
          <MapPin size={38} color={T.cta} weight="fill" />
          <div style={{ width: 10, height: 5, marginTop: -2, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: "50%", filter: "blur(2px)" }} />
        </motion.div>
      </AnimatePresence>

      {/* ── Mapping mode instruction banner ── */}
      <AnimatePresence>
        {mode === "mapping" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: IOS }}
            style={{
              position: "absolute",
              top: 68, left: m, right: m,
              zIndex: 25,
              backgroundColor: "rgba(0,0,0,0.82)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: R.md,
              paddingTop: 10, paddingBottom: 10, paddingLeft: 14, paddingRight: 14,
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <NavigationArrow size={16} color={T.cta} weight="fill" />
            <span style={{ color: "#fff", fontSize: TYPE.footnote, fontFamily: font, flex: 1, letterSpacing: "-0.01em" }}>
              Tap anywhere on the map to drop your pin
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Back button ── */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        onClick={() => mode !== "default" ? setMode("default") : navigate(-1)}
        style={{
          position: "absolute", top: 12, left: 12, zIndex: 30,
          width: 40, height: 40, borderRadius: R.full,
          backgroundColor: "rgba(0,0,0,0.65)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <CaretLeft size={20} color="#FFFFFF" weight="bold" />
      </motion.button>

      {/* ── Floating search bar ── */}
      <AnimatePresence>
        {mode === "default" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: IOS }}
            style={{
              position: "absolute", top: 12,
              left: 64, right: 12,
              zIndex: 25,
            }}
          >
            <div
              style={{
                height: 40,
                backgroundColor: "rgba(15,15,15,0.82)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${mode === "searching" ? T.cta : "rgba(255,255,255,0.14)"}`,
                borderRadius: R.full,
                display: "flex", alignItems: "center",
                paddingLeft: 12, paddingRight: 10, gap: 8,
                transition: "border-color 0.18s",
                cursor: mode === "searching" ? "text" : "pointer",
              }}
              onClick={() => mode !== "searching" && setMode("searching")}
            >
              <MagnifyingGlass size={15} color={mode === "searching" ? T.cta : "rgba(255,255,255,0.5)"} weight="bold" />
              <input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any address…"
                readOnly={mode !== "searching"}
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "#fff", fontSize: TYPE.footnote, fontFamily: font,
                  letterSpacing: "-0.01em", cursor: mode === "searching" ? "text" : "pointer",
                }}
              />
              {mode === "searching" && searchQuery.length > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setSearchQuery(""); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
                >
                  <X size={14} color="rgba(255,255,255,0.5)" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom Sheet ── */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.42, ease: IOS }}
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          backgroundColor: T.bg,
          fontFamily: font,
          borderRadius: "20px 20px 0 0",
          zIndex: 20,
          boxShadow: "0 -4px 40px rgba(0,0,0,0.7)",
          maxHeight: sheetHeightByMode[mode],
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Handle */}
        <div style={{ flexShrink: 0, paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, backgroundColor: T.border, borderRadius: 2, margin: "0 auto" }} />
        </div>

        {/* ═══════════════════════════════════════════════
            MODE: default — saved + recent addresses
            ═══════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {mode === "default" && (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ paddingBottom: 24 }}
            >
              {/* ── Selected address hero ── */}
              <div style={{ paddingLeft: m, paddingRight: m, paddingTop: 14, paddingBottom: 16 }}>
                <div
                  style={{
                    backgroundColor: T.surfaceElevated,
                    border: `1.5px solid ${T.cta}`,
                    borderRadius: R.lg,
                    padding: "14px 16px",
                    display: "flex", alignItems: "flex-start", gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 38, height: 38, borderRadius: R.full,
                      backgroundColor: "rgba(255,77,0,0.14)",
                      border: "1px solid rgba(255,77,0,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={18} color={T.cta} weight="fill" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 3 }}>
                      Service location
                    </span>
                    <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 700, fontFamily: font, letterSpacing: "-0.02em", marginBottom: 2 }}>
                      {selected.address}
                    </span>
                    <span style={{ color: T.textTertiary, fontSize: TYPE.footnote, fontFamily: font }}>
                      {selected.sub}
                    </span>
                  </div>
                  <div
                    style={{
                      width: 22, height: 22, borderRadius: R.full,
                      backgroundColor: T.cta,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 4,
                    }}
                  >
                    <Check size={12} color="#000" weight="bold" />
                  </div>
                </div>
              </div>

              {/* Scrollable address lists */}
              <div style={{ overflowY: "auto", paddingLeft: m, paddingRight: m, maxWidth: 560, margin: "0 auto", width: "100%" }}>

                {/* ── Saved addresses ── */}
                <span style={{ display: "block", color: T.textTertiary, fontSize: TYPE.caption1, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8, fontFamily: font }}>
                  Saved
                </span>
                <div
                  style={{
                    backgroundColor: T.surfaceElevated,
                    border: `1px solid ${T.border}`,
                    borderRadius: R.lg,
                    overflow: "hidden",
                    marginBottom: 20,
                  }}
                >
                  {SAVED.map((addr, i) => {
                    const Icon = addr.icon === "home" ? House : Briefcase;
                    const isSel = selected.address === addr.address;
                    return (
                      <div key={addr.id}>
                        {i > 0 && <div style={{ height: "0.5px", backgroundColor: T.divider, marginLeft: 56 }} />}
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          onClick={() => pickAddress(addr.address, addr.sub)}
                          style={{
                            width: "100%", background: "none", border: "none",
                            cursor: "pointer", display: "flex", alignItems: "center",
                            gap: 12, padding: "13px 14px",
                            backgroundColor: isSel ? "rgba(255,77,0,0.05)" : "transparent",
                            transition: "background-color 0.15s",
                            textAlign: "left",
                          }}
                        >
                          <div
                            style={{
                              width: 34, height: 34, borderRadius: R.full, flexShrink: 0,
                              backgroundColor: isSel ? "rgba(255,77,0,0.14)" : T.surfaceElevated,
                              border: `1px solid ${isSel ? "rgba(255,77,0,0.3)" : T.border}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "background-color 0.15s, border-color 0.15s",
                            }}
                          >
                            <Icon size={16} color={isSel ? T.cta : T.textSecondary} weight="regular" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ display: "block", color: T.textSecondary, fontSize: TYPE.caption2, fontFamily: font, marginBottom: 2, fontWeight: 600, letterSpacing: "-0.005em" }}>
                              {addr.label}
                            </span>
                            <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.footnote, fontFamily: font, fontWeight: 500, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {addr.address}
                            </span>
                            <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>
                              {addr.sub}
                            </span>
                          </div>
                          {isSel && (
                            <div style={{ width: 18, height: 18, borderRadius: R.full, backgroundColor: T.cta, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Check size={10} color="#000" weight="bold" />
                            </div>
                          )}
                        </motion.button>
                      </div>
                    );
                  })}
                </div>

                {/* ── Recent locations ── */}
                <span style={{ display: "block", color: T.textTertiary, fontSize: TYPE.caption1, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8, fontFamily: font }}>
                  Recent
                </span>
                <div
                  style={{
                    backgroundColor: T.surfaceElevated,
                    border: `1px solid ${T.border}`,
                    borderRadius: R.lg,
                    overflow: "hidden",
                    marginBottom: 16,
                  }}
                >
                  {RECENT.map((addr, i) => {
                    const isSel = selected.address === addr.address;
                    return (
                      <div key={addr.id}>
                        {i > 0 && <div style={{ height: "0.5px", backgroundColor: T.divider, marginLeft: 56 }} />}
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          onClick={() => pickAddress(addr.address, addr.sub)}
                          style={{
                            width: "100%", background: "none", border: "none",
                            cursor: "pointer", display: "flex", alignItems: "center",
                            gap: 12, padding: "13px 14px",
                            backgroundColor: isSel ? "rgba(255,77,0,0.05)" : "transparent",
                            transition: "background-color 0.15s",
                            textAlign: "left",
                          }}
                        >
                          <div
                            style={{
                              width: 34, height: 34, borderRadius: R.full, flexShrink: 0,
                              backgroundColor: T.surfaceElevated,
                              border: `1px solid ${T.border}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <Clock size={16} color={T.textSecondary} weight="regular" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                              <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font, fontWeight: 600 }}>
                                {addr.service}
                              </span>
                              <div style={{ width: 2, height: 2, borderRadius: "50%", backgroundColor: T.textTertiary }} />
                              <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>
                                {addr.time}
                              </span>
                            </div>
                            <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.footnote, fontFamily: font, fontWeight: 500, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {addr.address}
                            </span>
                            <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>
                              {addr.sub}
                            </span>
                          </div>
                          {isSel && (
                            <div style={{ width: 18, height: 18, borderRadius: R.full, backgroundColor: T.cta, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Check size={10} color="#000" weight="bold" />
                            </div>
                          )}
                        </motion.button>
                      </div>
                    );
                  })}
                </div>

                {/* ── Set via map pin ── */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  onClick={() => { setMode("mapping"); setPinPos(null); }}
                  style={{
                    width: "100%", height: 44,
                    backgroundColor: T.surfaceElevated,
                    border: `1px solid ${T.border}`,
                    borderRadius: R.md,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <MapTrifold size={17} color={T.textSecondary} weight="regular" />
                  <span style={{ color: T.textSecondary, fontSize: TYPE.subhead, fontFamily: font, letterSpacing: "-0.01em" }}>
                    Set via map pin
                  </span>
                </motion.button>
              </div>

              {/* ── Confirm CTA ── */}
              <div style={{ paddingLeft: m, paddingRight: m }}>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  onClick={handleConfirm}
                  style={{
                    width: "100%", height: 52,
                    backgroundColor: T.cta, border: "none", borderRadius: R.md,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  <MapPin size={18} color="#000000" weight="fill" />
                  <span style={{ color: "#000000", fontSize: TYPE.callout, fontWeight: 600, letterSpacing: "-0.01em", fontFamily: font }}>
                    Confirm Location
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════
              MODE: searching — search input + results
              ═══════════════════════════════════════════════ */}
          {mode === "searching" && (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}
            >
              {/* Search input inside sheet */}
              <div style={{ paddingLeft: m, paddingRight: m, paddingTop: 12, paddingBottom: 0, flexShrink: 0 }}>
                <div
                  style={{
                    height: 44,
                    backgroundColor: T.surfaceElevated,
                    border: `1.5px solid ${T.cta}`,
                    borderRadius: R.full,
                    display: "flex", alignItems: "center",
                    paddingLeft: 14, paddingRight: 10, gap: 10,
                  }}
                >
                  <MagnifyingGlass size={16} color={T.cta} weight="bold" />
                  <input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any address…"
                    style={{
                      flex: 1, background: "none", border: "none", outline: "none",
                      color: T.textPrimary, fontSize: TYPE.subhead, fontFamily: font,
                      letterSpacing: "-0.01em",
                    }}
                  />
                  {searchQuery.length > 0 ? (
                    <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                      <X size={15} color={T.textTertiary} />
                    </button>
                  ) : (
                    <button onClick={() => setMode("default")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                      <X size={15} color={T.textTertiary} />
                    </button>
                  )}
                </div>
              </div>

              {/* Search results */}
              <div style={{ flex: 1, overflowY: "auto", paddingTop: 12 }}>
                {searchResults.length === 0 ? (
                  <div style={{ paddingTop: 40, textAlign: "center" }}>
                    <span style={{ color: T.textTertiary, fontSize: TYPE.subhead, fontFamily: font }}>No addresses found</span>
                  </div>
                ) : (
                  <div style={{ backgroundColor: T.surfaceElevated, border: `1px solid ${T.border}`, borderRadius: R.lg, overflow: "hidden", marginLeft: m, marginRight: m, marginBottom: 16 }}>
                    {searchResults.map((r, i) => (
                      <div key={i}>
                        {i > 0 && <div style={{ height: "0.5px", backgroundColor: T.divider, marginLeft: 52 }} />}
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          onClick={() => pickAddress(r.address, r.sub)}
                          style={{
                            width: "100%", background: "none", border: "none",
                            cursor: "pointer", display: "flex", alignItems: "center",
                            gap: 12, padding: "13px 14px", textAlign: "left",
                          }}
                        >
                          <div
                            style={{
                              width: 34, height: 34, borderRadius: R.full, flexShrink: 0,
                              backgroundColor: T.surfaceElevated, border: `1px solid ${T.border}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <MapPin size={15} color={T.textSecondary} weight="regular" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.footnote, fontFamily: font, fontWeight: 500, letterSpacing: "-0.01em" }}>
                              {r.address}
                            </span>
                            <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>
                              {r.sub}
                            </span>
                          </div>
                        </motion.button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════
              MODE: mapping — minimal "use this location" sheet
              ═══════════════════════════════════════════════ */}
          {mode === "mapping" && (
            <motion.div
              key="mapping"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ paddingLeft: m, paddingRight: m, paddingTop: 14, paddingBottom: 24 }}
            >
              {/* Resolved address preview */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  backgroundColor: T.surfaceElevated, border: `1px solid ${T.border}`,
                  borderRadius: R.lg, padding: "12px 14px",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 36, height: 36, borderRadius: R.full,
                    backgroundColor: resolving ? T.surfaceElevated : "rgba(255,77,0,0.12)",
                    border: `1px solid ${resolving ? T.border : "rgba(255,77,0,0.3)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "background-color 0.3s",
                  }}
                >
                  {resolving ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${T.border}`, borderTopColor: T.cta }}
                    />
                  ) : (
                    <MapPin size={16} color={T.cta} weight="fill" />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font, marginBottom: 2 }}>
                    {resolving ? "Resolving address…" : "Pin location"}
                  </span>
                  <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.footnote, fontFamily: font, fontWeight: 500, letterSpacing: "-0.01em" }}>
                    {resolving ? "—" : (pinPos ? selected.address : "Tap the map to place pin")}
                  </span>
                  {!resolving && pinPos && (
                    <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>{selected.sub}</span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  onClick={() => setMode("default")}
                  style={{
                    flex: 1, height: 52,
                    backgroundColor: T.surfaceElevated, border: `1px solid ${T.border}`,
                    borderRadius: R.md, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: T.textSecondary, fontSize: TYPE.callout, fontFamily: font,
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={pinPos && !resolving ? { scale: 0.96 } : {}}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  onClick={() => pinPos && !resolving && setMode("default")}
                  style={{
                    flex: 2, height: 52,
                    backgroundColor: pinPos && !resolving ? T.cta : T.surfaceElevated,
                    border: `1px solid ${pinPos && !resolving ? T.cta : T.border}`,
                    borderRadius: R.md,
                    cursor: pinPos && !resolving ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "background-color 0.2s, border-color 0.2s",
                  }}
                >
                  <span style={{ color: pinPos && !resolving ? "#000000" : T.textTertiary, fontSize: TYPE.callout, fontWeight: 600, fontFamily: font, letterSpacing: "-0.01em", transition: "color 0.2s" }}>
                    Use this location
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}