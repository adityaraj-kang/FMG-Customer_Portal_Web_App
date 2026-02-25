import { useState } from "react";
import { useNavigate } from "react-router";
import {
  MapPin, CreditCard, Bell, Moon, CaretRight,
  SignOut, User, Phone, EnvelopeSimple, Sun,
  Question, Gift, Headset,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";
import { useTheme } from "../ThemeContext";
import { InitialsAvatar } from "./InitialsAvatar";

// ─── Toggle switch ────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44,
        height: 26,
        borderRadius: R.full,
        backgroundColor: value ? T.cta : T.surfaceElevated,
        border: `1px solid ${value ? T.cta : T.border}`,
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.2s, border-color 0.2s",
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.7 }}
        style={{
          position: "absolute",
          top: 2,
          left: 0,
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
        }}
      />
    </button>
  );
}

// ─── Section header ───────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <div
      style={{
        paddingTop: 24,
        paddingRight: 16,
        paddingBottom: 8,
        paddingLeft: 16,
      }}
    >
      <span
        style={{
          color: T.textTertiary,
          fontSize: TYPE.caption2,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          fontFamily: font,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── List row ─────────────────────────────────────────────────
// Uses <div> (not <button>) so Toggle and other interactive trail
// elements don't violate the "button inside button" HTML rule.
function ListRow({
  icon,
  iconColor = T.textTertiary,
  label,
  value,
  trail,
  onPress,
}: {
  icon: React.ReactNode;
  iconColor?: string;
  label: string;
  value?: string;
  trail?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <div
      onClick={onPress}
      role={onPress ? "button" : undefined}
      tabIndex={onPress ? 0 : undefined}
      onKeyDown={onPress ? (e) => (e.key === "Enter" || e.key === " ") && onPress() : undefined}
      style={{
        width: "100%",
        background: "none",
        border: "none",
        cursor: onPress ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        gap: 14,
        paddingTop: 0, paddingRight: 16, paddingBottom: 0, paddingLeft: 16,
        minHeight: HIG.listRowMin,
        textAlign: "left",
      }}
    >
      {/* Icon container */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: R.sm,
          backgroundColor: T.surfaceElevated,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Label */}
      <span
        style={{
          flex: 1,
          color: T.textPrimary,
          fontSize: TYPE.subhead,
          fontWeight: 400,
          letterSpacing: "-0.01em",
          fontFamily: font,
        }}
      >
        {label}
      </span>

      {/* Value + chevron / custom trail */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {value && (
          <span style={{ color: T.textTertiary, fontSize: TYPE.subhead, fontFamily: font }}>
            {value}
          </span>
        )}
        {trail ?? (onPress && (
          <CaretRight size={16} color={T.textTertiary} weight="regular" />
        ))}
      </div>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────
function RowDivider() {
  return (
    <div
      style={{
        height: "0.5px",
        backgroundColor: T.divider,
        marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 16 + 32 + 14,
      }}
    />
  );
}

export function ProfileScreen() {
  const m = HIG.screenMargin;
  const navigate = useNavigate();
  const { isDark, toggle: toggleTheme } = useTheme();

  // Preference toggles
  const [notifs,    setNotifs]    = useState(true);

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
      <div style={{ flex: 1, overflowY: "auto", maxWidth: 600, margin: "0 auto", width: "100%" }}>

        {/* ── Avatar + user card ── */}
        <div
          style={{
            paddingTop: 20,
            paddingRight: m,
            paddingBottom: 24,
            paddingLeft: m,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Avatar — InitialsAvatar replaces the generic User icon */}
          <InitialsAvatar name="Dinesh Kumar" size={64} />

          <div style={{ flex: 1 }}>
            <div
              style={{
                color: T.textPrimary,
                fontSize: TYPE.title3,
                fontWeight: 700,
                letterSpacing: "-0.022em",
                marginBottom: 3,
                fontFamily: font,
              }}
            >
              Dinesh Kumar
            </div>
            <div style={{ color: T.textTertiary, fontSize: TYPE.footnote, fontFamily: font }}>
              dinesh@example.com
            </div>
            <div style={{ color: T.textTertiary, fontSize: TYPE.footnote, fontFamily: font }}>
              +1 (404) 555-0182
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={() => navigate("/home/profile/edit")}
            style={{
              height: 32,
              paddingTop: 0, paddingRight: 14, paddingBottom: 0, paddingLeft: 14,
              backgroundColor: T.surfaceElevated,
              border: `1px solid ${T.border}`,
              borderRadius: R.full,
              color: T.textPrimary,
              fontSize: TYPE.footnote,
              fontWeight: 500,
              fontFamily: font,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Edit
          </button>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: "0.5px", backgroundColor: T.border }} />

        {/* ── Account ── */}
        <SectionHeader label="Account" />
        <div style={{ backgroundColor: T.surfaceElevated, borderRadius: R.md, marginTop: 0, marginRight: m, marginBottom: 0, marginLeft: m, overflow: "hidden" }}>
          <ListRow
            icon={<EnvelopeSimple size={17} color="#2E93FA" weight="regular" />}
            label="Email address"
            value="dinesh@…"
            onPress={() => navigate("/home/profile/edit")}
          />
          <RowDivider />
          <ListRow
            icon={<Phone size={17} color="#34C759" weight="regular" />}
            label="Phone number"
            value="+1 (404) 555‑…"
            onPress={() => navigate("/home/profile/edit")}
          />
        </div>

        {/* ── Location ── */}
        <SectionHeader label="Location" />
        <div style={{ backgroundColor: T.surfaceElevated, borderRadius: R.md, marginTop: 0, marginRight: m, marginBottom: 0, marginLeft: m, overflow: "hidden" }}>
          <ListRow
            icon={<MapPin size={17} color={T.cta} weight="fill" />}
            label="Home address"
            value="Atlanta, GA"
            onPress={() => navigate("/home/profile/addresses")}
          />
          <RowDivider />
          <ListRow
            icon={<MapPin size={17} color="#FFC043" weight="regular" />}
            label="Work address"
            value="Midtown"
            onPress={() => navigate("/home/profile/addresses")}
          />
        </div>

        {/* ── Payment ── */}
        <SectionHeader label="Payment" />
        <div style={{ backgroundColor: T.surfaceElevated, borderRadius: R.md, marginTop: 0, marginRight: m, marginBottom: 0, marginLeft: m, overflow: "hidden" }}>
          <ListRow
            icon={<CreditCard size={17} color="#A78BFA" weight="regular" />}
            label="Visa •••• 4242"
            value="Default"
            onPress={() => navigate("/home/profile/payment")}
          />
          <RowDivider />
          <ListRow
            icon={<CreditCard size={17} color={T.textTertiary} weight="regular" />}
            label="Add payment method"
            onPress={() => navigate("/home/profile/payment")}
          />
        </div>

        {/* ── Preferences ── */}
        <SectionHeader label="Preferences" />
        <div style={{ backgroundColor: T.surfaceElevated, borderRadius: R.md, marginTop: 0, marginRight: m, marginBottom: 0, marginLeft: m, overflow: "hidden" }}>
          <ListRow
            icon={<Bell size={17} color="#FFC043" weight="regular" />}
            label="Push notifications"
            onPress={() => navigate("/home/profile/notifications")}
            trail={<Toggle value={notifs} onChange={setNotifs} />}
          />
          <RowDivider />
          <ListRow
            icon={isDark ? <Moon size={17} color="#A78BFA" weight="regular" /> : <Sun size={17} color="#FFC043" weight="regular" />}
            label={isDark ? "Dark mode" : "Light mode"}
            trail={<Toggle value={isDark} onChange={toggleTheme} />}
          />
        </div>

        {/* ── Help & More ── */}
        <SectionHeader label="Help & More" />
        <div style={{ backgroundColor: T.surfaceElevated, borderRadius: R.md, marginTop: 0, marginRight: m, marginBottom: 0, marginLeft: m, overflow: "hidden" }}>
          <ListRow
            icon={<Gift size={17} color={T.cta} weight="regular" />}
            label="Promotions & Offers"
            onPress={() => navigate("/home/promotions")}
          />
          <RowDivider />
          <ListRow
            icon={<Question size={17} color="#2E93FA" weight="regular" />}
            label="Help & FAQ"
            onPress={() => navigate("/home/help")}
          />
          <RowDivider />
          <ListRow
            icon={<Headset size={17} color="#34C759" weight="regular" />}
            label="Contact Support"
            onPress={() => navigate("/home/support")}
          />
        </div>

        {/* ── Sign out ── */}
        <div style={{ paddingTop: 28, paddingRight: m, paddingBottom: 32, paddingLeft: m }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 600, damping: 35 }}
            style={{
              width: "100%",
              height: 52,
              backgroundColor: "transparent",
              border: `1px solid rgba(255,45,85,0.28)`,
              borderRadius: R.md,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
              fontFamily: font,
            }}
          >
            <SignOut size={17} color="#FF2D55" weight="regular" />
            <span style={{ color: "#FF2D55", fontSize: TYPE.subhead, fontWeight: 500, fontFamily: font }}>
              Sign out
            </span>
          </motion.button>
        </div>

      </div>
    </div>
  );
}