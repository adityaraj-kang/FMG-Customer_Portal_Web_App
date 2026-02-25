// VendorCardOptions.tsx — Design preview for vendor option cards
// Shows 3 distinct redesign directions. Navigate to /card-options to view.

import { useState } from "react";
import { useNavigate } from "react-router";
import { Star, Clock, CurrencyDollar, ArrowRight, Trophy, Lightning, CaretLeft } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";

const VENDORS = [
  {
    type: "best" as const,
    badge: "Best Value",
    price: 95,
    eta: "30 min",
    rating: 4.8,
    jobs: 310,
    tag: "Top rated in your area",
  },
  {
    type: "fastest" as const,
    badge: "Fastest ETA",
    price: 120,
    eta: "18 min",
    rating: 4.6,
    jobs: 198,
    tag: "Available immediately",
  },
];

// ─────────────────────────────────────────────────────────────────
// OPTION A — "Bento Stack"
// Full-width stacked cards, price as the hero number, bold + airy
// ─────────────────────────────────────────────────────────────────
function OptionA({ selected, onSelect }: { selected: string | null; onSelect: (t: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {VENDORS.map((v) => {
        const isSel = selected === v.type;
        const isBest = v.type === "best";
        return (
          <motion.button
            key={v.type}
            whileTap={{ scale: 0.985 }}
            onClick={() => onSelect(v.type)}
            style={{
              background: "none",
              border: `1.5px solid ${isSel ? T.cta : T.border}`,
              borderRadius: R.xl,
              backgroundColor: isSel ? "rgba(255,77,0,0.06)" : T.surfaceElevated,
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
              overflow: "hidden",
              transition: "border-color 0.15s, background-color 0.15s",
            }}
          >
            {/* Top row: badge + rating */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 12px" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                backgroundColor: isSel ? T.cta : T.surfaceElevated,
                border: `1px solid ${isSel ? T.cta : T.border}`,
                borderRadius: R.full,
                paddingTop: 4, paddingBottom: 4, paddingLeft: 10, paddingRight: 12,
                transition: "background-color 0.15s, border-color 0.15s",
              }}>
                {isBest
                  ? <Trophy size={12} color={isSel ? "#000000" : "#FFC043"} weight="fill" />
                  : <Lightning size={12} color={isSel ? "#000000" : T.cta} weight="fill" />
                }
                <span style={{ color: isSel ? "#000000" : T.textSecondary, fontSize: TYPE.caption1, fontWeight: 600, fontFamily: font, letterSpacing: "-0.01em" }}>
                  {v.badge}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Star size={13} color="#FFC043" weight="fill" />
                <span style={{ color: T.textSecondary, fontSize: TYPE.footnote, fontFamily: font, fontWeight: 500 }}>
                  {v.rating} · {v.jobs} jobs
                </span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "0.5px", backgroundColor: T.border, margin: "0 16px" }} />

            {/* Price + ETA row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 14px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <span style={{ color: T.cta, fontSize: TYPE.caption1, fontWeight: 700, fontFamily: font, marginRight: 2 }}>$</span>
                <span style={{ color: T.cta, fontSize: 36, fontWeight: 800, fontFamily: font, letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {v.price}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock size={13} color={T.textTertiary} />
                  <span style={{ color: T.textSecondary, fontSize: TYPE.subhead, fontWeight: 500, fontFamily: font }}>{v.eta}</span>
                </div>
                <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>{v.tag}</span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// OPTION B — "Split Header"
// Side-by-side cards, coloured top band with badge + price
// ─────────────────────────────────────────────────────────────────
function OptionB({ selected, onSelect }: { selected: string | null; onSelect: (t: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {VENDORS.map((v) => {
        const isSel = selected === v.type;
        const isBest = v.type === "best";
        const accentColor = isBest ? "#FFC043" : T.cta;
        return (
          <motion.button
            key={v.type}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(v.type)}
            style={{
              flex: 1,
              background: "none",
              border: `1.5px solid ${isSel ? T.cta : T.border}`,
              borderRadius: R.lg,
              backgroundColor: T.surfaceElevated,
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
              overflow: "hidden",
              transition: "border-color 0.15s",
            }}
          >
            {/* Coloured top band */}
            <div style={{
              backgroundColor: isSel ? "rgba(255,77,0,0.12)" : "rgba(255,255,255,0.03)",
              borderBottom: `0.5px solid ${isSel ? "rgba(255,77,0,0.25)" : T.border}`,
              padding: "12px 12px 10px",
              transition: "background-color 0.15s",
            }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                {isBest
                  ? <Trophy size={11} color={accentColor} weight="fill" />
                  : <Lightning size={11} color={accentColor} weight="fill" />
                }
                <span style={{ color: accentColor, fontSize: TYPE.caption2, fontWeight: 700, fontFamily: font, letterSpacing: "0.02em", textTransform: "uppercase" as const }}>
                  {v.badge}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <span style={{ color: T.textTertiary, fontSize: TYPE.footnote, fontWeight: 600, fontFamily: font, marginRight: 1 }}>$</span>
                <span style={{ color: T.textPrimary, fontSize: 34, fontWeight: 800, fontFamily: font, letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {v.price}
                </span>
              </div>
            </div>

            {/* Lower detail block */}
            <div style={{ padding: "10px 12px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                <Clock size={11} color={T.textTertiary} />
                <span style={{ color: T.textSecondary, fontSize: TYPE.caption1, fontFamily: font }}>{v.eta}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                <Star size={11} color="#FFC043" weight="fill" />
                <span style={{ color: T.textSecondary, fontSize: TYPE.caption1, fontFamily: font }}>
                  {v.rating} · {v.jobs} jobs
                </span>
              </div>
              <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font, lineHeight: 1.4 }}>
                {v.tag}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// OPTION C — "Neon Minimal"
// Side-by-side, ultra-clean. Price dominates, accent top bar on select
// ─────────────────────────────────────────────────────────────────
function OptionC({ selected, onSelect }: { selected: string | null; onSelect: (t: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {VENDORS.map((v) => {
        const isSel = selected === v.type;
        const isBest = v.type === "best";
        return (
          <motion.button
            key={v.type}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(v.type)}
            style={{
              flex: 1,
              background: "none",
              border: `1.5px solid ${isSel ? T.cta : "rgba(255,255,255,0.08)"}`,
              borderRadius: R.lg,
              backgroundColor: isSel ? "rgba(255,77,0,0.05)" : "rgba(255,255,255,0.03)",
              padding: "14px 12px 14px",
              cursor: "pointer",
              textAlign: "left",
              position: "relative",
              overflow: "hidden",
              transition: "border-color 0.15s, background-color 0.15s",
            }}
          >
            {/* Selected accent bar at top */}
            {isSel && (
              <motion.div
                layoutId="option-c-bar"
                style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: T.cta }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}

            {/* Badge row */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4,
                backgroundColor: isBest ? "rgba(255,192,67,0.15)" : "rgba(255,77,0,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {isBest
                  ? <Trophy size={10} color="#FFC043" weight="fill" />
                  : <Lightning size={10} color={T.cta} weight="fill" />
                }
              </div>
              <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontWeight: 600, fontFamily: font, letterSpacing: "0.03em", textTransform: "uppercase" as const }}>
                {v.badge}
              </span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 1, marginBottom: 10 }}>
              <CurrencyDollar size={15} color={T.cta} weight="bold" />
              <span style={{ color: T.cta, fontSize: 30, fontWeight: 800, fontFamily: font, letterSpacing: "-0.04em", lineHeight: 1 }}>
                {v.price}
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: "0.5px", backgroundColor: "rgba(255,255,255,0.07)", marginBottom: 10 }} />

            {/* Stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Clock size={11} color={T.textTertiary} />
                <span style={{ color: T.textSecondary, fontSize: TYPE.caption1, fontFamily: font }}>{v.eta}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Star size={11} color="#FFC043" weight="fill" />
                <span style={{ color: T.textSecondary, fontSize: TYPE.caption1, fontFamily: font }}>
                  {v.rating} · {v.jobs} jobs
                </span>
              </div>
            </div>

            {/* Tag */}
            <div style={{ marginTop: 8 }}>
              <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>{v.tag}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Preview screen
// ─────────────────────────────────────────────────────────────────
const OPTIONS = [
  { id: "A", label: "Bento Stack",   sub: "Full-width stacked cards, large price hero" },
  { id: "B", label: "Split Header",  sub: "Coloured top band with price + badge" },
  { id: "C", label: "Neon Minimal",  sub: "Glass surface, accent top bar, ultra-clean" },
] as const;

export function VendorCardOptions() {
  const navigate = useNavigate();
  const [selA, setSelA] = useState<string | null>("best");
  const [selB, setSelB] = useState<string | null>("best");
  const [selC, setSelC] = useState<string | null>("best");

  return (
    <div style={{ height: "100%", backgroundColor: T.bg, display: "flex", flexDirection: "column", fontFamily: font }}>

      {/* Header */}
      <div style={{
        flexShrink: 0,
        display: "flex", alignItems: "center",
        paddingLeft: 4, paddingRight: HIG.screenMargin,
        paddingTop: 8, paddingBottom: 8,
        minHeight: 56,
        borderBottom: `0.5px solid ${T.border}`,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ minWidth: HIG.minTapTarget, minHeight: HIG.minTapTarget, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}
        >
          <CaretLeft size={22} color={T.textPrimary} weight="bold" />
        </button>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ color: T.textPrimary, fontSize: TYPE.headline, fontWeight: 700, letterSpacing: "-0.022em", fontFamily: font }}>
            Card Redesigns
          </span>
          <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>
            3 options — tap cards to test selection
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget }} />
      </div>

      {/* Scrollable previews */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 32 }}>
        {[
          { opt: OPTIONS[0], node: <OptionA selected={selA} onSelect={setSelA} /> },
          { opt: OPTIONS[1], node: <OptionB selected={selB} onSelect={setSelB} /> },
          { opt: OPTIONS[2], node: <OptionC selected={selC} onSelect={setSelC} /> },
        ].map(({ opt, node }, i) => (
          <div key={opt.id}>
            {/* Section label */}
            <div style={{ paddingTop: i === 0 ? 20 : 28, paddingLeft: HIG.screenMargin, paddingRight: HIG.screenMargin, paddingBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 22, height: 22, borderRadius: 6,
                  backgroundColor: T.cta,
                  color: "#fff", fontSize: TYPE.caption2, fontWeight: 800, fontFamily: font,
                  flexShrink: 0,
                }}>
                  {opt.id}
                </span>
                <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 700, letterSpacing: "-0.02em", fontFamily: font }}>
                  {opt.label}
                </span>
              </div>
              <span style={{ color: T.textTertiary, fontSize: TYPE.footnote, fontFamily: font, paddingLeft: 30 }}>
                {opt.sub}
              </span>
            </div>

            {/* Card preview */}
            <div style={{ paddingLeft: HIG.screenMargin, paddingRight: HIG.screenMargin }}>
              {node}
            </div>

            {/* "Use this one" button */}
            <div style={{ paddingLeft: HIG.screenMargin, paddingRight: HIG.screenMargin, marginTop: 10 }}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/card-options/${opt.id.toLowerCase()}`)}
                style={{
                  width: "100%", height: 44,
                  backgroundColor: "transparent",
                  border: `1px solid ${T.border}`,
                  borderRadius: R.md,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                <span style={{ color: T.textSecondary, fontSize: TYPE.footnote, fontWeight: 600, fontFamily: font, letterSpacing: "-0.01em" }}>
                  Use Option {opt.id}
                </span>
                <ArrowRight size={14} color={T.textTertiary} />
              </motion.button>
            </div>

            {i < 2 && <div style={{ height: "0.5px", backgroundColor: T.border, margin: "24px 0 0" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}