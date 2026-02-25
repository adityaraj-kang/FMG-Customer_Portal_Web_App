// JobDetailScreen.tsx — Expanded job receipt (/home/activity/:jobId)
// Full breakdown: vendor info, service details, invoice, re-book button.

import { useParams, useNavigate } from "react-router";
import {
  CaretLeft, MapPin, User, Star, Clock, CurrencyDollar,
  CheckCircle, Phone, Receipt, ArrowCounterClockwise,
  Truck, PipeWrench, Snowflake, Lightning, Tree, Hammer, HouseLine, Bug,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";
import { JOBS } from "../data";

const ICON_MAP: Record<string, React.ElementType> = {
  towing: Truck, plumber: PipeWrench, hvac: Snowflake, electrician: Lightning,
  lawn: Tree, handyman: Hammer, roofing: HouseLine, pest: Bug,
};

const SERVICE_COLORS: Record<string, string> = {
  towing: "#FF6A2B", plumber: "#2E93FA", hvac: "#00E096", electrician: "#FFC043",
  lawn: "#34C759", handyman: "#FF8C00", roofing: "#A1A1A1", pest: "#FF2D55",
};

interface InvoiceLine {
  label: string;
  amount: string;
}

const MOCK_INVOICE: Record<string, InvoiceLine[]> = {
  j1: [{ label: "Plumbing Repair", amount: "$95.00" }, { label: "Parts", amount: "$15.00" }, { label: "Service fee", amount: "$0.00" }],
  j2: [{ label: "Towing (10 mi)", amount: "$75.00" }, { label: "After-hours surcharge", amount: "$10.00" }, { label: "Service fee", amount: "$0.00" }],
  j3: [{ label: "AC Tune-up", amount: "$120.00" }, { label: "Filter replacement", amount: "$35.00" }, { label: "Refrigerant top-off", amount: "$20.00" }],
  j4: [{ label: "Outlet repair", amount: "$100.00" }, { label: "Parts (GFCI outlet)", amount: "$25.00" }, { label: "Safety inspection", amount: "$15.00" }],
  j5: [{ label: "Lawn mowing", amount: "$45.00" }, { label: "Edging & cleanup", amount: "$20.00" }, { label: "Service fee", amount: "$0.00" }],
};

export function JobDetailScreen() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const m = HIG.screenMargin;

  const job = JOBS.find((j) => j.id === jobId);

  if (!job) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: T.bg }}>
        <span style={{ color: T.textTertiary, fontFamily: font }}>Job not found.</span>
      </div>
    );
  }

  const Icon = ICON_MAP[job.serviceId] ?? Truck;
  const color = SERVICE_COLORS[job.serviceId] ?? T.cta;
  const invoice = MOCK_INVOICE[job.id] ?? [{ label: "Service", amount: job.price }];
  const total = job.price;

  const statusConfig = {
    active:    { color: T.cta,         bg: "rgba(255,77,0,0.12)",  label: "In Progress" },
    completed: { color: "#34C759",     bg: "rgba(52,199,89,0.12)", label: "Completed" },
    cancelled: { color: T.textTertiary, bg: T.surfaceElevated,     label: "Cancelled" },
  }[job.status];

  return (
    <div style={{ height: "100%", backgroundColor: T.bg, display: "flex", flexDirection: "column", fontFamily: font, overflow: "hidden" }}>
      {/* Nav bar */}
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center",
        paddingTop: 8, paddingRight: m, paddingBottom: 4, paddingLeft: 4,
        minHeight: 56, borderBottom: `0.5px solid ${T.border}`,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ minWidth: HIG.minTapTarget, minHeight: HIG.minTapTarget, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}
        >
          <CaretLeft size={22} color={T.textPrimary} weight="bold" />
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <span style={{ color: T.textPrimary, fontSize: TYPE.headline, fontWeight: 700, letterSpacing: "-0.022em", fontFamily: font }}>
            Job Details
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget }} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", maxWidth: 640, margin: "0 auto", width: "100%" }}>
        {/* Hero */}
        <div style={{ paddingTop: 24, paddingRight: m, paddingBottom: 24, paddingLeft: m, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: R.lg,
            backgroundColor: T.surfaceElevated,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={30} color={color} weight="regular" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: T.textPrimary, fontSize: TYPE.title3, fontWeight: 700, letterSpacing: "-0.022em", marginBottom: 4, fontFamily: font }}>
              {job.serviceLabel}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                height: 22, paddingLeft: 8, paddingRight: 8,
                borderRadius: R.full, backgroundColor: statusConfig.bg,
              }}>
                <CheckCircle size={11} color={statusConfig.color} weight="fill" />
                <span style={{ color: statusConfig.color, fontSize: TYPE.caption2, fontWeight: 600, fontFamily: font }}>{statusConfig.label}</span>
              </div>
              <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>{job.date}</span>
            </div>
          </div>
        </div>

        <div style={{ height: "0.5px", backgroundColor: T.border }} />

        {/* Vendor info */}
        <div style={{ paddingTop: 20, paddingRight: m, paddingBottom: 20, paddingLeft: m }}>
          <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const, fontFamily: font, display: "block", marginBottom: 12 }}>
            Service Provider
          </span>
          <div style={{
            backgroundColor: T.surfaceElevated, borderRadius: R.md,
            border: `1px solid ${T.border}`, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: R.full,
              backgroundColor: T.surfaceElevated,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <User size={22} color={T.textTertiary} weight="regular" />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 600, fontFamily: font, display: "block", marginBottom: 2 }}>
                {job.vendor}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Star size={11} color="#FFC043" weight="fill" />
                <span style={{ color: T.textSecondary, fontSize: TYPE.caption1, fontFamily: font }}>4.8 rating</span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/home/vendor-profile/${job.serviceId}`)}
              style={{
                height: 32, paddingLeft: 12, paddingRight: 12,
                backgroundColor: T.surfaceElevated, border: `1px solid ${T.border}`,
                borderRadius: R.full, cursor: "pointer", fontFamily: font,
              }}
            >
              <span style={{ color: T.textSecondary, fontSize: TYPE.caption1, fontWeight: 500 }}>View</span>
            </button>
          </div>
        </div>

        <div style={{ height: "0.5px", backgroundColor: T.border, marginLeft: m }} />

        {/* Service location */}
        <div style={{ paddingTop: 20, paddingRight: m, paddingBottom: 20, paddingLeft: m }}>
          <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const, fontFamily: font, display: "block", marginBottom: 12 }}>
            Location
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <MapPin size={16} color={T.cta} weight="fill" />
            <span style={{ color: T.textSecondary, fontSize: TYPE.subhead, fontFamily: font }}>
              1842 Peachtree Rd NW, Atlanta, GA
            </span>
          </div>
        </div>

        <div style={{ height: "0.5px", backgroundColor: T.border, marginLeft: m }} />

        {/* Invoice */}
        <div style={{ paddingTop: 20, paddingRight: m, paddingBottom: 20, paddingLeft: m }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Receipt size={16} color={T.textTertiary} weight="regular" />
            <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const, fontFamily: font }}>
              Invoice
            </span>
          </div>
          <div style={{ backgroundColor: T.surfaceElevated, borderRadius: R.md, border: `1px solid ${T.border}`, overflow: "hidden" }}>
            {invoice.map((line, idx) => (
              <div key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                  <span style={{ color: T.textSecondary, fontSize: TYPE.subhead, fontFamily: font }}>{line.label}</span>
                  <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 500, fontFamily: font }}>{line.amount}</span>
                </div>
                {idx < invoice.length - 1 && (
                  <div style={{ height: "0.5px", backgroundColor: T.divider, marginLeft: 16 }} />
                )}
              </div>
            ))}
            <div style={{ height: "0.5px", backgroundColor: T.border }} />
            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", backgroundColor: T.surfaceElevated }}>
              <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 700, fontFamily: font }}>Total</span>
              <span style={{ color: T.cta, fontSize: TYPE.subhead, fontWeight: 700, fontFamily: font }}>{total}</span>
            </div>
          </div>
        </div>

        <div style={{ height: "0.5px", backgroundColor: T.border, marginLeft: m }} />

        {/* Notes */}
        <div style={{ paddingTop: 20, paddingRight: m, paddingBottom: 24, paddingLeft: m }}>
          <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const, fontFamily: font, display: "block", marginBottom: 10 }}>
            Service Notes
          </span>
          <p style={{ margin: 0, color: T.textSecondary, fontSize: TYPE.subhead, lineHeight: 1.55, fontFamily: font }}>
            {job.detail}
          </p>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ paddingTop: 12, paddingRight: m, paddingBottom: 16, paddingLeft: m, backgroundColor: T.bg, borderTop: `0.5px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 600, damping: 35 }}
            onClick={() => navigate(`/home/chat/${job.serviceId}`)}
            style={{
              flex: 1, height: 52,
              backgroundColor: T.cta, border: "none", borderRadius: R.md,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <ArrowCounterClockwise size={16} color="#000000" weight="bold" />
            <span style={{ color: "#000000", fontSize: TYPE.callout, fontWeight: 600, fontFamily: font }}>
              Rebook
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}