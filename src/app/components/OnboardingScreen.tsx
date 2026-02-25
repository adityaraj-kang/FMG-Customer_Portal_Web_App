// OnboardingScreen.tsx — Premium full-bleed photo onboarding
// Layout: cinematic photo + dark gradient overlay → editorial left-aligned copy at bottom

import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { T, font, R, HIG, TYPE } from "../tokens";
import { SharedStatusBar } from "./SharedStatusBar";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const IOS = [0.32, 0.72, 0, 1] as const;

interface Slide {
  image: string;
  tag: string;
  title: string;
  highlightWord: string;
  subtitle: string;
}

const SLIDES: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1758598303702-acbab724cd9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    tag: "Conversational AI",
    title: "Just tell us what you need",
    highlightWord: "tell",
    subtitle: "Describe your problem in plain language — no forms, no menus. Genie figures out the rest.",
  },
  {
    image: "https://images.unsplash.com/photo-1599463698367-11cb72775b67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    tag: "Instant Matching",
    title: "We call every vendor for you",
    highlightWord: "call",
    subtitle: "Genie contacts multiple local pros at once and returns the best options in under 2 minutes.",
  },
  {
    image: "https://images.unsplash.com/photo-1643930824898-0013354905c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    tag: "100% Vetted",
    title: "Only verified professionals",
    highlightWord: "verified",
    subtitle: "Background-checked, licensed, and insured — with live GPS tracking once they're en route.",
  },
  {
    image: "https://images.unsplash.com/photo-1696861270495-7f35c35c3273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    tag: "No upfront cost",
    title: "Pay only after the job is done",
    highlightWord: "only",
    subtitle: "Compare quotes, choose the best offer, and pay when you're satisfied — guaranteed.",
  },
];

// Render title with one highlighted word in orange
function HighlightedTitle({ title, highlightWord }: { title: string; highlightWord: string }) {
  const words = title.split(" ");
  return (
    <h2
      style={{
        margin: 0,
        color: T.textPrimary,
        fontSize: 34,
        fontWeight: 800,
        letterSpacing: "-0.03em",
        lineHeight: 1.1,
        fontFamily: font,
      }}
    >
      {words.map((word, i) => {
        const isHighlight = word.toLowerCase().replace(/[^a-z]/g, "") === highlightWord;
        return (
          <span key={i}>
            {i > 0 && " "}
            {isHighlight ? (
              <span style={{ color: T.cta }}>{word}</span>
            ) : (
              word
            )}
          </span>
        );
      })}
    </h2>
  );
}

export function OnboardingScreen() {
  const navigate  = useNavigate();
  const [current, setCurrent] = useState(0);
  const [dir, setDir]         = useState(1);
  const touchStartX = useRef<number | null>(null);
  const m = HIG.screenMargin;
  const isLast = current === SLIDES.length - 1;

  function next() {
    if (!isLast) {
      setDir(1);
      setCurrent((c) => c + 1);
    } else {
      navigate("/login");
    }
  }

  function prev() {
    if (current > 0) {
      setDir(-1);
      setCurrent((c) => c - 1);
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 44) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
  }

  const slide = SLIDES[current];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: T.bg,
        fontFamily: font,
        overflow: "hidden",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Full-bleed photo with gradient overlay ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.55, ease: IOS } }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        >
          <ImageWithFallback
            src={slide.image}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
          {/* Dark gradient — transparent at top, full dark at 65% */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(
                to bottom,
                rgba(0,0,0,0.08) 0%,
                rgba(0,0,0,0.18) 30%,
                rgba(15,15,15,0.72) 55%,
                ${T.bg} 72%,
                ${T.bg} 100%
              )`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Status bar ── */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <SharedStatusBar />
      </div>

      {/* ── Skip ── */}
      <div
        style={{
          position: "absolute",
          top: 54,
          right: m,
          zIndex: 10,
        }}
      >
        {!isLast && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate("/login")}
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "none",
              borderRadius: R.full,
              cursor: "pointer",
              color: "rgba(255,255,255,0.82)",
              fontSize: TYPE.footnote,
              fontWeight: 500,
              fontFamily: font,
              padding: "6px 14px",
              backdropFilter: "blur(8px)",
            }}
          >
            Skip
          </motion.button>
        )}
      </div>

      {/* ── Step counter — top-left ── */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: m,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            color: T.cta,
            fontSize: TYPE.footnote,
            fontWeight: 700,
            fontFamily: font,
            letterSpacing: "0.04em",
          }}
        >
          {String(current + 1).padStart(2, "0")}
        </span>
        <span style={{ color: "rgba(255,255,255,0.22)", fontSize: TYPE.footnote, fontFamily: font }}>
          / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Bottom content ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          padding: `0 ${m}px`,
          paddingBottom: 0,
        }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            initial={{ opacity: 0, y: dir * 18 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.38, ease: IOS } }}
            exit={{ opacity: 0, y: -dir * 12, transition: { duration: 0.22, ease: "easeIn" } }}
            style={{ display: "flex", flexDirection: "column", gap: 0 }}
          >
            {/* Tag pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                alignSelf: "flex-start",
                backgroundColor: "rgba(255,77,0,0.15)",
                border: "1px solid rgba(255,77,0,0.35)",
                borderRadius: R.full,
                padding: "4px 12px",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  color: T.cta,
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: font,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {slide.tag}
              </span>
            </div>

            {/* Headline */}
            <HighlightedTitle title={slide.title} highlightWord={slide.highlightWord} />

            {/* Subtitle */}
            <p
              style={{
                margin: "14px 0 0",
                color: T.textSecondary,
                fontSize: TYPE.subhead,
                lineHeight: 1.55,
                letterSpacing: "-0.01em",
                maxWidth: 320,
              }}
            >
              {slide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* ── Progress lines ── */}
        <div style={{ display: "flex", gap: 5, marginTop: 32, marginBottom: 20 }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: R.full,
                overflow: "hidden",
                backgroundColor: "rgba(255,255,255,0.12)",
              }}
            >
              <motion.div
                animate={{ scaleX: i < current ? 1 : i === current ? 1 : 0 }}
                initial={{ scaleX: 0 }}
                transition={{ duration: 0.35, ease: IOS }}
                style={{
                  height: "100%",
                  backgroundColor: i <= current ? T.cta : "transparent",
                  transformOrigin: "left",
                  borderRadius: R.full,
                  width: "100%",
                }}
              />
            </div>
          ))}
        </div>

        {/* ── CTA Button ── */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 600, damping: 35 }}
          onClick={next}
          style={{
            width: "100%",
            height: 54,
            backgroundColor: T.cta,
            border: "none",
            borderRadius: R.md,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              color: "#000000",
              fontSize: TYPE.callout,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              fontFamily: font,
            }}
          >
            {isLast ? "Get Started" : "Continue"}
          </span>
          <ArrowRight size={18} color="#000000" weight="bold" />
        </motion.button>

        {/* Home indicator */}
        <div
          style={{
            height: HIG.safeAreaBottom,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 6,
            marginTop: 12,
          }}
        >
          <div
            style={{
              width: 134,
              height: 5,
              borderRadius: R.full,
              backgroundColor: T.homeIndicator,
            }}
          />
        </div>
      </div>
    </div>
  );
}