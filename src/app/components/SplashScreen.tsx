import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { T, font, HIG, TYPE } from "../tokens";
import { SharedStatusBar } from "./SharedStatusBar";
import { GenieLogo } from "./GenieLogo";

const SPLASH_DURATION = 2800;

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/onboarding"), SPLASH_DURATION);
    return () => clearTimeout(t);
  }, [navigate]);

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
      <SharedStatusBar />

      {/* Centred content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {/* ── Stage 1: Logo bounces in ── */}
        <motion.div
          initial={{ scale: 0.35, opacity: 0, rotate: -24 }}
          animate={{ scale: [0.35, 1.18, 1], opacity: [0, 1, 1], rotate: [-24, 8, 0] }}
          transition={{ duration: 0.58, times: [0, 0.72, 1], ease: [0.175, 0.885, 0.32, 1.275] }}
        >
          <GenieLogo size={96} color="#ffffff" />
        </motion.div>

        {/* ── Stage 2: Wordmark slides up ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
          style={{ textAlign: "center" }}
        >
          <div
            style={{
              fontSize: TYPE.title1,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            <span style={{ color: T.textPrimary }}>Find My </span>
            <span style={{ color: T.cta }}>Genie</span>
          </div>
        </motion.div>

        {/* ── Stage 3: Tagline fades in ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.62, duration: 0.42, ease: "easeOut" }}
          style={{
            margin: 0,
            color: T.textTertiary,
            fontSize: TYPE.footnote,
            letterSpacing: "0.01em",
            fontFamily: font,
          }}
        >
          Let AI call-around for you.
        </motion.p>
      </div>

      {/* Home indicator */}
      <div
        style={{
          height: HIG.safeAreaBottom,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: 134, height: 5, borderRadius: 9999, backgroundColor: T.homeIndicator }} />
      </div>
    </div>
  );
}