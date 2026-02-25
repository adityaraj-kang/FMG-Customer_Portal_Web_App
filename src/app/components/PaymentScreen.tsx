// PaymentScreen.tsx — Select payment method & pay (/home/payment)
// Pay button morphs: full-width → pill → spinner → success burst → navigate.

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  CaretLeft, CaretDown, CaretUp, AppleLogo, CreditCard, Money,
  ArrowRight, GoogleLogo, PencilSimple,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";

const IOS = [0.32, 0.72, 0, 1] as const;

// ─── Pre-computed particle configs ───────────────────────────
const BURST_PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  angle: (i / 10) * Math.PI * 2,
  dist:  28 + (i % 3) * 14,
  color: i % 2 === 0 ? "#30D158" : "rgba(48,209,88,0.45)",
  size:  i % 3 === 0 ? 7 : 5,
}));

// ─── Payment method data ──────────────────────────────────────
interface PayMethod { id: string; label: string; sublabel: string; IconEl: React.ElementType }

const PAY_METHODS: PayMethod[] = [
  { id: "apple",  label: "Apple Pay",           sublabel: "Touch ID · Fastest",      IconEl: AppleLogo   },
  { id: "gpay",   label: "Google Pay",           sublabel: "Google Wallet",            IconEl: GoogleLogo  },
  { id: "card",   label: "Credit / Debit Card",  sublabel: "Visa · Mastercard · Amex", IconEl: CreditCard },
  { id: "cash",   label: "Cash on delivery",     sublabel: "Pay when work is done",    IconEl: Money       },
];

type PayState = "idle" | "processing" | "success";

export function PaymentScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state    = location.state as Record<string, unknown> | null;
  const m        = HIG.screenMargin;

  const vendor      = state?.vendor as { name: string; price: number; eta: string } | undefined;
  const address     = (state?.address as string | undefined) ?? "3285 Peachtree Rd NE, Atlanta, GA";
  const serviceName = (state?.serviceName as string | undefined) ?? "Service";

  const price       = vendor?.price ?? 85;
  const platformFee = 5;
  const total       = price + platformFee;

  const [selectedMethod,  setSelectedMethod]  = useState<string | null>(null);
  const [showBreakdown,   setShowBreakdown]   = useState(false);
  const [payState,        setPayState]        = useState<PayState>("idle");

  // Measure the CTA container width for the morph animation
  const ctaRef   = useRef<HTMLDivElement>(null);
  const [ctaWidth, setCtaWidth] = useState(0);
  useEffect(() => {
    if (ctaRef.current) setCtaWidth(ctaRef.current.offsetWidth);
  }, []);

  const isActive = !!selectedMethod && payState === "idle";

  function handlePay() {
    if (!isActive) return;
    setPayState("processing");
    setTimeout(() => {
      setPayState("success");
      setTimeout(() => navigate("/home/tracking", { state }), 900);
    }, 1700);
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
      <style>{`.pay-input::placeholder { color: ${T.textTertiary}; }`}</style>

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
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: T.textPrimary, fontSize: TYPE.headline, fontWeight: 700, letterSpacing: "-0.022em", fontFamily: font }}>
            Payment
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget, flexShrink: 0 }} />
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto", maxWidth: 560, margin: "0 auto", width: "100%" }}>

        {/* ── Amount hero ── */}
        <div style={{ textAlign: "center", paddingTop: 28, paddingBottom: 4 }}>
          <div
            style={{
              color: T.textPrimary,
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              fontFamily: font,
              lineHeight: 1.05,
            }}
          >
            ${total}
          </div>
          <button
            onClick={() => setShowBreakdown((b) => !b)}
            style={{
              marginTop: 6,
              display: "inline-flex", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer",
              color: T.textTertiary, fontSize: TYPE.footnote, fontFamily: font,
            }}
          >
            {showBreakdown ? "Hide" : "View"} breakdown
            {showBreakdown
              ? <CaretUp  size={12} color={T.textTertiary} />
              : <CaretDown size={12} color={T.textTertiary} />
            }
          </button>
        </div>

        {/* Price breakdown (expandable) */}
        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.26, ease: IOS }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ paddingLeft: m, paddingRight: m, paddingTop: 10, paddingBottom: 4 }}>
                <div
                  style={{
                    backgroundColor: T.surfaceElevated,
                    border: `1px solid ${T.border}`,
                    borderRadius: R.md,
                    overflow: "hidden",
                  }}
                >
                  {[
                    { label: `${serviceName} fee`, value: `$${price}` },
                    { label: "Genie platform fee", value: `$${platformFee}` },
                  ].map((row, i) => (
                    <div key={i}>
                      {i > 0 && <div style={{ height: "0.5px", backgroundColor: T.divider }} />}
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px" }}>
                        <span style={{ color: T.textSecondary, fontSize: TYPE.footnote, fontFamily: font }}>{row.label}</span>
                        <span style={{ color: T.textPrimary, fontSize: TYPE.footnote, fontWeight: 600, fontFamily: font }}>{row.value}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ height: "0.5px", backgroundColor: T.divider }} />
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px" }}>
                    <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 700, fontFamily: font }}>Total</span>
                    <span style={{ color: T.cta, fontSize: TYPE.subhead, fontWeight: 700, fontFamily: font }}>${total}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Service address ── */}
        <div style={{ paddingLeft: m, paddingRight: m, paddingTop: 20, paddingBottom: 4 }}>
          <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.footnote, fontWeight: 700, letterSpacing: "-0.01em", fontFamily: font, marginBottom: 10 }}>
            Service address
          </span>
          <div
            style={{
              backgroundColor: T.surfaceElevated,
              border: `1px solid ${T.border}`,
              borderRadius: R.md,
              paddingTop: 12, paddingRight: 14, paddingBottom: 12, paddingLeft: 14,
              display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10,
            }}
          >
            <div style={{ flex: 1 }}>
              <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 500, fontFamily: font, marginBottom: 2, letterSpacing: "-0.01em" }}>
                {address.split(",")[0]}
              </span>
              <span style={{ color: T.textTertiary, fontSize: TYPE.footnote, fontFamily: font }}>
                {address.split(",").slice(1).join(",").trim()}
              </span>
            </div>
            <button
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "none", border: "none", cursor: "pointer",
                color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font,
                paddingTop: 2,
              }}
              onClick={() => navigate(-2)}
            >
              <PencilSimple size={14} color={T.textTertiary} />
              Edit
            </button>
          </div>
        </div>

        {/* ── Payment methods ── */}
        <div style={{ paddingLeft: m, paddingRight: m, paddingTop: 20 }}>
          <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.footnote, fontWeight: 700, letterSpacing: "-0.01em", fontFamily: font, marginBottom: 10 }}>
            Payment methods
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PAY_METHODS.map((method) => {
              const isSelected = selectedMethod === method.id;
              const Icon = method.IconEl;
              return (
                <motion.button
                  key={method.id}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  onClick={() => setSelectedMethod(method.id)}
                  style={{
                    background: "none",
                    border: `1.5px solid ${isSelected ? T.cta : T.border}`,
                    borderRadius: R.md,
                    backgroundColor: isSelected ? "rgba(255,77,0,0.07)" : T.surfaceElevated,
                    paddingTop: 14, paddingRight: 14, paddingBottom: 14, paddingLeft: 14,
                    display: "flex", alignItems: "center", gap: 14,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 0.15s, background-color 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: R.sm,
                      backgroundColor: isSelected ? "rgba(255,77,0,0.12)" : T.surfaceElevated,
                      border: `1px solid ${isSelected ? "rgba(255,77,0,0.3)" : T.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      transition: "background-color 0.15s",
                    }}
                  >
                    <Icon size={20} color={isSelected ? T.cta : T.textSecondary} weight="regular" />
                  </div>

                  <div style={{ flex: 1 }}>
                    <span style={{ display: "block", color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 500, letterSpacing: "-0.01em", fontFamily: font }}>
                      {method.label}
                    </span>
                    <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>
                      {method.sublabel}
                    </span>
                  </div>

                  <div
                    style={{
                      width: 20, height: 20, borderRadius: "50%",
                      border: `2px solid ${isSelected ? T.cta : T.border}`,
                      backgroundColor: isSelected ? T.cta : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      transition: "border-color 0.15s, background-color 0.15s",
                    }}
                  >
                    {isSelected && (
                      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#fff" }} />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div style={{ height: 24 }} />
      </div>

      {/* ── Sticky Pay CTA ── */}
      <div
        style={{
          flexShrink: 0,
          paddingTop: 10, paddingRight: m, paddingBottom: 16, paddingLeft: m,
          backgroundColor: T.bg,
          borderTop: `0.5px solid ${T.border}`,
        }}
      >
        {/* Morphing button container — measured so we know the "full" pixel width */}
        <div
          ref={ctaRef}
          style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 52 }}
        >
          {/* ── The morphing shape ── */}
          <motion.div
            layout
            onClick={handlePay}
            animate={{
              width:        payState === "processing" ? 52 : (ctaWidth || "100%"),
              borderRadius: payState === "processing" ? 26 : 10,
              backgroundColor:
                payState === "success"    ? "rgba(48,209,88,0.10)" :
                payState === "processing" ? T.surfaceElevated :
                isActive                  ? T.cta            : T.surfaceElevated,
              borderColor:
                payState === "success"    ? "rgba(48,209,88,0.25)"  :
                payState === "processing" ? T.border          :
                isActive                  ? T.cta             : T.border,
            }}
            transition={{ layout: { type: "spring", stiffness: 300, damping: 28 }, duration: 0.35, ease: IOS }}
            style={{
              position: "absolute",
              height: 52,
              border: `1.5px solid`,
              overflow: "hidden",
              cursor: isActive ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <AnimatePresence mode="wait">
              {/* Idle label */}
              {payState === "idle" && (
                <motion.div
                  key="label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  style={{ display: "flex", alignItems: "center", gap: 8, pointerEvents: "none" }}
                >
                  <span
                    style={{
                      color: isActive ? "#000000" : T.textTertiary,
                      fontSize: TYPE.callout, fontWeight: 600,
                      letterSpacing: "-0.01em", fontFamily: font,
                    }}
                  >
                    {isActive ? `Pay $${total}` : "Select a payment method"}
                  </span>
                  {isActive && <ArrowRight size={16} color="#000000" weight="bold" />}
                </motion.div>
              )}

              {/* Processing spinner */}
              {payState === "processing" && (
                <motion.div
                  key="spinner"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: 22, height: 22, borderRadius: "50%",
                      border: `2.5px solid ${T.border}`,
                      borderTopColor: T.cta,
                    }}
                  />
                </motion.div>
              )}

              {/* Success checkmark */}
              {payState === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", alignItems: "center", gap: 10, pointerEvents: "none" }}
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
                      transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
                    />
                  </svg>
                  <span style={{ color: "#30D158", fontSize: TYPE.callout, fontWeight: 600, letterSpacing: "-0.01em", fontFamily: font }}>
                    Payment Successful!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Success burst particles ── */}
          {payState === "success" && BURST_PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                width: p.size, height: p.size,
                borderRadius: "50%",
                backgroundColor: p.color,
                left: "50%", top: "50%",
                marginLeft: -p.size / 2, marginTop: -p.size / 2,
                pointerEvents: "none",
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(p.angle) * p.dist,
                y: Math.sin(p.angle) * p.dist,
                opacity: 0,
                scale: 0.2,
              }}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.02 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}