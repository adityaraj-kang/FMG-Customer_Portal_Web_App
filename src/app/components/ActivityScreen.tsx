// ActivityScreen.tsx — Job history feed (/home/activity)
// Filterable list of past and active jobs.

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Truck, PipeWrench, Snowflake, Lightning, Tree, Hammer, HouseLine, Bug,
} from "@phosphor-icons/react";
import { T, font, R, HIG, TYPE } from "../tokens";
import { JOBS } from "../data";

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

// ─── Service colour map for tinted icon containers ────────────
const SERVICE_COLORS: Record<string, string> = {
  towing:      "#FF6A2B",
  plumber:     "#2E93FA",
  hvac:        "#00C896",
  electrician: "#FFC043",
  lawn:        "#34C759",
  handyman:    "#FF8C00",
  roofing:     "#A1A1A1",
  pest:        "#FF2D55",
};

function tint(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

type Filter = "all" | "active" | "completed" | "cancelled";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all",       label: "All" },
  { id: "active",    label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

// ─── Status badge — pill, 4px radius, 12% opacity background ──
function StatusBadge({ status }: { status: "active" | "completed" | "cancelled" }) {
  const config = {
    active:    { color: "#FF4D00",  bg: "rgba(255,77,0,0.10)",      label: "In Progress" },
    completed: { color: "#30D158",  bg: "rgba(48,209,88,0.10)",     label: "Completed"   },
    cancelled: { color: "#8E8E8E",  bg: "rgba(142,142,142,0.10)",   label: "Cancelled"   },
  }[status];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        height: 20,
        paddingTop: 0, paddingRight: 7, paddingBottom: 0, paddingLeft: 7,
        borderRadius: 4,                          // 4px per spec
        backgroundColor: config.bg,
      }}
    >
      {/* 6px dot for active — subtle pulse */}
      {status === "active" && (
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: config.color, flexShrink: 0 }}
        />
      )}
      <span style={{ color: config.color, fontSize: TYPE.caption2, fontWeight: 600, fontFamily: font, letterSpacing: "0.01em" }}>
        {config.label}
      </span>
    </div>
  );
}

export function ActivityScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const m = HIG.screenMargin;

  const filtered = JOBS.filter(
    (job) => filter === "all" || job.status === filter
  );

  return (
    <div
      style={{
        height: "100%",
        backgroundColor: T.bg,
        display: "flex",
        flexDirection: "column",
        fontFamily: font,
        overflow: "hidden",
      }}
    >
      {/* ── Fixed header + filter tabs ── */}
      <div style={{ flexShrink: 0 }}>
        {/* Page title */}
        <div style={{ paddingTop: 16, paddingRight: m, paddingBottom: 0, paddingLeft: m }}>
          <h1 style={{ margin: 0, color: T.textPrimary, fontSize: TYPE.title2, fontWeight: 700, letterSpacing: "-0.03em", fontFamily: font }}>
            Activity
          </h1>
        </div>

        {/* Filter chips */}
        <div
          style={{
            display: "flex",
            gap: 7,
            paddingTop: 14,
            paddingRight: 0,
            paddingBottom: 14,
            paddingLeft: m,
            overflowX: "auto",
          }}
        >
          {FILTERS.map((f) => {
            const isActive = filter === f.id;
            return (
              <motion.button
                key={f.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => setFilter(f.id)}
                style={{
                  flexShrink: 0,
                  height: 30,
                  paddingTop: 0, paddingRight: 13, paddingBottom: 0, paddingLeft: 13,
                  borderRadius: R.full,
                  backgroundColor: isActive ? T.cta : T.surfaceElevated,
                  border: `1px solid ${isActive ? T.cta : T.border}`,
                  color: isActive ? "#000000" : T.textSecondary,
                  fontSize: TYPE.caption1,
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: font,
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  transition: "background-color 0.18s, border-color 0.18s, color 0.18s",
                }}
              >
                {f.label}
              </motion.button>
            );
          })}
          <div style={{ width: m, flexShrink: 0 }} />
        </div>

        <div style={{ height: "0.5px", backgroundColor: T.divider }} />
      </div>

      {/* ── Scrollable job list ── */}
      <div style={{ flex: 1, overflowY: "auto", maxWidth: 720, margin: "0 auto", width: "100%" }}>
        {filtered.length === 0 ? (
          /* ── Notion-style empty state ── */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 64,
              gap: 10,
            }}
          >
            <div style={{
              width: 40, height: 40,
              borderRadius: R.md,
              backgroundColor: T.surfaceElevated,
              border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 2,
            }}>
              <Truck size={20} color={T.textTertiary} weight="regular" />
            </div>
            <span style={{ color: T.textTertiary, fontSize: TYPE.subhead, fontFamily: font, letterSpacing: "-0.01em" }}>
              No {filter === "all" ? "" : filter + " "}jobs yet
            </span>
          </div>
        ) : (
          <div style={{ paddingTop: 8, paddingRight: 0, paddingBottom: 24, paddingLeft: 0 }}>
            {filtered.map((job, idx) => {
              const Icon = ICON_MAP[job.serviceId] ?? Truck;
              const svcColor = SERVICE_COLORS[job.serviceId] ?? "#888888";
              const isActive = job.status === "active";

              return (
                <motion.button
                  key={job.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.22 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate(`/home/activity/${job.id}`)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    position: "relative",
                    padding: 0,
                    transition: "background-color 0.15s",
                  }}
                >
                  {/* Blinkit-style 3px status stripe — active jobs only */}
                  {isActive && (
                    <div style={{
                      position: "absolute",
                      left: 0, top: 0, bottom: 0,
                      width: 3,
                      backgroundColor: T.cta,
                    }} />
                  )}

                  {/* Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      paddingTop: 14,
                      paddingRight: m,
                      paddingBottom: 14,
                      paddingLeft: isActive ? m + 3 : m,
                    }}
                  >
                    {/* Icon — tinted container */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: R.md,
                        backgroundColor: tint(svcColor, 0.10),
                        border: `1px solid ${tint(svcColor, 0.18)}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color={svcColor} weight="regular" />
                    </div>

                    {/* Text block */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 500, letterSpacing: "-0.02em", fontFamily: font }}>
                          {job.serviceLabel}
                        </span>
                        {/* Timestamp — right-aligned per spec */}
                        <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font, whiteSpace: "nowrap", marginLeft: 8 }}>
                          {job.date}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <StatusBadge status={job.status} />
                        <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>
                          {job.vendor}
                        </span>
                        <span style={{ color: T.divider, fontSize: TYPE.caption1 }}>·</span>
                        <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font, fontVariantNumeric: "tabular-nums" }}>
                          {job.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Divider — skip on last item */}
                  {idx < filtered.length - 1 && (
                    <div style={{ height: "0.5px", backgroundColor: T.divider, marginLeft: isActive ? m + 3 + 44 + 14 : m + 44 + 14 }} />
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}