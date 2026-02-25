// ServicesScreen.tsx — Full service catalogue (/home/services)
// Service tiles navigate to chat, not detail.

import { useState } from "react";
import { useNavigate } from "react-router";
import { MagnifyingGlass, SlidersHorizontal } from "@phosphor-icons/react";
import {
  Truck, PipeWrench, Snowflake, Lightning, Tree, Hammer, HouseLine, Bug,
} from "@phosphor-icons/react";
import { T, font, R, HIG, TYPE } from "../tokens";
import { SERVICES } from "../data";
import { useIsMobile } from "./ui/use-mobile";

// ─── Hex colour → tinted rgba ─────────────────────────────────
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

const CATEGORIES = ["All", "Emergency", "Home", "Outdoor", "Electrical"];

const SERVICE_CATEGORIES: Record<string, string[]> = {
  towing:      ["Emergency"],
  plumber:     ["Emergency", "Home"],
  hvac:        ["Home"],
  electrician: ["Electrical", "Emergency"],
  lawn:        ["Outdoor"],
  handyman:    ["Home"],
  roofing:     ["Home", "Outdoor"],
  pest:        ["Home"],
};

export function ServicesScreen() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState("All");
  const m = HIG.screenMargin;

  const filtered = SERVICES.filter((svc) => {
    const matchesQuery = svc.label.toLowerCase().includes(query.toLowerCase());
    const matchesCat   = category === "All" || (SERVICE_CATEGORIES[svc.id] ?? []).includes(category);
    return matchesQuery && matchesCat;
  });

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
      <style>{`.sv-input::placeholder { color: ${T.textTertiary}; }`}</style>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: isMobile ? "none" : 800, margin: "0 auto" }}>

        {/* Page header */}
        <div style={{ paddingTop: 16, paddingRight: m, paddingBottom: 0, paddingLeft: m }}>
          <h1 style={{ margin: "0 0 4px", color: T.textPrimary, fontSize: TYPE.title2, fontWeight: 700, letterSpacing: "-0.022em", fontFamily: font }}>
            All Services
          </h1>
        </div>

        {/* Search bar */}
        <div style={{ paddingTop: 16, paddingRight: m, paddingBottom: 0, paddingLeft: m }}>
          <div
            style={{
              height: 44,
              backgroundColor: T.surfaceElevated,
              border: `1px solid ${T.border}`,
              borderRadius: R.md,
              display: "flex",
              alignItems: "center",
              paddingTop: 0, paddingRight: 14, paddingBottom: 0, paddingLeft: 14,
              gap: 10,
            }}
          >
            <MagnifyingGlass size={17} color={T.textTertiary} weight="regular" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services…"
              className="sv-input"
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                color: T.textPrimary, fontSize: TYPE.subhead, fontFamily: font,
                letterSpacing: "-0.01em",
              }}
            />
            <SlidersHorizontal size={17} color={T.textTertiary} weight="regular" />
          </div>
        </div>

        {/* Category chips */}
        <div
          style={{
            display: "flex",
            gap: 8,
            paddingTop: 14,
            paddingRight: 0,
            paddingBottom: 4,
            paddingLeft: m,
            overflowX: "auto",
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  flexShrink: 0,
                  height: 32,
                  paddingTop: 0, paddingRight: 14, paddingBottom: 0, paddingLeft: 14,
                  borderRadius: R.full,
                  backgroundColor: isActive ? T.cta : T.surfaceElevated,
                  border: `1px solid ${isActive ? T.cta : T.border}`,
                  color: isActive ? "#000000" : T.textSecondary,
                  fontSize: TYPE.footnote,
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: font,
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  transition: "background-color 0.18s, border-color 0.18s",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </button>
            );
          })}
          <div style={{ width: m, flexShrink: 0 }} />
        </div>

        {/* 2-column service grid — tiles go to /home/chat/:id */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: 12,
            paddingTop: 16,
            paddingRight: m,
            paddingBottom: 24,
            paddingLeft: m,
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                paddingTop: 40,
                color: T.textTertiary,
                fontSize: TYPE.subhead,
                fontFamily: font,
              }}
            >
              No services match "{query}"
            </div>
          ) : (
            filtered.map((svc) => {
              const Icon = ICON_MAP[svc.id] ?? Truck;
              return (
                <button
                  key={svc.id}
                  onClick={() => navigate(`/home/chat/${svc.id}`)}
                  style={{
                    background: "none",
                    border: `1px solid ${T.border}`,
                    borderRadius: R.lg,
                    backgroundColor: T.surfaceElevated,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16,
                    gap: 10,
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: R.md,
                      backgroundColor: tint(svc.color, 0.10),
                      border: `1px solid ${tint(svc.color, 0.18)}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} color={svc.color} weight="regular" />
                  </div>
                  <div>
                    <div
                      style={{
                        color: T.textPrimary,
                        fontSize: TYPE.subhead,
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        marginBottom: 2,
                        fontFamily: font,
                      }}
                    >
                      {svc.label}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>
                        avg {svc.avgPrice}
                      </span>
                      <span style={{ color: T.divider }}>·</span>
                      <span style={{ color: T.textTertiary, fontSize: TYPE.caption1, fontFamily: font }}>
                        {svc.avgEta}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
        </div>{/* end maxWidth wrapper */}
      </div>
    </div>
  );
}