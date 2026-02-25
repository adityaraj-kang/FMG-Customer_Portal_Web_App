// ChatScreen.tsx — Initial chat entry point (/home/chat)
// Reached by tapping the HomeScreen search bar.
// Tap a service tile → conversation screen for that service.
// Type a query + send → conversation with free-text prompt.

import { useState } from "react";
import { useNavigate } from "react-router";
import { useIsMobile } from "./ui/use-mobile";
import {
  CaretLeft, CaretRight, ArrowUp,
  Truck, PipeWrench, Snowflake, Lightning, Tree, Hammer, HouseLine, Bug,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";
import { SERVICES } from "../data";

// ─── Hex → tinted rgba ────────────────────────────────────────
function tint(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const ICON_MAP: Record<string, React.ElementType> = {
  towing:      Truck,
  plumber:     PipeWrench,
  hvac:        Snowflake,
  electrician: Lightning,
  lawn:        Tree,
  handyman:    Hammer,
  roofing:     HouseLine,
  pest:        Bug,
};

const QUICK_PROMPTS = [
  "My car broke down on I-85",
  "Burst pipe — need a plumber fast",
  "AC isn't cooling the house",
  "Need an electrician today",
];

export function ChatScreen() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [input, setInput] = useState("");
  const m = HIG.screenMargin;

  const handleSubmit = () => {
    const q = input.trim();
    if (q) navigate(`/home/chat/general`, { state: { query: q } });
  };

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
      <style>{`.gc-input::placeholder { color: ${T.textTertiary}; }`}</style>

      {/* ── Header ── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          height: 56,
          paddingLeft: 4,
          paddingRight: m,
          borderBottom: `0.5px solid ${T.border}`,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            minWidth: HIG.minTapTarget,
            minHeight: HIG.minTapTarget,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <CaretLeft size={22} color={T.textPrimary} weight="bold" />
        </button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span
            style={{
              color: T.textPrimary,
              fontSize: TYPE.headline,
              fontWeight: 700,
              letterSpacing: "-0.022em",
              fontFamily: font,
            }}
          >
            Let Genie help you
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget, flexShrink: 0 }} />
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: isMobile ? "none" : 720, margin: "0 auto" }}>

        {/* Suggestions label */}
        <div style={{ paddingTop: 20, paddingLeft: m, paddingRight: m, paddingBottom: 14 }}>
          <span
            style={{
              color: T.textPrimary,
              fontSize: TYPE.title3,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontFamily: font,
            }}
          >
            Suggestions
          </span>
        </div>

        {/* 4×2 service grid */}
        <div
          style={{
            paddingLeft: m,
            paddingRight: m,
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(4, 1fr)" : "repeat(8, 1fr)",
            gap: 10,
          }}
        >
          {SERVICES.map((svc, i) => {
            const Icon = ICON_MAP[svc.id] ?? Truck;
            return (
              <motion.button
                key={svc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.22 }}
                whileTap={{ scale: 0.91 }}
                onClick={() => navigate(`/home/chat/${svc.id}`)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: 0,
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: R.md,
                    backgroundColor: tint(svc.color, 0.13),
                    border: `1px solid ${tint(svc.color, 0.28)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={25} color={svc.color} weight="regular" />
                </div>
                <span
                  style={{
                    color: T.textSecondary,
                    fontSize: TYPE.caption1,
                    fontWeight: 500,
                    textAlign: "center",
                    maxWidth: 56,
                    lineHeight: 1.25,
                    letterSpacing: "-0.01em",
                    fontFamily: font,
                  }}
                >
                  {svc.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Quick prompts */}
        <div
          style={{
            paddingTop: 28,
            paddingLeft: m,
            paddingRight: m,
            paddingBottom: 10,
          }}
        >
          <span
            style={{
              color: T.textTertiary,
              fontSize: TYPE.footnote,
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase" as const,
              fontFamily: font,
            }}
          >
            Quick requests
          </span>
        </div>

        <div
          style={{
            paddingLeft: m,
            paddingRight: m,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            paddingBottom: 24,
          }}
        >
          {QUICK_PROMPTS.map((prompt, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.24 + i * 0.06, duration: 0.22 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/home/chat/general", { state: { query: prompt } })}
              style={{
                background: "none",
                border: `1px solid ${T.border}`,
                borderRadius: R.md,
                paddingTop: 12,
                paddingRight: 14,
                paddingBottom: 12,
                paddingLeft: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "left",
                backgroundColor: T.surfaceElevated,
              }}
            >
              <span
                style={{
                  color: T.textSecondary,
                  fontSize: TYPE.subhead,
                  fontFamily: font,
                  letterSpacing: "-0.01em",
                }}
              >
                {prompt}
              </span>
              <CaretRight size={16} color={T.textTertiary} weight="regular" />
            </motion.button>
          ))}
        </div>
        </div>{/* end maxWidth wrapper */}
      </div>

      {/* ── Input bar ── */}
      <div
        style={{
          flexShrink: 0,
          paddingTop: 12,
          paddingRight: m,
          paddingBottom: 20,
          paddingLeft: m,
          borderTop: `0.5px solid ${T.border}`,
        }}
      >
        <div
          style={{
            height: 50,
            backgroundColor: T.surfaceElevated,
            border: `1px solid ${T.border}`,
            borderRadius: R.full,
            display: "flex",
            alignItems: "center",
            paddingLeft: 18,
            paddingRight: 8,
            gap: 8,
          }}
        >
          <input
            className="gc-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Describe what you need..."
            autoFocus
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
          <motion.button
            onClick={handleSubmit}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 34,
              height: 34,
              borderRadius: R.full,
              backgroundColor: input.trim() ? T.cta : T.surfaceElevated,
              border: input.trim() ? "none" : `1px solid ${T.border}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background-color 0.18s, border-color 0.18s",
            }}
          >
            <ArrowUp size={15} color={input.trim() ? "#000" : T.textTertiary} weight="bold" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}