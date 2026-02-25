// EditProfileScreen.tsx — Edit profile form (/home/profile/edit)
// Editable name, email, phone, avatar upload with HIG-style inputs.

import { useState } from "react";
import { useNavigate } from "react-router";
import { CaretLeft, User, Camera, EnvelopeSimple, Phone, Check } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";
import { InitialsAvatar } from "./InitialsAvatar";

const IOS = [0.32, 0.72, 0, 1] as const;

function Field({
  label,
  value,
  onChange,
  icon,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontWeight: 500, fontFamily: font, letterSpacing: "0.02em", textTransform: "uppercase" as const }}>
        {label}
      </span>
      <div
        style={{
          height: 50,
          backgroundColor: T.surfaceElevated,
          border: `1px solid ${focused ? T.cta : T.border}`,
          borderRadius: R.sm,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
          transition: "border-color 0.18s ease",
        }}
      >
        <div style={{ flexShrink: 0, display: "flex", opacity: focused ? 1 : 0.55, transition: "opacity 0.18s" }}>
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            color: T.textPrimary,
            fontSize: TYPE.subhead,
            fontFamily: font,
            letterSpacing: "-0.01em",
          }}
        />
      </div>
    </div>
  );
}

export function EditProfileScreen() {
  const navigate = useNavigate();
  const m = HIG.screenMargin;

  const [name, setName] = useState("Dinesh Kumar");
  const [email, setEmail] = useState("dinesh@example.com");
  const [phone, setPhone] = useState("+1 (404) 555-0182");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => navigate(-1), 1200);
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
            Edit Profile
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget }} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", maxWidth: 560, margin: "0 auto", width: "100%" }}>
        {/* Avatar — live-updating InitialsAvatar responds as the user types their name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 28,
            paddingBottom: 28,
          }}
        >
          <div style={{ position: "relative", marginBottom: 12 }}>
            <InitialsAvatar
              name={name || "?"}
              size={88}
              style={{ border: `2px solid ${T.border}` }}
            />
            <button
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 32,
                height: 32,
                borderRadius: R.full,
                backgroundColor: T.cta,
                border: `2px solid ${T.bg}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Camera size={14} color="#000000" weight="fill" />
            </button>
          </div>
          <span style={{ color: T.textTertiary, fontSize: TYPE.footnote, fontFamily: font }}>
            Tap to change photo
          </span>
        </div>

        <div style={{ height: "0.5px", backgroundColor: T.border }} />

        {/* Form fields */}
        <div style={{ paddingTop: 24, paddingRight: m, paddingBottom: 32, paddingLeft: m, display: "flex", flexDirection: "column", gap: 20 }}>
          <Field
            label="Full Name"
            value={name}
            onChange={setName}
            icon={<User size={18} color={T.textTertiary} />}
          />
          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            icon={<EnvelopeSimple size={18} color={T.textTertiary} />}
            type="email"
          />
          <Field
            label="Phone"
            value={phone}
            onChange={setPhone}
            icon={<Phone size={18} color={T.textTertiary} />}
            type="tel"
          />
        </div>
      </div>

      {/* Save CTA */}
      <div
        style={{
          paddingTop: 12, paddingRight: m, paddingBottom: 16, paddingLeft: m,
          backgroundColor: T.bg,
          borderTop: `0.5px solid ${T.border}`,
          flexShrink: 0,
        }}
      >
        <AnimatePresence mode="wait">
          {!saved ? (
            <motion.button
              key="save"
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 600, damping: 35 }}
              onClick={handleSave}
              style={{
                width: "100%",
                height: 52,
                backgroundColor: T.cta,
                border: "none",
                borderRadius: R.md,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#000000", fontSize: TYPE.callout, fontWeight: 600, letterSpacing: "-0.01em", fontFamily: font }}>
                Save Changes
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="done"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{
                width: "100%",
                height: 52,
                backgroundColor: "rgba(48,209,88,0.10)",
                border: "1px solid rgba(48,209,88,0.25)",
                borderRadius: R.md,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
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
                  transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
                />
              </svg>
              <span style={{ color: "#30D158", fontSize: TYPE.callout, fontWeight: 600, fontFamily: font }}>Saved</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}