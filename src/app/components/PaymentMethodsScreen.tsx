// PaymentMethodsScreen.tsx — Manage payment methods (/home/profile/payment)

import { useState } from "react";
import { useNavigate } from "react-router";
import { CaretLeft, CreditCard, Plus, Trash, Star, ShieldCheck, Bank } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex" | "bank";
  label: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const INITIAL_METHODS: PaymentMethod[] = [
  { id: "p1", type: "visa", label: "Visa", last4: "4242", expiry: "09/27", isDefault: true },
  { id: "p2", type: "mastercard", label: "Mastercard", last4: "8831", expiry: "03/26", isDefault: false },
  { id: "p3", type: "bank", label: "Bank Account", last4: "6712", expiry: "Checking", isDefault: false },
];

const CARD_COLORS: Record<string, string> = {
  visa: "#1A1F71",
  mastercard: "#EB001B",
  amex: "#006FCF",
  bank: "#34C759",
};

const CARD_ICONS: Record<string, React.ElementType> = {
  visa: CreditCard,
  mastercard: CreditCard,
  amex: CreditCard,
  bank: Bank,
};

export function PaymentMethodsScreen() {
  const navigate = useNavigate();
  const m = HIG.screenMargin;
  const [methods, setMethods] = useState(INITIAL_METHODS);

  function handleDelete(id: string) {
    setMethods((prev) => prev.filter((p) => p.id !== id));
  }

  function handleSetDefault(id: string) {
    setMethods((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));
  }

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
      {/* Nav bar */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          paddingTop: 8, paddingRight: m, paddingBottom: 4, paddingLeft: 4,
          minHeight: 56,
          borderBottom: `0.5px solid ${T.border}`,
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
          <CaretLeft size={22} color={T.textPrimary} weight="bold" />
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <span style={{ color: T.textPrimary, fontSize: TYPE.headline, fontWeight: 700, letterSpacing: "-0.022em", fontFamily: font }}>
            Payment Methods
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget }} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", maxWidth: 600, margin: "0 auto", width: "100%" }}>
        <div style={{ paddingTop: 16, paddingRight: m, paddingBottom: 24, paddingLeft: m }}>
          <AnimatePresence>
            {methods.map((method, idx) => {
              const Icon = CARD_ICONS[method.type];
              const color = CARD_COLORS[method.type];
              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60, height: 0, marginBottom: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.22 }}
                  style={{
                    backgroundColor: T.surfaceElevated,
                    borderRadius: R.md,
                    border: `1px solid ${method.isDefault ? T.cta : T.border}`,
                    padding: "16px",
                    marginBottom: 10,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {method.isDefault && (
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: T.cta }} />
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 44, height: 32, borderRadius: R.xs,
                        backgroundColor: color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} color="#FFFFFF" weight="regular" />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 600, fontFamily: font }}>
                          {method.label} •••• {method.last4}
                        </span>
                        {method.isDefault && (
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: 3,
                            height: 18, paddingLeft: 6, paddingRight: 6,
                            backgroundColor: "rgba(255,77,0,0.12)",
                            borderRadius: R.full,
                          }}>
                            <Star size={9} color={T.cta} weight="fill" />
                            <span style={{ color: T.cta, fontSize: TYPE.caption2, fontWeight: 600, fontFamily: font }}>Default</span>
                          </div>
                        )}
                      </div>
                      <span style={{ color: T.textTertiary, fontSize: TYPE.footnote, fontFamily: font }}>
                        {method.expiry}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, marginTop: 12, paddingLeft: 58 }}>
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        style={{
                          height: 28, paddingLeft: 10, paddingRight: 10,
                          backgroundColor: T.surfaceElevated,
                          border: `1px solid ${T.border}`,
                          borderRadius: R.full,
                          display: "flex", alignItems: "center", gap: 5,
                          cursor: "pointer", fontFamily: font,
                        }}
                      >
                        <Star size={11} color={T.textTertiary} weight="regular" />
                        <span style={{ color: T.textSecondary, fontSize: TYPE.caption2, fontWeight: 500 }}>Set default</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(method.id)}
                      style={{
                        height: 28, paddingLeft: 10, paddingRight: 10,
                        backgroundColor: T.surfaceElevated,
                        border: `1px solid ${T.border}`,
                        borderRadius: R.full,
                        display: "flex", alignItems: "center", gap: 5,
                        cursor: "pointer", fontFamily: font,
                      }}
                    >
                      <Trash size={11} color="#FF2D55" weight="regular" />
                      <span style={{ color: "#FF2D55", fontSize: TYPE.caption2, fontWeight: 500 }}>Remove</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add method */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 600, damping: 35 }}
            style={{
              width: "100%", height: 52,
              backgroundColor: T.surfaceElevated,
              border: `1px solid ${T.border}`,
              borderRadius: R.md,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, marginTop: 6, fontFamily: font,
            }}
          >
            <Plus size={18} color={T.cta} weight="bold" />
            <span style={{ color: T.cta, fontSize: TYPE.subhead, fontWeight: 600 }}>
              Add Payment Method
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}