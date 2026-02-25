// VendorLoadingScreen.tsx — Genie calling & negotiating (/home/loading)
// Full-screen map + pulsing radar animation + animated status panel.
// Auto-navigates to /home/options after ~3.6 s.

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { CaretLeft } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { DCMap } from "./DCMap";
import { T, font, R, HIG, TYPE } from "../tokens";

const IOS = [0.32, 0.72, 0, 1] as const;

const VENDOR_COUNTS: Record<string, number> = {
  towing: 14, plumber: 9, hvac: 7, electrician: 11,
  lawn: 8, handyman: 6, roofing: 5, pest: 10,
};

export function VendorLoadingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state    = location.state as Record<string, unknown> | null;
  const m        = HIG.screenMargin;

  const serviceId   = (state?.serviceId as string | undefined) ?? "service";
  const serviceName = (state?.serviceName as string | undefined) ?? "Service";
  const maxCount    = VENDOR_COUNTS[serviceId] ?? 10;

  const [callCount,    setCallCount]    = useState(0);
  const [phase,        setPhase]        = useState<"calling" | "negotiating" | "done">("calling");
  const [bestPrice,    setBestPrice]    = useState<number | null>(null);

  useEffect(() => {
    // Count up to maxCount over ~1.6 s
    let n = 0;
    const interval = setInterval(() => {
      n++;
      setCallCount(n);
      if (n >= maxCount) clearInterval(interval);
    }, 1600 / maxCount);

    const t1 = setTimeout(() => setPhase("negotiating"), 1800);
    const t2 = setTimeout(() => setBestPrice(75 + Math.floor(Math.random() * 40) * 5), 2600);
    const t3 = setTimeout(() => {
      setPhase("done");
    }, 3200);
    const t4 = setTimeout(() => {
      navigate("/home/options", { state });
    }, 3700);

    return () => {
      clearInterval(interval);
      [t1, t2, t3, t4].forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressPct =
    phase === "calling"      ? Math.min((callCount / maxCount) * 55, 55)
    : phase === "negotiating" ? 78
    : 100;

  const statusLine =
    phase === "calling"      ? `Calling ${callCount} / ${maxCount} ${serviceName.toLowerCase()} providers…`
    : phase === "negotiating" ? `Negotiating with top vendors for the best deal…`
    : `Best deal found — presenting options!`;

  // Segmented bar: 5 segments of 20% each, with 4px gaps
  const segments = [0, 20, 40, 60, 80];

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
      {/* ── SVG city-grid map background ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <DCMap markers={[]} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none", zIndex: 1,
        }}
      />

      {/* ── Back button ── */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute", top: 12, left: 12, zIndex: 20,
          width: 40, height: 40, borderRadius: R.full,
          backgroundColor: "rgba(0,0,0,0.65)",
          border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(12px)",
        }}
      >
        <CaretLeft size={20} color="#FFFFFF" weight="bold" />
      </button>

      {/* ── Radar animation (center of map area) ── */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 5,
          width: 0, height: 0,
        }}
      >
        {/* Three concentric rings — staggered ripple */}
        {([
          { r: 54,  dur: 1.6, delay: 0,   alpha: 0.55 },
          { r: 96,  dur: 1.9, delay: 0.42, alpha: 0.34 },
          { r: 138, dur: 2.2, delay: 0.84, alpha: 0.18 },
        ] as const).map(({ r, dur, delay, alpha }, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: r * 2, height: r * 2,
              top: -r, left: -r,
              borderRadius: "50%",
              border: `1.5px solid ${T.cta}`,
            }}
            animate={{ scale: [0.45, 1.7, 0.45], opacity: [alpha, 0, alpha] }}
            transition={{ duration: dur, repeat: Infinity, ease: "easeOut", delay }}
          />
        ))}

        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            width: 12, height: 12,
            top: -6, left: -6,
            borderRadius: "50%",
            backgroundColor: T.cta,
            boxShadow: "0 0 12px rgba(255,77,0,0.65)",
          }}
        />

        {/* Vendor price blips — appear progressively during scan */}
        {([
          { angle: 35,  r: 78,  price: "$85",  d: 1.0 },
          { angle: 148, r: 56,  price: "$95",  d: 1.55 },
          { angle: 218, r: 100, price: "$110", d: 2.1  },
          { angle: 308, r: 70,  price: "$75",  d: 2.65 },
        ] as const).map(({ angle, r, price, d }, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: d, duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              style={{
                position: "absolute",
                left: r * Math.cos(rad),
                top:  r * Math.sin(rad),
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(13,13,13,0.85)",
                border: `1px solid ${T.cta}`,
                borderRadius: R.full,
                paddingLeft: 7, paddingRight: 7,
                height: 22,
                display: "flex", alignItems: "center",
                backdropFilter: "blur(8px)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: T.cta, fontSize: 10, fontWeight: 700, fontFamily: font }}>
                {price}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* ── Bottom Panel ── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.42, ease: IOS }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          backgroundColor: T.bg,
          borderTop: `1px solid ${T.border}`,
          fontFamily: font,
          paddingTop: 20,
          paddingBottom: 32,
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, backgroundColor: T.border, borderRadius: 2, margin: "0 auto 20px" }} />

        <div style={{ paddingLeft: m, paddingRight: m, maxWidth: 400, margin: "0 auto", width: "100%" }}>
          {/* Status dot + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <motion.div
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: T.cta, flexShrink: 0 }}
            />
            <h2 style={{ margin: 0, color: T.textPrimary, fontSize: TYPE.title3, fontWeight: 700, letterSpacing: "-0.022em", fontFamily: font }}>
              {phase === "done" ? "Deals found!" : `Finding ${serviceName} vendors`}
            </h2>
          </div>

          {/* Animated status line */}
          <AnimatePresence mode="wait">
            <motion.p
              key={statusLine}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{ margin: "0 0 18px", color: T.textSecondary, fontSize: TYPE.subhead, fontFamily: font, letterSpacing: "-0.01em", lineHeight: 1.55 }}
            >
              {statusLine}
            </motion.p>
          </AnimatePresence>

          {/* ── Segmented progress bar — Blinkit precision feel ── */}
          <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
            {segments.map((threshold, i) => {
              const segProgress = Math.min(1, Math.max(0, (progressPct - threshold) / 20));
              return (
                <div
                  key={i}
                  style={{
                    flex: 1, height: 3, borderRadius: 2,
                    backgroundColor: T.surfaceElevated,
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    style={{ height: "100%", backgroundColor: T.cta, borderRadius: 2 }}
                    animate={{ width: `${segProgress * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              );
            })}
          </div>

          {/* Stats row — tabular figures */}
          <div style={{ display: "flex", gap: 20 }}>
            <div>
              <span style={{
                display: "block",
                color: T.textPrimary,
                fontSize: TYPE.headline,
                fontWeight: 700,
                fontFamily: font,
                letterSpacing: "-0.02em",
                fontVariantNumeric: "tabular-nums",
              }}>
                {callCount}
              </span>
              <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font, letterSpacing: "0.005em" }}>
                Vendors called
              </span>
            </div>
            {bestPrice && (
              <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
                <span style={{
                  display: "block",
                  color: T.cta,
                  fontSize: TYPE.headline,
                  fontWeight: 700,
                  fontFamily: font,
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  ${bestPrice}
                </span>
                <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font, letterSpacing: "0.005em" }}>
                  Best price found
                </span>
              </motion.div>
            )}
            {phase !== "calling" && (
              <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
                <span style={{
                  display: "block",
                  color: T.textPrimary,
                  fontSize: TYPE.headline,
                  fontWeight: 700,
                  fontFamily: font,
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  3
                </span>
                <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font, letterSpacing: "0.005em" }}>
                  Top options
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}