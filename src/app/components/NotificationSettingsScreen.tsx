// NotificationSettingsScreen.tsx — Granular notification toggles (/home/profile/notifications)

import { useState } from "react";
import { useNavigate } from "react-router";
import {
  CaretLeft, Bell, ChatCircle, MapPin, CreditCard,
  Megaphone, Star, ShieldCheck,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 26, borderRadius: R.full,
        backgroundColor: value ? T.cta : T.surfaceElevated,
        border: `1px solid ${value ? T.cta : T.border}`,
        position: "relative", cursor: "pointer", flexShrink: 0,
        transition: "background-color 0.2s, border-color 0.2s",
      }}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.7 }}
        style={{
          position: "absolute", top: 2, left: 0,
          width: 20, height: 20, borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
        }}
      />
    </button>
  );
}

interface NotifSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  channels: { push: boolean; email: boolean; sms: boolean };
}

const INITIAL_SETTINGS: NotifSetting[] = [
  { id: "booking", label: "Booking Updates", description: "Status changes, vendor arrival, completion", icon: Bell, iconColor: T.cta, channels: { push: true, email: true, sms: true } },
  { id: "chat", label: "Chat Messages", description: "Genie and vendor messages", icon: ChatCircle, iconColor: "#2E93FA", channels: { push: true, email: false, sms: false } },
  { id: "tracking", label: "Live Tracking", description: "Vendor en-route and location updates", icon: MapPin, iconColor: "#34C759", channels: { push: true, email: false, sms: true } },
  { id: "payment", label: "Payment Alerts", description: "Receipts, charges, and refunds", icon: CreditCard, iconColor: "#A78BFA", channels: { push: true, email: true, sms: false } },
  { id: "promotions", label: "Promotions & Offers", description: "Deals, discounts, and seasonal offers", icon: Megaphone, iconColor: "#FFC043", channels: { push: true, email: true, sms: false } },
  { id: "reviews", label: "Review Reminders", description: "Post-service rating prompts", icon: Star, iconColor: "#FFC043", channels: { push: true, email: false, sms: false } },
  { id: "security", label: "Security Alerts", description: "Login attempts and account changes", icon: ShieldCheck, iconColor: "#FF2D55", channels: { push: true, email: true, sms: true } },
];

export function NotificationSettingsScreen() {
  const navigate = useNavigate();
  const m = HIG.screenMargin;
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  function toggleChannel(id: string, channel: "push" | "email" | "sms") {
    setSettings((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, channels: { ...s.channels, [channel]: !s.channels[channel] } }
          : s
      )
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
            Notifications
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget }} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", maxWidth: 600, margin: "0 auto", width: "100%" }}>
        {/* Settings list */}
        <div style={{ paddingTop: 16, paddingRight: m, paddingBottom: 32, paddingLeft: m }}>
          {settings.map((setting, idx) => {
            const Icon = setting.icon;
            return (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.22 }}
                style={{
                  backgroundColor: T.surfaceElevated,
                  borderRadius: R.md,
                  border: `1px solid ${T.border}`,
                  padding: "14px 14px 12px",
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: R.sm,
                      backgroundColor: T.surfaceElevated,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} color={setting.iconColor} weight="regular" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 600, fontFamily: font, display: "block", letterSpacing: "-0.01em" }}>
                      {setting.label}
                    </span>
                    <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>
                      {setting.description}
                    </span>
                  </div>
                  <Toggle
                    value={setting.channels.push}
                    onChange={() => toggleChannel(setting.id, "push")}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}