// SavedAddressesScreen.tsx — Manage saved addresses (/home/profile/addresses)

import { useState } from "react";
import { useNavigate } from "react-router";
import { CaretLeft, MapPin, Plus, Pencil, Trash, House, Briefcase, Star } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";

interface Address {
  id: string;
  label: string;
  address: string;
  icon: "home" | "work" | "other";
  isDefault: boolean;
}

const INITIAL_ADDRESSES: Address[] = [
  { id: "a1", label: "Home", address: "1842 Peachtree Rd NW, Atlanta, GA 30309", icon: "home", isDefault: true },
  { id: "a2", label: "Work", address: "191 Peachtree St NE, Midtown, GA 30303", icon: "work", isDefault: false },
  { id: "a3", label: "Mom's House", address: "456 Roswell Rd, Sandy Springs, GA 30328", icon: "other", isDefault: false },
];

const ICON_MAP = {
  home: House,
  work: Briefcase,
  other: MapPin,
};

const COLOR_MAP = {
  home: "#FF4D00",
  work: "#FFC043",
  other: "#2E93FA",
};

export function SavedAddressesScreen() {
  const navigate = useNavigate();
  const m = HIG.screenMargin;
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);

  function handleDelete(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  function handleSetDefault(id: string) {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
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
            Saved Addresses
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget }} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", maxWidth: 600, margin: "0 auto", width: "100%" }}>
        <div style={{ paddingTop: 16, paddingRight: m, paddingBottom: 24, paddingLeft: m }}>
          <AnimatePresence>
            {addresses.map((addr, idx) => {
              const Icon = ICON_MAP[addr.icon];
              const color = COLOR_MAP[addr.icon];
              return (
                <motion.div
                  key={addr.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60, height: 0, marginBottom: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                  style={{
                    backgroundColor: T.surfaceElevated,
                    borderRadius: R.md,
                    border: `1px solid ${addr.isDefault ? T.cta : T.border}`,
                    padding: "14px 16px",
                    marginBottom: 10,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Default badge */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    {/* Icon */}
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: R.sm,
                        backgroundColor: T.surfaceElevated,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color={color} weight="fill" />
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 600, letterSpacing: "-0.02em", fontFamily: font }}>
                          {addr.label}
                        </span>
                        {addr.isDefault && (
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
                      <span style={{ color: T.textTertiary, fontSize: TYPE.footnote, fontFamily: font, lineHeight: 1.4 }}>
                        {addr.address}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, marginTop: 12, paddingLeft: 54 }}>
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
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
                      style={{
                        height: 28, paddingLeft: 10, paddingRight: 10,
                        backgroundColor: T.surfaceElevated,
                        border: `1px solid ${T.border}`,
                        borderRadius: R.full,
                        display: "flex", alignItems: "center", gap: 5,
                        cursor: "pointer", fontFamily: font,
                      }}
                    >
                      <Pencil size={11} color={T.textTertiary} weight="regular" />
                      <span style={{ color: T.textSecondary, fontSize: TYPE.caption2, fontWeight: 500 }}>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
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

          {/* Add new address */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 600, damping: 35 }}
            style={{
              width: "100%",
              height: 52,
              backgroundColor: T.surfaceElevated,
              border: `1px solid ${T.border}`,
              borderRadius: R.md,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 6,
              fontFamily: font,
            }}
          >
            <Plus size={18} color={T.cta} weight="bold" />
            <span style={{ color: T.cta, fontSize: TYPE.subhead, fontWeight: 600, letterSpacing: "-0.01em" }}>
              Add New Address
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}