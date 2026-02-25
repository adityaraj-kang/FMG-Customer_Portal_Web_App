// BookingVerificationScreen.tsx — Service details & confirm (/home/verification)
// Shows full service breakdown before final booking confirmation.

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  CaretLeft, User, Star, Clock, CurrencyDollar,
  CheckCircle, CaretDown, CaretUp, ArrowRight, ShieldCheck,
  Truck, PipeWrench, Snowflake, Lightning, Tree, Hammer, HouseLine, Bug,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";

const IOS = [0.32, 0.72, 0, 1] as const;

const GUIDELINES: Record<string, string[]> = {
  towing:      ["Have your vehicle registration ready", "Stay clear of traffic while waiting", "Confirm tow destination before departure", "Payment processed automatically after service"],
  plumber:     ["Clear access to the affected area", "Know the location of your water shut-off valve", "Service tech will photograph all work completed", "30-day service warranty included"],
  hvac:        ["Ensure clear access to your HVAC unit", "Have model number ready if possible", "Technician will perform full diagnostic first", "All parts sourced same-day when available"],
  electrician: ["Keep the affected circuit off until tech arrives", "Pets should be secured during work", "All work meets local code requirements", "Certificate of compliance provided after work"],
  lawn:        ["Gate or yard access required", "Remove toys or obstacles from lawn before arrival", "Crew will clean up all clippings", "Satisfaction guaranteed or we'll return"],
  handyman:    ["Clear workspace around repair area", "Have a list of tasks ready", "Hourly rate starts on arrival", "No hidden fees — estimate approved before work begins"],
  roofing:     ["Have a clear path to roof access", "Tech will photograph damage before and after", "Emergency repairs waterproofed same day", "Insurance claim documentation provided on request"],
  pest:        ["Keep pets and children away during treatment", "Open windows for ventilation after interior spray", "Follow-up visit scheduled automatically", "90-day re-treatment guarantee"],
};

const DEFAULT_GUIDELINES = [
  "Service provider will call 10 min before arrival",
  "All providers are background-checked and insured",
  "Payment processed automatically after completion",
  "Rate us after your service to improve quality",
];

const SERVICE_ICON_MAP: Record<string, React.ElementType> = {
  towing: Truck, plumber: PipeWrench, hvac: Snowflake, electrician: Lightning,
  lawn: Tree, handyman: Hammer, roofing: HouseLine, pest: Bug,
};

const SERVICE_COLORS: Record<string, string> = {
  towing: "#FF6A2B", plumber: "#2E93FA", hvac: "#00E096", electrician: "#FFC043",
  lawn: "#34C759", handyman: "#FF8C00", roofing: "#A1A1A1", pest: "#FF2D55",
};

const SERVICE_CATEGORY_LABELS: Record<string, string> = {
  towing: "Towing & Roadside", plumber: "Plumbing", hvac: "HVAC & Cooling",
  electrician: "Electrical", lawn: "Lawn & Garden", handyman: "Handyman",
  roofing: "Roofing", pest: "Pest Control",
};

export function BookingVerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state    = location.state as Record<string, unknown> | null;
  const m        = HIG.screenMargin;

  const serviceId      = (state?.serviceId  as string | undefined) ?? "";
  const serviceName    = (state?.serviceName as string | undefined) ?? "Service";
  const address        = (state?.address    as string | undefined) ?? "3285 Peachtree Rd NE, Atlanta, GA 30305";
  const answers        = (state?.answers    as string[]| undefined) ?? [];
  const questionLabels = (state?.questionLabels as string[] | undefined) ?? [];

  const vendor = state?.vendor as {
    name: string; price: number; eta: string; rating: number; type: string; address: string;
  } | undefined;

  const ServiceIcon   = SERVICE_ICON_MAP[serviceId]        ?? Truck;
  const serviceColor  = SERVICE_COLORS[serviceId]          ?? T.cta;
  const categoryLabel = SERVICE_CATEGORY_LABELS[serviceId] ?? serviceName;

  const guidelines = GUIDELINES[serviceId] ?? DEFAULT_GUIDELINES;

  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [confirmed,      setConfirmed]      = useState(false);

  function handleConfirm() {
    setConfirmed(true);
    setTimeout(() => navigate("/home/payment", { state }), 1600);
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
          onClick={() => navigate(-1)}
          style={{
            minWidth: HIG.minTapTarget, minHeight: HIG.minTapTarget,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", flexShrink: 0,
          }}
        >
          <CaretLeft size={22} color={T.textPrimary} weight="bold" />
        </button>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ color: T.textPrimary, fontSize: TYPE.headline, fontWeight: 700, letterSpacing: "-0.022em", fontFamily: font }}>
            Service Details
          </span>
          <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>
            Review before confirming
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget, flexShrink: 0 }} />
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: 16, paddingBottom: 8, maxWidth: 560, margin: "0 auto", width: "100%" }}>

        {/* ── Vendor card ── */}
        <div style={{ paddingLeft: m, paddingRight: m, marginBottom: 12 }}>
          <motion.div
            layoutId={`dc-vendor-${vendor?.type ?? "best"}`}
            style={{
              backgroundColor: T.surfaceElevated,
              border: `1px solid ${T.border}`,
              borderRadius: R.lg,
              paddingTop: 14, paddingRight: 16, paddingBottom: 14, paddingLeft: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 700, letterSpacing: "-0.02em", fontFamily: font, marginBottom: 2 }}>
                  {vendor?.name ?? "—"}
                </span>
                <span style={{ color: T.textTertiary, fontSize: TYPE.footnote, fontFamily: font }}>
                  {serviceName} · {vendor?.type === "best" ? "Best Value" : "Fastest ETA"}
                </span>
              </div>
              {vendor?.rating && (
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    backgroundColor: T.bg,
                    border: `1px solid ${T.border}`,
                    borderRadius: R.full,
                    paddingTop: 4, paddingRight: 10, paddingBottom: 4, paddingLeft: 8,
                  }}
                >
                  <Star size={12} color="#FFC043" weight="fill" />
                  <span style={{ color: T.textPrimary, fontSize: TYPE.caption1, fontWeight: 600, fontFamily: font }}>
                    {vendor.rating}
                  </span>
                </div>
              )}
            </div>

            {/* Price + ETA */}
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  backgroundColor: T.bg,
                  border: `1px solid ${T.border}`,
                  borderRadius: R.md,
                  paddingTop: 10, paddingRight: 12, paddingBottom: 10, paddingLeft: 12,
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <CurrencyDollar size={16} color={T.cta} weight="bold" />
                <div>
                  <span style={{ display: "block", color: T.cta, fontSize: TYPE.headline, fontWeight: 700, fontFamily: font, letterSpacing: "-0.02em" }}>
                    ${vendor?.price ?? "—"}
                  </span>
                  <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>
                    Total cost
                  </span>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: T.bg,
                  border: `1px solid ${T.border}`,
                  borderRadius: R.md,
                  paddingTop: 10, paddingRight: 12, paddingBottom: 10, paddingLeft: 12,
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <Clock size={16} color={T.textSecondary} weight="regular" />
                <div>
                  <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.headline, fontWeight: 700, fontFamily: font, letterSpacing: "-0.02em" }}>
                    {vendor?.eta ?? "—"}
                  </span>
                  <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>
                    Arrival ETA
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Addresses: user → vendor ── */}
        <div style={{ paddingLeft: m, paddingRight: m, marginBottom: 12 }}>
          <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.footnote, fontWeight: 700, letterSpacing: "-0.01em", fontFamily: font, marginBottom: 10 }}>
            Service route
          </span>
          <div
            style={{
              backgroundColor: T.surfaceElevated,
              border: `1px solid ${T.border}`,
              borderRadius: R.lg,
              overflow: "hidden",
            }}
          >
            {/* User location */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px" }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  backgroundColor: "rgba(255,77,0,0.12)",
                  border: `1px solid rgba(255,77,0,0.3)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 2,
                }}
              >
                <User size={14} color={T.cta} weight="fill" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ display: "block", color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font, marginBottom: 2 }}>
                  Your location
                </span>
                <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 500, fontFamily: font, letterSpacing: "-0.01em", lineHeight: 1.4 }}>
                  {address}
                </span>
              </div>
            </div>

            {/* Dashed connector */}
            <div style={{ paddingLeft: 44, paddingRight: 16 }}>
              <div
                style={{
                  borderLeft: `2px dashed ${T.border}`,
                  height: 16, marginLeft: 2,
                }}
              />
            </div>

            {/* Service category */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px" }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  backgroundColor: `${serviceColor}1A`,
                  border: `1px solid ${serviceColor}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ServiceIcon size={14} color={serviceColor} weight="fill" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ display: "block", color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font, marginBottom: 2 }}>
                  Service category
                </span>
                <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 500, fontFamily: font, letterSpacing: "-0.01em" }}>
                  {categoryLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Request summary ── */}
        {answers.length > 0 && (
          <div style={{ paddingLeft: m, paddingRight: m, marginBottom: 12 }}>
            <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.footnote, fontWeight: 700, letterSpacing: "-0.01em", fontFamily: font, marginBottom: 10 }}>
              Your request
            </span>
            <div
              style={{
                backgroundColor: T.surfaceElevated,
                border: `1px solid ${T.border}`,
                borderRadius: R.lg,
                overflow: "hidden",
              }}
            >
              {answers.map((ans, i) => (
                <div key={i}>
                  {i > 0 && <div style={{ height: "0.5px", backgroundColor: T.divider, marginLeft: 16 }} />}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
                    <span style={{ color: T.textTertiary, fontSize: TYPE.footnote, fontFamily: font }}>
                      {questionLabels[i] ?? `Detail ${i + 1}`}
                    </span>
                    <span style={{ color: T.textPrimary, fontSize: TYPE.footnote, fontWeight: 600, fontFamily: font }}>
                      {ans}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Service guidelines (expandable) ── */}
        <div style={{ paddingLeft: m, paddingRight: m, marginBottom: 20 }}>
          <button
            onClick={() => setGuidelinesOpen((o) => !o)}
            style={{
              width: "100%",
              background: "none",
              border: `1px solid ${T.border}`,
              borderRadius: R.lg,
              backgroundColor: T.surfaceElevated,
              paddingTop: 14, paddingRight: 16, paddingBottom: 14, paddingLeft: 16,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ShieldCheck size={18} color={T.textSecondary} weight="regular" />
              <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 600, letterSpacing: "-0.01em", fontFamily: font }}>
                Review service guidelines
              </span>
            </div>
            {guidelinesOpen
              ? <CaretUp  size={16} color={T.textTertiary} weight="regular" />
              : <CaretDown size={16} color={T.textTertiary} weight="regular" />
            }
          </button>

          <AnimatePresence>
            {guidelinesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: IOS }}
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    backgroundColor: T.surfaceElevated,
                    border: `1px solid ${T.border}`,
                    borderTop: "none",
                    borderRadius: "0 0 16px 16px",
                    paddingTop: 12, paddingRight: 16, paddingBottom: 16, paddingLeft: 16,
                  }}
                >
                  {guidelines.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: i > 0 ? 10 : 0 }}>
                      <CheckCircle size={14} color={T.cta} weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ color: T.textSecondary, fontSize: TYPE.footnote, fontFamily: font, lineHeight: 1.55 }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Sticky CTA ── */}
      <div
        style={{
          flexShrink: 0,
          paddingTop: 10, paddingRight: m, paddingBottom: 16, paddingLeft: m,
          backgroundColor: T.bg,
          borderTop: `0.5px solid ${T.border}`,
        }}
      >
        {/* Price summary row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <span style={{ display: "block", color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>
              Total to pay
            </span>
            <span style={{ color: T.cta, fontSize: TYPE.title3, fontWeight: 700, fontFamily: font, letterSpacing: "-0.02em" }}>
              ${vendor?.price ?? "—"}
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ display: "block", color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>
              Estimated arrival
            </span>
            <span style={{ color: T.textPrimary, fontSize: TYPE.title3, fontWeight: 700, fontFamily: font, letterSpacing: "-0.02em" }}>
              {vendor?.eta ?? "—"}
            </span>
          </div>
        </div>

        {/* CTA button */}
        <AnimatePresence mode="wait">
          {!confirmed ? (
            <motion.button
              key="cta"
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
              <span style={{ color: "#000000", fontSize: TYPE.callout, fontWeight: 600, letterSpacing: "-0.01em", fontFamily: font }}>
                Confirm Booking
              </span>
              <ArrowRight size={16} color="#000000" weight="bold" />
            </motion.button>
          ) : (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              style={{
                height: 52,
                backgroundColor: "rgba(48,209,88,0.10)",
                border: "1px solid rgba(48,209,88,0.25)",
                borderRadius: R.md,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                overflow: "hidden",
              }}
            >
              {/* Stroke-draw SVG checkmark */}
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
                Booking Confirmed!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}