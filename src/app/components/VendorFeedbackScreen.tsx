// VendorFeedbackScreen.tsx — Post-service vendor rating (/home/feedback)
// Animated success hero, 5-star rating, compliment badges, text area, photo upload.
// Submit → /home/activity

import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  X, Star, Trophy, Smiley, Clock, Briefcase, Wrench,
  ImageSquare, CheckCircle, ArrowRight,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";

const IOS = [0.32, 0.72, 0, 1] as const;

// ─── Pre-computed particle configs per star (8 particles each) ──
const STAR_PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  angle: (i / 8) * Math.PI * 2,
  dist:  22 + (i % 3) * 8,
  color: i % 2 === 0 ? "#FFC043" : "#FF4D00",
  size:  i % 3 === 0 ? 6 : 4,
}));

// ─── Rating labels ────────────────────────────────────────────
const RATING_LABELS: Record<number, string> = {
  0: "Tap to rate",
  1: "Needs improvement",
  2: "Fair",
  3: "Good job!",
  4: "Great work!",
  5: "Outstanding!",
};

// ─── Compliment badges ────────────────────────────────────────
interface Badge { id: string; label: string; IconEl: React.ElementType }
const BADGES: Badge[] = [
  { id: "champion",     label: "Champion",     IconEl: Trophy    },
  { id: "friendly",     label: "Friendly",     IconEl: Smiley    },
  { id: "punctual",     label: "Punctual",     IconEl: Clock     },
  { id: "professional", label: "Professional", IconEl: Briefcase },
  { id: "skilled",      label: "Skilled",      IconEl: Wrench    },
];

export function VendorFeedbackScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state    = location.state as Record<string, unknown> | null;
  const m        = HIG.screenMargin;

  const vendor      = state?.vendor as { name: string } | undefined;
  const serviceName = (state?.serviceName as string | undefined) ?? "Service";

  const [stars,        setStars]        = useState(0);
  const [hoveredStar,  setHoveredStar]  = useState(0);
  const [burstKey,     setBurstKey]     = useState<{ star: number; id: number } | null>(null);
  const [badges,       setBadges]       = useState<Set<string>>(new Set());
  const [comment,      setComment]      = useState("");
  const [photoAdded,   setPhotoAdded]   = useState(false);
  const [submitted,    setSubmitted]    = useState(false);

  const displayStars = hoveredStar || stars;

  function toggleBadge(id: string) {
    setBadges((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleStarClick(n: number) {
    setStars(n);
    setBurstKey({ star: n, id: Date.now() });
  }

  function handleSubmit() {
    if (stars === 0) return;
    setSubmitted(true);
    setTimeout(() => navigate("/home/activity"), 1800);
  }

  return (
    <div
      style={{
        height: "100%",
        backgroundColor: T.bg,
        display: "flex",
        flexDirection: "column",
        fontFamily: font,
      }}
    >
      <style>{`.fb-textarea::placeholder { color: ${T.textTertiary}; }`}</style>

      {/* ── Header ── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex", alignItems: "center",
          paddingLeft: 4, paddingRight: m,
          paddingTop: 8, paddingBottom: 8,
          minHeight: 56,
          borderBottom: `0.5px solid ${T.border}`,
        }}
      >
        <button
          onClick={() => navigate("/home/activity")}
          style={{
            minWidth: HIG.minTapTarget, minHeight: HIG.minTapTarget,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", flexShrink: 0,
          }}
        >
          <X size={20} color={T.textPrimary} weight="bold" />
        </button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: T.textPrimary, fontSize: TYPE.headline, fontWeight: 700, letterSpacing: "-0.022em", fontFamily: font }}>
            Rate your service
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget, flexShrink: 0 }} />
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto", maxWidth: 560, margin: "0 auto", width: "100%" }}>

        {/* ── Animated success hero ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 28, paddingBottom: 20 }}>
          {/* Check circle — tinted, not fully saturated */}
          <div style={{ position: "relative", width: 72, height: 72, marginBottom: 16 }}>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
              style={{
                width: 72, height: 72, borderRadius: "50%",
                backgroundColor: "rgba(48,209,88,0.10)",
                border: "1px solid rgba(48,209,88,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <CheckCircle size={32} color="#30D158" weight="fill" />
            </motion.div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{
              margin: "0 0 4px",
              color: T.textPrimary, fontSize: TYPE.title2, fontWeight: 700,
              letterSpacing: "-0.022em", fontFamily: font,
            }}
          >
            Service Complete!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{ margin: 0, color: T.textTertiary, fontSize: TYPE.subhead, fontFamily: font }}
          >
            {vendor?.name ?? "Your vendor"} · {serviceName}
          </motion.p>
        </div>

        {/* ── Star rating ── */}
        <div style={{ paddingLeft: m, paddingRight: m, marginBottom: 24 }}>
          <div
            style={{
              backgroundColor: T.surfaceElevated,
              border: `1px solid ${T.border}`,
              borderRadius: R.lg,
              paddingTop: 18, paddingRight: 16, paddingBottom: 18, paddingLeft: 16,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
            }}
          >
            {/* Dynamic rating label */}
            <AnimatePresence mode="wait">
              <motion.span
                key={displayStars}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                style={{
                  color: displayStars > 0 ? T.textPrimary : T.textTertiary,
                  fontSize: TYPE.title3,
                  fontWeight: 700,
                  fontFamily: font,
                  letterSpacing: "-0.02em",
                }}
              >
                {RATING_LABELS[displayStars]}
              </motion.span>
            </AnimatePresence>

            {/* Stars */}
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.80 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  onClick={() => handleStarClick(n)}
                  onMouseEnter={() => setHoveredStar(n)}
                  onMouseLeave={() => setHoveredStar(0)}
                  style={{
                    position: "relative",
                    width: 44, height: 44,
                    background: "none", border: "none",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 0,
                    overflow: "visible",
                  }}
                >
                  <motion.div
                    animate={n <= displayStars ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <Star
                      size={36}
                      color={n <= displayStars ? "#FFC043" : "rgba(255,255,255,0.22)"}
                      weight={n <= displayStars ? "fill" : "regular"}
                    />
                  </motion.div>

                  {/* Particle burst — fires when this star is the burst target */}
                  <AnimatePresence>
                    {burstKey?.star === n && (
                      <div key={burstKey.id} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
                        {STAR_PARTICLES.map((p, pi) => (
                          <motion.div
                            key={pi}
                            style={{
                              position: "absolute",
                              width: p.size, height: p.size,
                              borderRadius: "50%",
                              backgroundColor: p.color,
                              left: "50%", top: "50%",
                              marginLeft: -p.size / 2, marginTop: -p.size / 2,
                            }}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            animate={{
                              x: Math.cos(p.angle) * p.dist,
                              y: Math.sin(p.angle) * p.dist,
                              opacity: 0,
                              scale: 0.1,
                            }}
                            transition={{ duration: 0.45, ease: "easeOut", delay: pi * 0.015 }}
                          />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Compliment badges ── */}
        <div style={{ paddingLeft: m, paddingRight: m, marginBottom: 24 }}>
          <span
            style={{
              display: "block", marginBottom: 14,
              color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 700,
              letterSpacing: "-0.02em", fontFamily: font,
            }}
          >
            Give your vendor a compliment
          </span>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {BADGES.map((badge) => {
              const isSelected = badges.has(badge.id);
              const Icon = badge.IconEl;
              return (
                <motion.button
                  key={badge.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleBadge(badge.id)}
                  style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 6,
                    background: "none", border: "none",
                    cursor: "pointer", padding: 0,
                  }}
                >
                  <div
                    style={{
                      width: 52, height: 52, borderRadius: "50%",
                      backgroundColor: isSelected ? "rgba(255,77,0,0.12)" : T.surfaceElevated,
                      border: `2px solid ${isSelected ? T.cta : T.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "border-color 0.15s, background-color 0.15s",
                    }}
                  >
                    <Icon size={22} color={isSelected ? T.cta : T.textTertiary} weight="regular" />
                  </div>
                  <span
                    style={{
                      color: isSelected ? T.cta : T.textTertiary,
                      fontSize: TYPE.caption2,
                      fontFamily: font,
                      letterSpacing: "-0.01em",
                      transition: "color 0.15s",
                    }}
                  >
                    {badge.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Tell us more ── */}
        <div style={{ paddingLeft: m, paddingRight: m, marginBottom: 24 }}>
          <span
            style={{
              display: "block", marginBottom: 10,
              color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 700,
              letterSpacing: "-0.02em", fontFamily: font,
            }}
          >
            Tell us more
          </span>
          <div
            style={{
              backgroundColor: T.surfaceElevated,
              border: `1px solid ${T.border}`,
              borderRadius: R.md,
              paddingTop: 12, paddingRight: 14, paddingBottom: 12, paddingLeft: 14,
              marginBottom: 10,
            }}
          >
            <textarea
              className="fb-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How did the service go? Any feedback helps future customers…"
              rows={4}
              style={{
                width: "100%", background: "none", border: "none", outline: "none",
                color: T.textPrimary, fontSize: TYPE.subhead, fontFamily: font,
                letterSpacing: "-0.01em", lineHeight: 1.55,
                resize: "none" as const,
                boxSizing: "border-box" as const,
              }}
            />
          </div>

          {/* Add photos button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhotoAdded(true)}
            style={{
              width: "100%", height: 46,
              backgroundColor: photoAdded ? "rgba(255,77,0,0.08)" : T.surfaceElevated,
              border: `1px solid ${photoAdded ? T.cta : T.border}`,
              borderRadius: R.md,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "border-color 0.15s, background-color 0.15s",
            }}
          >
            <ImageSquare size={18} color={photoAdded ? T.cta : T.textTertiary} weight={photoAdded ? "fill" : "regular"} />
            <span
              style={{
                color: photoAdded ? T.cta : T.textTertiary,
                fontSize: TYPE.subhead, fontFamily: font, letterSpacing: "-0.01em",
              }}
            >
              {photoAdded ? "Photos added ✓" : "Add photos"}
            </span>
          </motion.button>
        </div>

        <div style={{ height: 8 }} />
      </div>

      {/* ── Submit CTA ── */}
      <div
        style={{
          flexShrink: 0,
          paddingTop: 10, paddingRight: m, paddingBottom: 16, paddingLeft: m,
          backgroundColor: T.bg,
          borderTop: `0.5px solid ${T.border}`,
        }}
      >
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.button
              key="submit"
              whileTap={stars > 0 ? { scale: 0.96 } : {}}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              onClick={handleSubmit}
              style={{
                width: "100%", height: 52,
                backgroundColor: stars > 0 ? T.cta : T.surfaceElevated,
                border: stars > 0 ? "none" : `1px solid ${T.border}`,
                borderRadius: R.md,
                cursor: stars > 0 ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background-color 0.2s",
              }}
            >
              <span
                style={{
                  color: stars > 0 ? "#000000" : T.textTertiary,
                  fontSize: TYPE.callout, fontWeight: 600,
                  letterSpacing: "-0.01em", fontFamily: font,
                  transition: "color 0.2s",
                }}
              >
                {stars > 0 ? "Submit your feedback" : "Select a rating first"}
              </span>
              {stars > 0 && <ArrowRight size={16} color="#000000" weight="bold" />}
            </motion.button>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              style={{
                height: 52, borderRadius: R.md,
                backgroundColor: "rgba(48,209,88,0.10)",
                border: "1px solid rgba(48,209,88,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <motion.path
                  d="M4 13 L9 18 L20 7"
                  stroke="#30D158"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
                />
              </svg>
              <span style={{ color: "#30D158", fontSize: TYPE.callout, fontWeight: 600, letterSpacing: "-0.01em", fontFamily: font }}>
                Thank you for your feedback!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}