// HomeLayout.tsx — Responsive shell for all /home/* routes.
// Mobile (< 768px): bottom tab bar
// Desktop (≥ 768px): collapsible left sidebar

import { useLocation, useOutlet, useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  House,
  SquaresFour,
  ClockCounterClockwise,
} from "@phosphor-icons/react";
import { T, font, HIG, TYPE } from "../tokens";
import { InitialsAvatar } from "./InitialsAvatar";
import { useIsMobile } from "./ui/use-mobile";
import { SidebarProvider, SidebarInset } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";

// ─── Tab configuration ────────────────────────────────────────
const NAV_ITEMS = [
  {
    id:    "home",
    label: "Home",
    path:  "/home",
    icon:  House,
    match: (p: string) => p === "/home",
  },
  {
    id:    "services",
    label: "Services",
    path:  "/home/services",
    icon:  SquaresFour,
    match: (p: string) => p.startsWith("/home/services"),
  },
  {
    id:    "activity",
    label: "Activity",
    path:  "/home/activity",
    icon:  ClockCounterClockwise,
    match: (p: string) => p === "/home/activity",
  },
  {
    id:    "profile",
    label: "Profile",
    path:  "/home/profile",
    icon:  House, // unused for profile — InitialsAvatar renders instead
    match: (p: string) => p === "/home/profile",
  },
] as const;

// ─── Transition: cross-fade for tab switches, slide-in for deep routes ───────
function getTransition(pathname: string) {
  const depth = pathname.split("/").filter(Boolean).length;
  if (depth > 2) {
    return {
      initial: { opacity: 0, x: 32 },
      animate: { opacity: 1, x: 0, transition: { duration: 0.32, ease: [0.32, 0.72, 0, 1] as const } },
      exit:    { opacity: 0, x: -16, transition: { duration: 0.22, ease: "easeIn" as const } },
    };
  }
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.22 } },
    exit:    { opacity: 0, transition: { duration: 0.16 } },
  };
}

export function HomeLayout() {
  const location = useLocation();
  const outlet   = useOutlet();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const t = getTransition(location.pathname);

  // ── Desktop: sidebar layout ──────────────────────────────────
  if (!isMobile) {
    return (
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset
          style={{
            backgroundColor: T.bg,
            fontFamily: font,
            minHeight: "100svh",
            flex: 1,
          }}
        >
          <div style={{ flex: 1, position: "relative", overflow: "hidden", height: "100svh" }}>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={location.pathname}
                style={{ position: "absolute", inset: 0 }}
                initial={t.initial}
                animate={t.animate}
                exit={t.exit}
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // ── Mobile: bottom tab bar layout ────────────────────────────
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: T.bg,
        display: "flex",
        flexDirection: "column",
        fontFamily: font,
      }}
    >
      {/* ── Animated content area ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={location.pathname}
            style={{ position: "absolute", inset: 0 }}
            initial={t.initial}
            animate={t.animate}
            exit={t.exit}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Tab bar ── */}
      <div style={{ backgroundColor: T.bg, flexShrink: 0 }}>
        <div style={{ height: "0.5px", backgroundColor: T.border }} />
        <div
          style={{
            height: HIG.tabBarHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            paddingTop: 4,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon     = item.icon;
            const isActive = item.match(location.pathname);
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.85 }}
                onClick={() => navigate(item.path)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  minWidth: HIG.minTapTarget,
                  minHeight: HIG.minTapTarget,
                  justifyContent: "center",
                  padding: 0,
                  fontFamily: font,
                  position: "relative",
                }}
              >
                {/* Icon — profile always shows InitialsAvatar */}
                {item.id === "profile" ? (
                  <InitialsAvatar
                    name="Dinesh Kumar"
                    size={22}
                    style={{
                      opacity: isActive ? 1 : 0.45,
                      border: isActive ? `1.5px solid ${T.cta}` : undefined,
                      transition: "opacity 0.15s",
                    }}
                  />
                ) : (
                  <Icon
                    size={20}
                    color={isActive ? T.cta : T.navInactive}
                    weight={isActive ? "fill" : "regular"}
                  />
                )}

                {/* Label */}
                <span
                  style={{
                    color: isActive ? T.cta : T.navInactive,
                    fontSize: TYPE.caption2,
                    fontWeight: isActive ? 600 : 400,
                    transition: "color 0.15s",
                    letterSpacing: "0.005em",
                  }}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
