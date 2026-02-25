// PromotionsScreen.tsx — Offers, referrals, deals (/home/promotions)

import { useState } from "react";
import { useNavigate } from "react-router";
import {
  CaretLeft, Gift, Ticket, Users, Tag, Copy, Check, Clock,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";

function tint(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

interface Promo {
  id: string;
  type: "deal" | "referral" | "reward";
  title: string;
  description: string;
  code?: string;
  discount: string;
  expiry: string;
  color: string;
}

const PROMOS: Promo[] = [
  { id: "p1", type: "deal", title: "First Service Free", description: "Get $50 off your first Genie booking. New users only.", code: "GENIE50", discount: "$50 off", expiry: "Mar 31, 2026", color: T.cta },
  { id: "p2", type: "referral", title: "Refer a Friend", description: "Share your code. Both of you get $25 credit when they book.", code: "DINESH25", discount: "$25 each", expiry: "No expiry", color: "#2E93FA" },
  { id: "p3", type: "deal", title: "Spring HVAC Tune-Up", description: "Seasonal AC maintenance at 30% off. Limited spots.", code: "SPRING30", discount: "30% off", expiry: "Apr 15, 2026", color: "#00E096" },
  { id: "p4", type: "reward", title: "Loyalty Reward", description: "You've completed 5 bookings! Here's a reward.", discount: "$15 credit", expiry: "Jun 1, 2026", color: "#FFC043" },
  { id: "p5", type: "deal", title: "Weekend Special", description: "Book any service this weekend and save 15%.", code: "WKND15", discount: "15% off", expiry: "Mar 2, 2026", color: "#A78BFA" },
];

const TYPE_ICONS: Record<string, React.ElementType> = {
  deal: Tag,
  referral: Users,
  reward: Gift,
};

export function PromotionsScreen() {
  const navigate = useNavigate();
  const m = HIG.screenMargin;
  const [copied, setCopied] = useState<string | null>(null);

  function handleCopy(code: string) {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
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
            Promotions
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget }} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", maxWidth: 680, margin: "0 auto", width: "100%" }}>
        {/* Referral hero */}
        <div style={{ paddingTop: 16, paddingRight: m, paddingBottom: 20, paddingLeft: m }}>
          <div style={{
            background: `linear-gradient(135deg, ${T.cta}, #FF8C00)`,
            borderRadius: R.lg, padding: "20px 18px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Gift size={20} color="#FFFFFF" weight="fill" />
              <span style={{ color: "#FFFFFF", fontSize: TYPE.title3, fontWeight: 700, fontFamily: font }}>
                Earn $25 Credit
              </span>
            </div>
            <p style={{ margin: "0 0 14px", color: "rgba(255,255,255,0.8)", fontSize: TYPE.subhead, lineHeight: 1.5, fontFamily: font }}>
              Share your referral code with friends. You both get $25 when they complete their first booking.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                flex: 1, height: 40,
                backgroundColor: "rgba(0,0,0,0.25)",
                borderRadius: R.sm,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
                <span style={{ color: "#FFFFFF", fontSize: TYPE.subhead, fontWeight: 700, fontFamily: font, letterSpacing: "0.1em" }}>
                  DINESH25
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCopy("DINESH25")}
                style={{
                  height: 40, paddingLeft: 16, paddingRight: 16,
                  backgroundColor: "#FFFFFF", border: "none",
                  borderRadius: R.sm, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  fontFamily: font,
                }}
              >
                {copied === "DINESH25" ? (
                  <Check size={14} color="#34C759" weight="bold" />
                ) : (
                  <Copy size={14} color="#000000" weight="bold" />
                )}
                <span style={{ color: "#000000", fontSize: TYPE.footnote, fontWeight: 600 }}>
                  {copied === "DINESH25" ? "Copied" : "Copy"}
                </span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Offers list */}
        <div style={{ paddingRight: m, paddingBottom: 32, paddingLeft: m }}>
          <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const, fontFamily: font, display: "block", marginBottom: 12 }}>
            Available Offers
          </span>
          {PROMOS.filter((p) => p.type !== "referral").map((promo, idx) => {
            const Icon = TYPE_ICONS[promo.type];
            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.22 }}
                style={{
                  backgroundColor: T.surfaceElevated,
                  borderRadius: R.md,
                  border: `1px solid ${T.border}`,
                  padding: "14px 16px",
                  marginBottom: 10,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", backgroundColor: promo.color }} />
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: R.sm,
                    backgroundColor: tint(promo.color, 0.13),
                    border: `1px solid ${tint(promo.color, 0.28)}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={18} color={promo.color} weight="fill" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 600, fontFamily: font }}>
                        {promo.title}
                      </span>
                      <span style={{ color: promo.color, fontSize: TYPE.footnote, fontWeight: 700, fontFamily: font }}>
                        {promo.discount}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 8px", color: T.textTertiary, fontSize: TYPE.footnote, lineHeight: 1.4, fontFamily: font }}>
                      {promo.description}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={10} color={T.textTertiary} />
                        <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>
                          Expires {promo.expiry}
                        </span>
                      </div>
                      {promo.code && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopy(promo.code!)}
                          style={{
                            height: 24, paddingLeft: 8, paddingRight: 8,
                            backgroundColor: T.surfaceElevated,
                            border: `1px solid ${T.border}`,
                            borderRadius: R.full,
                            display: "flex", alignItems: "center", gap: 4,
                            cursor: "pointer", fontFamily: font,
                          }}
                        >
                          {copied === promo.code ? (
                            <Check size={10} color="#34C759" weight="bold" />
                          ) : (
                            <Copy size={10} color={T.textTertiary} weight="regular" />
                          )}
                          <span style={{ color: T.textSecondary, fontSize: TYPE.caption2, fontWeight: 500 }}>
                            {promo.code}
                          </span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}