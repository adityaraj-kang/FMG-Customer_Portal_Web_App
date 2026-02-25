// Root.tsx — Full-viewport root with top-level screen transitions

import { useLocation, useOutlet } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ThemeProvider, useTheme } from "../ThemeContext";
import { T } from "../tokens";

// iOS UIKit default easing — identical to what App.tsx used before
const IOS = [0.32, 0.72, 0, 1] as const;

const variants = {
  // Splash — already visible, just fade out
  "": {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit:    { opacity: 0, transition: { duration: 0.35, ease: "easeInOut" } },
  },
  // Login — rise up from below
  login: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0,  transition: { duration: 0.38, ease: IOS } },
    exit:    { opacity: 0, y: -16, transition: { duration: 0.28, ease: "easeIn" } },
  },
  // Onboarding — cross-fade
  onboarding: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.35, ease: IOS } },
    exit:    { opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
  },
  // Home — slide in from the right
  home: {
    initial: { opacity: 0, x: 28 },
    animate: { opacity: 1, x: 0,  transition: { duration: 0.38, ease: IOS } },
    exit:    { opacity: 0,         transition: { duration: 0.22, ease: "easeIn" } },
  },
} as const;

function RootInner() {
  const location = useLocation();
  const outlet   = useOutlet();
  const { isDark } = useTheme();

  // First path segment: "" (splash), "login", "onboarding", or "home"
  const segment = (location.pathname.split("/")[1] ?? "") as keyof typeof variants;
  const v = variants[segment] ?? variants.home;

  return (
    <>
      {/* Respect prefers-reduced-motion globally */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>

      {/* ── Full-viewport root ──────────────────────────────────── */}
      <div
        className={isDark ? "theme-dark" : "theme-light"}
        style={{
          minHeight: "100svh",
          backgroundColor: T.bg,
          position: "relative",
          transition: "background-color 0.4s ease",
        }}
      >
        {/* ── Screen transitions — keyed on first path segment ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={segment}
            style={{ position: "absolute", inset: 0 }}
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export function Root() {
  return (
    <ThemeProvider>
      <RootInner />
    </ThemeProvider>
  );
}