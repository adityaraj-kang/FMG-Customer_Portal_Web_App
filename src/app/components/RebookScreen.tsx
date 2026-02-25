// RebookScreen.tsx — Schedule a future or recurring service (/home/rebook/:serviceId)
// Simple date/time picker with service context.

import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  CaretLeft, Calendar, Clock, CaretRight, Check,
  Truck, PipeWrench, Snowflake, Lightning, Tree, Hammer, HouseLine, Bug,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";
import { SERVICES } from "../data";

const ICON_MAP: Record<string, React.ElementType> = {
  towing: Truck, plumber: PipeWrench, hvac: Snowflake, electrician: Lightning,
  lawn: Tree, handyman: Hammer, roofing: HouseLine, pest: Bug,
};

const DATES = [
  { label: "Today", sub: "Feb 25" },
  { label: "Tomorrow", sub: "Feb 26" },
  { label: "Thu", sub: "Feb 27" },
  { label: "Fri", sub: "Feb 28" },
  { label: "Sat", sub: "Mar 1" },
  { label: "Sun", sub: "Mar 2" },
  { label: "Mon", sub: "Mar 3" },
];

const TIMES = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM",
];

export function RebookScreen() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const m = HIG.screenMargin;

  const service = SERVICES.find((s) => s.id === serviceId);
  const Icon = ICON_MAP[serviceId ?? ""] ?? Truck;

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [booked, setBooked] = useState(false);

  function handleBook() {
    setBooked(true);
    setTimeout(() => navigate("/home/activity"), 1500);
  }

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
            Schedule Service
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget }} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Service card */}
        {service && (
          <div style={{ paddingTop: 20, paddingRight: m, paddingBottom: 20, paddingLeft: m }}>
            <div style={{
              backgroundColor: T.surfaceElevated, borderRadius: R.md,
              border: `1px solid ${T.border}`, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: R.md,
                backgroundColor: T.surfaceElevated,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={22} color={service.color} weight="regular" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 600, fontFamily: font, display: "block", marginBottom: 2 }}>
                  {service.label}
                </span>
                <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>
                  {service.avgPrice} · ETA {service.avgEta}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Date selection */}
        <div style={{ paddingRight: m, paddingBottom: 20, paddingLeft: m }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Calendar size={16} color={T.textTertiary} weight="regular" />
            <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const, fontFamily: font }}>
              Select Date
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {DATES.map((d, idx) => {
              const isActive = selectedDate === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(idx)}
                  style={{
                    flexShrink: 0, width: 64, height: 72,
                    borderRadius: R.md,
                    backgroundColor: isActive ? T.cta : T.surfaceElevated,
                    border: `1px solid ${isActive ? T.cta : T.border}`,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 4,
                    cursor: "pointer", fontFamily: font,
                    transition: "background-color 0.18s, border-color 0.18s",
                  }}
                >
                  <span style={{ color: isActive ? "#000000" : T.textSecondary, fontSize: TYPE.caption2, fontWeight: 600 }}>
                    {d.label}
                  </span>
                  <span style={{ color: isActive ? "rgba(0,0,0,0.5)" : T.textTertiary, fontSize: TYPE.caption2 }}>
                    {d.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time selection */}
        <div style={{ paddingRight: m, paddingBottom: 24, paddingLeft: m }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Clock size={16} color={T.textTertiary} weight="regular" />
            <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const, fontFamily: font }}>
              Select Time
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {TIMES.map((time, idx) => {
              const isActive = selectedTime === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedTime(idx)}
                  style={{
                    height: 44, borderRadius: R.sm,
                    backgroundColor: isActive ? T.cta : T.surfaceElevated,
                    border: `1px solid ${isActive ? T.cta : T.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontFamily: font,
                    transition: "background-color 0.18s, border-color 0.18s",
                  }}
                >
                  <span style={{ color: isActive ? "#000000" : T.textSecondary, fontSize: TYPE.subhead, fontWeight: isActive ? 600 : 400 }}>
                    {time}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ paddingTop: 12, paddingRight: m, paddingBottom: 16, paddingLeft: m, backgroundColor: T.bg, borderTop: `0.5px solid ${T.border}`, flexShrink: 0 }}>
        <AnimatePresence mode="wait">
          {!booked ? (
            <motion.button
              key="book"
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 600, damping: 35 }}
              onClick={handleBook}
              disabled={selectedTime === null}
              style={{
                width: "100%", height: 52,
                backgroundColor: selectedTime !== null ? T.cta : T.surfaceElevated,
                border: selectedTime !== null ? "none" : `1px solid ${T.border}`,
                borderRadius: R.md, cursor: selectedTime !== null ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background-color 0.18s",
              }}
            >
              <span style={{ color: selectedTime !== null ? "#000000" : T.textTertiary, fontSize: TYPE.callout, fontWeight: 600, fontFamily: font }}>
                {selectedTime !== null
                  ? `Schedule for ${DATES[selectedDate].sub}, ${TIMES[selectedTime]}`
                  : "Select a time slot"}
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="done"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{
                width: "100%", height: 52,
                backgroundColor: "#34C759", borderRadius: R.md,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <Check size={20} color="#FFFFFF" weight="bold" />
              <span style={{ color: "#FFFFFF", fontSize: TYPE.callout, fontWeight: 600, fontFamily: font }}>Scheduled!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}