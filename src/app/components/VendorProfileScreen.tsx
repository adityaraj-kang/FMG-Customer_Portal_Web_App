// VendorProfileScreen.tsx — Vendor detail with reviews (/home/vendor-profile/:serviceId)

import { useParams, useNavigate } from "react-router";
import {
  CaretLeft, Star, Clock, MapPin, ShieldCheck, Phone,
  ChatCircle, CheckCircle,
  Truck, PipeWrench, Snowflake, Lightning, Tree, Hammer, HouseLine, Bug,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";
import { SERVICES } from "../data";

const VENDOR_DATA: Record<string, {
  name: string; rating: number; jobs: number; since: string;
  specialties: string[]; license: string; response: string;
}> = {
  towing:      { name: "Mike's Towing", rating: 4.8, jobs: 234, since: "2019", specialties: ["Flatbed tow", "Motorcycle tow", "Long-distance"], license: "GA DOT #42781", response: "12 min avg" },
  plumber:     { name: "Atlanta Plumbing Co.", rating: 4.9, jobs: 512, since: "2017", specialties: ["Emergency repair", "Water heater", "Drain cleaning"], license: "GA Master #PLM-8234", response: "25 min avg" },
  hvac:        { name: "CoolAir Pro", rating: 4.8, jobs: 389, since: "2018", specialties: ["AC repair", "Furnace install", "Duct cleaning"], license: "GA HVAC #HC-4512", response: "35 min avg" },
  electrician: { name: "Watts Up Electric", rating: 4.9, jobs: 441, since: "2016", specialties: ["Panel upgrade", "EV charger", "Rewiring"], license: "GA Elec #EL-9921", response: "30 min avg" },
  lawn:        { name: "GreenScape Crew", rating: 4.8, jobs: 670, since: "2020", specialties: ["Weekly mowing", "Landscaping", "Irrigation"], license: "Licensed & Insured", response: "Same day" },
  handyman:    { name: "FixIt Fast", rating: 4.8, jobs: 528, since: "2019", specialties: ["Assembly", "Drywall", "Painting"], license: "Licensed & Insured", response: "2-4 hrs" },
  roofing:     { name: "AtlantaRoof Co.", rating: 4.9, jobs: 381, since: "2015", specialties: ["Leak repair", "Shingle replacement", "Inspections"], license: "GA Roofing #RF-3301", response: "Next day" },
  pest:        { name: "PestAway Atlanta", rating: 4.8, jobs: 492, since: "2018", specialties: ["Termite", "Rodent", "Eco-friendly"], license: "GA Pest #PC-7842", response: "Same day" },
};

const REVIEWS = [
  { id: "r1", name: "Sarah M.", rating: 5, date: "2 weeks ago", text: "Incredibly fast and professional. Genie found them in minutes and the service was flawless." },
  { id: "r2", name: "James T.", rating: 5, date: "1 month ago", text: "Best price in town. The technician was courteous and explained everything before starting." },
  { id: "r3", name: "Priya K.", rating: 4, date: "2 months ago", text: "Great work overall. Arrived on time and cleaned up after. Would use again." },
  { id: "r4", name: "Marcus L.", rating: 5, date: "3 months ago", text: "Top-notch service. Fixed the issue in under 30 minutes. Highly recommend." },
];

export function VendorProfileScreen() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const m = HIG.screenMargin;

  const vendor = VENDOR_DATA[serviceId ?? ""] ?? VENDOR_DATA.plumber;
  const service = SERVICES.find((s) => s.id === serviceId);

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
            Vendor Profile
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget }} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero */}
        <div style={{ paddingTop: 24, paddingRight: m, paddingBottom: 24, paddingLeft: m, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: 72, height: 72, borderRadius: R.full,
            backgroundColor: T.surfaceElevated, border: `1.5px solid ${T.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 14,
          }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: T.cta, fontFamily: font }}>
              {vendor.name.charAt(0)}
            </span>
          </div>
          <span style={{ color: T.textPrimary, fontSize: TYPE.title3, fontWeight: 700, fontFamily: font, marginBottom: 4, letterSpacing: "-0.022em" }}>
            {vendor.name}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Star size={14} color="#FFC043" weight="fill" />
            <span style={{ color: T.textSecondary, fontSize: TYPE.subhead, fontFamily: font }}>
              {vendor.rating} · {vendor.jobs} jobs · Since {vendor.since}
            </span>
          </div>

          {/* Stat pills */}
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{
              height: 32, paddingLeft: 12, paddingRight: 12,
              backgroundColor: T.surfaceElevated, border: `1px solid ${T.border}`,
              borderRadius: R.full, display: "flex", alignItems: "center", gap: 5,
            }}>
              <Clock size={12} color={T.textTertiary} />
              <span style={{ color: T.textSecondary, fontSize: TYPE.caption1, fontFamily: font }}>{vendor.response}</span>
            </div>
            <div style={{
              height: 32, paddingLeft: 12, paddingRight: 12,
              backgroundColor: T.surfaceElevated, border: `1px solid ${T.border}`,
              borderRadius: R.full, display: "flex", alignItems: "center", gap: 5,
            }}>
              <ShieldCheck size={12} color="#34C759" />
              <span style={{ color: T.textSecondary, fontSize: TYPE.caption1, fontFamily: font }}>Verified</span>
            </div>
          </div>
        </div>

        <div style={{ height: "0.5px", backgroundColor: T.border }} />

        {/* License & specialties */}
        <div style={{ paddingTop: 20, paddingRight: m, paddingBottom: 20, paddingLeft: m }}>
          <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const, fontFamily: font, display: "block", marginBottom: 12 }}>
            Credentials
          </span>
          <div style={{
            backgroundColor: T.surfaceElevated, borderRadius: R.md,
            border: `1px solid ${T.border}`, padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
          }}>
            <ShieldCheck size={16} color="#34C759" weight="fill" />
            <span style={{ color: T.textSecondary, fontSize: TYPE.subhead, fontFamily: font }}>
              {vendor.license}
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {vendor.specialties.map((s) => (
              <div key={s} style={{
                height: 28, paddingLeft: 10, paddingRight: 10,
                backgroundColor: T.surfaceElevated, border: `1px solid ${T.border}`,
                borderRadius: R.full, display: "flex", alignItems: "center",
              }}>
                <span style={{ color: T.textSecondary, fontSize: TYPE.caption1, fontFamily: font }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: "0.5px", backgroundColor: T.border }} />

        {/* Reviews */}
        <div style={{ paddingTop: 20, paddingRight: m, paddingBottom: 32, paddingLeft: m }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const, fontFamily: font }}>
              Reviews
            </span>
            <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>
              {REVIEWS.length} reviews
            </span>
          </div>

          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.22 }}
              style={{
                backgroundColor: T.surfaceElevated,
                borderRadius: R.md,
                border: `1px solid ${T.border}`,
                padding: "14px",
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: R.full,
                    backgroundColor: T.surfaceElevated,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontWeight: 600, fontFamily: font }}>
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 500, fontFamily: font }}>
                    {review.name}
                  </span>
                </div>
                <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>
                  {review.date}
                </span>
              </div>
              <div style={{ display: "flex", gap: 2, marginBottom: 8, paddingLeft: 36 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} color={i < review.rating ? "#FFC043" : T.border} weight="fill" />
                ))}
              </div>
              <p style={{ margin: 0, paddingLeft: 36, color: T.textSecondary, fontSize: TYPE.footnote, lineHeight: 1.55, fontFamily: font }}>
                {review.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ paddingTop: 12, paddingRight: m, paddingBottom: 16, paddingLeft: m, backgroundColor: T.bg, borderTop: `0.5px solid ${T.border}`, flexShrink: 0 }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 600, damping: 35 }}
          onClick={() => navigate(`/home/chat/${serviceId}`)}
          style={{
            width: "100%", height: 52,
            backgroundColor: T.cta, border: "none", borderRadius: R.md,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <ChatCircle size={18} color="#000000" weight="fill" />
          <span style={{ color: "#000000", fontSize: TYPE.callout, fontWeight: 600, fontFamily: font }}>
            Book with {vendor.name}
          </span>
        </motion.button>
      </div>
    </div>
  );
}