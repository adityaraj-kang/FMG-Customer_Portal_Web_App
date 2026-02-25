// ServiceDetailScreen.tsx — Individual service detail (/home/services/:id)
// Parallax hero · price/eta stat tiles · How it works · What's included · Why Genie · sticky glass CTA

import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  CaretLeft, CheckCircle, Star, ShieldCheck,
  ChatCircle, Trophy, ArrowCounterClockwise, ArrowRight,
} from "@phosphor-icons/react";
import {
  Truck, PipeWrench, Snowflake, Lightning,
  Tree, Hammer, HouseLine, Bug,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";
import { SERVICES } from "../data";

const IOS = [0.32, 0.72, 0, 1] as const;

// ─── Hex → rgba helper ───────────────────────────────────────────
function tint(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── Service icon map ────────────────────────────────────────────
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

// ─── How it works — 3 steps ──────────────────────────────────────
const HOW_STEPS = [
  { IconEl: ChatCircle, accentColor: "#FF4D00", label: "Describe",   sub: "Tell Genie in plain language" },
  { IconEl: Lightning,  accentColor: "#FFC043", label: "Genie Acts", sub: "AI calls multiple vendors" },
  { IconEl: Trophy,     accentColor: "#34C759", label: "You Pick",   sub: "Best value or fastest ETA" },
] as const;

// ─── Why Genie trust badges — 2×2 grid ───────────────────────────
const TRUST_BADGES = [
  { IconEl: Star,                  accentColor: "#FFC043", label: "4.8 Rating",     sub: "12k+ completed jobs" },
  { IconEl: ShieldCheck,           accentColor: "#34C759", label: "Vetted Pros",     sub: "Background checked" },
  { IconEl: ShieldCheck,           accentColor: "#2E93FA", label: "$5K Guarantee",   sub: "Full service protection" },
  { IconEl: ArrowCounterClockwise, accentColor: "#FF4D00", label: "Free Rebooking",  sub: "No questions asked" },
] as const;

// ─── Main component ───────────────────────────────────────────────
export function ServiceDetailScreen() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const m        = HIG.screenMargin;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const fn = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", fn, { passive: true });
    return () => el.removeEventListener("scroll", fn);
  }, []);

  const service = SERVICES.find((s) => s.id === id);
  if (!service) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: T.bg }}>
        <span style={{ color: T.textTertiary, fontFamily: font }}>Service not found.</span>
      </div>
    );
  }

  const Icon = ICON_MAP[service.id] ?? Truck;

  // Nav bar: transparent → frosted glass as hero scrolls past
  const navProgress = Math.min(1, Math.max(0, (scrollY - 50) / 90));
  const navBgColor  = `rgba(13,13,13,${navProgress * 0.92})`;
  const navBlur     = navProgress > 0.05 ? "blur(16px) saturate(1.4)" : "none";

  // Parallax offsets — counteract scroll to create layered depth
  const pxBg      = Math.min(scrollY * 0.44, 96);   // gradient bg: slowest
  const pxContent = Math.min(scrollY * 0.18, 36);   // icon + title: middle

  return (
    <div style={{ height: "100%", position: "relative", overflow: "hidden", backgroundColor: T.bg, fontFamily: font }}>

      {/* ── Floating nav bar — fades in as hero scrolls away ──── */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 30,
          height: 54, display: "flex", alignItems: "center",
          paddingLeft: 4, paddingRight: m,
          backgroundColor: navBgColor,
          backdropFilter: navBlur,
          WebkitBackdropFilter: navBlur,
          transition: "background-color 0.12s",
          borderBottom: navProgress > 0.92 ? `0.5px solid ${T.border}` : "none",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            minWidth: HIG.minTapTarget, minHeight: HIG.minTapTarget,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer",
          }}
        >
          <CaretLeft size={22} color="#FFFFFF" weight="bold" />
        </button>
        <span
          style={{
            color: T.textPrimary,
            fontSize: TYPE.headline, fontWeight: 700,
            letterSpacing: "-0.022em", fontFamily: font,
            opacity: navProgress,
            transition: "opacity 0.12s",
          }}
        >
          {service.label}
        </span>
      </div>

      {/* ── Scrollable content ────────────────────────────────── */}
      <div
        ref={scrollRef}
        style={{ position: "absolute", inset: 0, overflowY: "auto", paddingBottom: 84 }}
      >
        {/* ── Hero — 266px, tinted gradient, parallax icon ── */}
        <div
          style={{
            position: "relative", height: 266,
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {/* Radial gradient — slowest parallax layer */}
          <div
            style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse at 50% 30%, ${tint(service.color, 0.30)} 0%, transparent 68%)`,
              transform: `translateY(${pxBg}px)`,
            }}
          />
          {/* Bottom bleed into page bg */}
          <div
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 96,
              background: `linear-gradient(to bottom, transparent, ${T.bg})`,
              pointerEvents: "none",
            }}
          />

          {/* Icon + title — middle parallax layer */}
          <div
            style={{
              position: "relative", zIndex: 2,
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 14,
              paddingTop: 54, // nav bar clearance
              transform: `translateY(${pxContent}px)`,
            }}
          >
            {/* Icon ring */}
            <motion.div
              initial={{ scale: 0.82, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              transition={{ duration: 0.44, ease: IOS }}
              style={{
                width: 90, height: 90, borderRadius: R.xl,
                backgroundColor: tint(service.color, 0.15),
                border: `1.5px solid ${tint(service.color, 0.42)}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 10px 40px ${tint(service.color, 0.24)}, 0 0 0 1px ${tint(service.color, 0.10)}`,
              }}
            >
              <Icon size={42} color={service.color} weight="regular" />
            </motion.div>

            {/* Service name + meta */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.36, ease: IOS }}
              style={{ textAlign: "center" }}
            >
              <h1
                style={{
                  margin: "0 0 5px",
                  color: T.textPrimary,
                  fontSize: TYPE.title2, fontWeight: 700,
                  letterSpacing: "-0.026em", fontFamily: font,
                }}
              >
                {service.label}
              </h1>
              <span
                style={{
                  color: T.textTertiary,
                  fontSize: TYPE.footnote,
                  letterSpacing: "-0.01em",
                  fontFamily: font,
                }}
              >
                {service.avgPrice} avg · ETA {service.avgEta}
              </span>
            </motion.div>
          </div>
        </div>

        {/* ── Description ── */}
        <div style={{ paddingTop: 4, paddingRight: m, paddingBottom: 20, paddingLeft: m }}>
          <p
            style={{
              margin: 0,
              color: T.textSecondary,
              fontSize: TYPE.subhead,
              letterSpacing: "-0.01em",
              lineHeight: 1.62,
              fontFamily: font,
            }}
          >
            {service.description}
          </p>
        </div>

        {/* ── Stat tiles — price + ETA ── */}
        <div style={{ display: "flex", gap: 8, paddingLeft: m, paddingRight: m, paddingBottom: 24 }}>
          {[
            { label: "Avg price", value: service.avgPrice, color: T.cta },
            { label: "ETA",       value: service.avgEta,   color: "#34C759" },
          ].map((chip) => (
            <motion.div
              key={chip.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.3, ease: IOS }}
              style={{
                flex: 1, height: 58,
                backgroundColor: T.surfaceElevated,
                border: `1px solid ${T.border}`,
                borderRadius: R.md,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 3,
              }}
            >
              <span
                style={{
                  color: T.textTertiary,
                  fontSize: TYPE.caption2, fontWeight: 500,
                  fontFamily: font, letterSpacing: "0.04em",
                  textTransform: "uppercase" as const,
                }}
              >
                {chip.label}
              </span>
              <span
                style={{
                  color: chip.color,
                  fontSize: TYPE.callout, fontWeight: 700,
                  fontFamily: font, letterSpacing: "-0.02em",
                }}
              >
                {chip.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div style={{ height: "0.5px", backgroundColor: T.border, marginBottom: 26 }} />

        {/* ── How it works ── */}
        <div style={{ paddingLeft: m, paddingRight: m, paddingBottom: 28 }}>
          <h2
            style={{
              margin: "0 0 16px",
              color: T.textPrimary,
              fontSize: TYPE.title3, fontWeight: 700,
              letterSpacing: "-0.022em", fontFamily: font,
            }}
          >
            How it works
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            {HOW_STEPS.map((step, idx) => {
              const StepIcon = step.IconEl;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + idx * 0.09, duration: 0.32, ease: IOS }}
                  style={{
                    flex: 1,
                    backgroundColor: T.surfaceElevated,
                    border: `1px solid ${T.border}`,
                    borderRadius: R.md,
                    padding: "14px 10px 12px",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 8,
                    textAlign: "center" as const,
                    position: "relative",
                  }}
                >
                  {/* Step number badge */}
                  <div
                    style={{
                      position: "absolute", top: 7, right: 7,
                      width: 17, height: 17, borderRadius: R.full,
                      backgroundColor: tint(step.accentColor, 0.14),
                      border: `1px solid ${tint(step.accentColor, 0.32)}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <span style={{ color: step.accentColor, fontSize: 9, fontWeight: 800, fontFamily: font }}>
                      {idx + 1}
                    </span>
                  </div>

                  {/* Icon tile */}
                  <div
                    style={{
                      width: 42, height: 42, borderRadius: R.md,
                      backgroundColor: tint(step.accentColor, 0.13),
                      border: `1px solid ${tint(step.accentColor, 0.28)}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <StepIcon size={20} color={step.accentColor} weight="duotone" />
                  </div>

                  {/* Label + sub */}
                  <div>
                    <span
                      style={{
                        display: "block",
                        color: T.textPrimary,
                        fontSize: TYPE.caption1, fontWeight: 700,
                        fontFamily: font, letterSpacing: "-0.01em",
                        marginBottom: 3,
                      }}
                    >
                      {step.label}
                    </span>
                    <span style={{ color: T.textTertiary, fontSize: 10, fontFamily: font, lineHeight: 1.35 }}>
                      {step.sub}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: "0.5px", backgroundColor: T.border, marginBottom: 26 }} />

        {/* ── What's included ── */}
        <div style={{ paddingLeft: m, paddingRight: m, paddingBottom: 28 }}>
          <h2
            style={{
              margin: "0 0 14px",
              color: T.textPrimary,
              fontSize: TYPE.title3, fontWeight: 700,
              letterSpacing: "-0.022em", fontFamily: font,
            }}
          >
            What's included
          </h2>

          {/* List card */}
          <div
            style={{
              backgroundColor: T.surfaceElevated,
              border: `1px solid ${T.border}`,
              borderRadius: R.lg, overflow: "hidden",
            }}
          >
            {service.includes.map((item, i) => (
              <div key={i}>
                {i > 0 && (
                  <div style={{ height: "0.5px", backgroundColor: T.divider, marginLeft: 52 }} />
                )}
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.10 + i * 0.07, duration: 0.28, ease: IOS }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px" }}
                >
                  {/* Colored check circle */}
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: R.full, flexShrink: 0,
                      backgroundColor: tint(service.color, 0.13),
                      border: `1px solid ${tint(service.color, 0.30)}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <CheckCircle size={14} color={service.color} weight="fill" />
                  </div>
                  <span
                    style={{
                      color: T.textSecondary,
                      fontSize: TYPE.subhead,
                      letterSpacing: "-0.01em",
                      fontFamily: font,
                    }}
                  >
                    {item}
                  </span>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: "0.5px", backgroundColor: T.border, marginBottom: 26 }} />

        {/* ── Why Genie — 2×2 trust badge grid ── */}
        <div style={{ paddingLeft: m, paddingRight: m, paddingBottom: 32 }}>
          <h2
            style={{
              margin: "0 0 14px",
              color: T.textPrimary,
              fontSize: TYPE.title3, fontWeight: 700,
              letterSpacing: "-0.022em", fontFamily: font,
            }}
          >
            Why Genie
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {TRUST_BADGES.map((badge, idx) => {
              const BadgeIcon = badge.IconEl;
              return (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.07 + idx * 0.07, duration: 0.28, ease: IOS }}
                  style={{
                    backgroundColor: T.surfaceElevated,
                    border: `1px solid ${T.border}`,
                    borderRadius: R.md,
                    padding: "12px",
                    display: "flex", alignItems: "center", gap: 10,
                  }}
                >
                  {/* Icon tile */}
                  <div
                    style={{
                      width: 34, height: 34, borderRadius: R.sm, flexShrink: 0,
                      backgroundColor: tint(badge.accentColor, 0.13),
                      border: `1px solid ${tint(badge.accentColor, 0.28)}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <BadgeIcon size={16} color={badge.accentColor} weight="fill" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        color: T.textPrimary,
                        fontSize: TYPE.caption1, fontWeight: 700,
                        fontFamily: font, letterSpacing: "-0.01em",
                        marginBottom: 1,
                      }}
                    >
                      {badge.label}
                    </span>
                    <span style={{ color: T.textTertiary, fontSize: 10, fontFamily: font, lineHeight: 1.3 }}>
                      {badge.sub}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Sticky frosted-glass CTA ─────────────────────────── */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 30,
          paddingTop: 12, paddingRight: m, paddingBottom: 16, paddingLeft: m,
          backgroundColor: "rgba(13,13,13,0.90)",
          backdropFilter: "blur(16px) saturate(1.4)",
          WebkitBackdropFilter: "blur(16px) saturate(1.4)",
          borderTop: `0.5px solid ${T.border}`,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 600, damping: 35 }}
          onClick={() => navigate(`/home/chat/${id}`)}
          style={{
            width: "100%", height: 52,
            backgroundColor: T.cta,
            border: "none", borderRadius: R.md,
            cursor: "pointer",
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8,
            boxShadow: "0 4px 22px rgba(255,77,0,0.40)",
          }}
        >
          <span
            style={{
              color: "#000000",
              fontSize: TYPE.callout, fontWeight: 700,
              letterSpacing: "-0.01em", fontFamily: font,
            }}
          >
            Request {service.label}
          </span>
          <ArrowRight size={16} color="#000000" weight="bold" />
        </motion.button>
      </div>
    </div>
  );
}
