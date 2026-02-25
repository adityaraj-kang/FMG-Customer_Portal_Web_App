// ChatConversationScreen.tsx — Hybrid suggestion + custom chat (/home/chat/:serviceId)
// Chips live in a pinned tray above the text input.
// User can tap a chip OR type a custom reply — both advance the conversation identically.

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { CaretLeft, Sparkle, CheckCircle, ArrowUp } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";

// ─── Q&A catalogue ───────────────────────────────────────────
interface Question { label: string; text: string; options: string[] }

const QA: Record<string, { title: string; intro: string; questions: Question[] }> = {
  towing: {
    title: "Towing",
    intro: "Hi! I'll get you the best tow service nearby. Just two quick questions so I can find the perfect match.",
    questions: [
      { label: "Vehicle",   text: "What type of vehicle needs towing?",  options: ["Car", "SUV / Truck", "Motorcycle", "Van"] },
      { label: "Situation", text: "What happened to the vehicle?",        options: ["Flat tire", "Dead battery", "Locked out", "Vehicle breakdown"] },
    ],
  },
  plumber: {
    title: "Plumber",
    intro: "Hi! I'll find you a great plumber right away. Two quick questions to get the right pro.",
    questions: [
      { label: "Issue",   text: "What's the plumbing issue?",   options: ["Leaky faucet", "Burst pipe", "Clogged drain", "Water heater"] },
      { label: "Urgency", text: "How urgent is this for you?",  options: ["Emergency — now!", "Within a few hours", "Anytime today", "This week"] },
    ],
  },
  hvac: {
    title: "HVAC",
    intro: "Hi! I'll get your HVAC sorted fast. Quick questions to find the right certified tech.",
    questions: [
      { label: "Problem", text: "Is it a heating or cooling issue?",       options: ["AC not cooling", "Heat not working", "Both systems", "Strange noises"] },
      { label: "System",  text: "What type of HVAC system do you have?",   options: ["Central AC / heat", "Window unit", "Heat pump", "Not sure"] },
    ],
  },
  electrician: {
    title: "Electrician",
    intro: "Hi! I'll connect you with a licensed electrician fast. Two quick questions first.",
    questions: [
      { label: "Issue",   text: "What's the electrical issue?",  options: ["Power outage", "Tripped breaker", "Flickering lights", "New installation"] },
      { label: "Urgency", text: "How urgent is this?",           options: ["Emergency — now!", "Today works", "Within the week"] },
    ],
  },
  lawn: {
    title: "Lawn Care",
    intro: "Hi! I'll find a reliable lawn crew near you. Two quick questions for the right match.",
    questions: [
      { label: "Yard size", text: "Roughly how large is your yard?",   options: ["Small (under ¼ acre)", "Medium (¼–½ acre)", "Large (over ½ acre)"] },
      { label: "Services",  text: "What services do you need?",         options: ["Just mowing", "Mow + edge", "Full cleanup", "Leaf removal"] },
    ],
  },
  handyman: {
    title: "Handyman",
    intro: "Hi! I'll find you a skilled handyman nearby. Quick questions to find the right fit.",
    questions: [
      { label: "Task",     text: "What needs to be fixed or done?",      options: ["Drywall / holes", "Painting", "Furniture assembly", "General repairs"] },
      { label: "Duration", text: "How long do you think it'll take?",    options: ["1–2 hours", "Half a day", "Full day"] },
    ],
  },
  roofing: {
    title: "Roofing",
    intro: "Hi! I'll get a roofing pro to you quickly. Two quick questions first.",
    questions: [
      { label: "Issue",   text: "What's the roofing problem?",  options: ["Active leak", "Missing shingles", "Storm damage", "Inspection only"] },
      { label: "Urgency", text: "How urgent is this?",          options: ["Emergency — now!", "Within 24 hours", "Within the week"] },
    ],
  },
  pest: {
    title: "Pest Control",
    intro: "Hi! I'll find a licensed exterminator near you right away. Two quick questions!",
    questions: [
      { label: "Pest type", text: "What type of pest are you dealing with?", options: ["Ants", "Roaches", "Rodents", "Termites", "Other"] },
      { label: "Severity",  text: "How severe is the infestation?",           options: ["Just noticed a few", "Moderate — seeing many", "Severe infestation"] },
    ],
  },
};

const DEFAULT_QA = {
  title: "Genie",
  intro: "Hi! I'll help you find the right service provider. Two quick questions to find the best match.",
  questions: [
    { label: "Service",  text: "What type of service do you need?",  options: ["Repair", "Installation", "Inspection", "Cleaning"] },
    { label: "Urgency",  text: "How urgent is this?",                 options: ["Emergency — now!", "Today", "This week"] },
  ],
};

// ─── Log entry types (chips no longer live in the log) ────────
type LogEntry =
  | { kind: "genie";   text: string;                                  id: string }
  | { kind: "user";    text: string;                                  id: string }
  | { kind: "summary"; questions: Question[]; answers: string[];      id: string };

interface ActiveChips { options: string[]; questionIdx: number }

const IOS = [0.32, 0.72, 0, 1] as const;

// ─── Genie bubble ─────────────────────────────────────────────
function GenieBubble({ text }: { text: string }) {
  const m = HIG.screenMargin;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: IOS }}
      style={{ display: "flex", alignItems: "flex-end", gap: 8, paddingRight: "20%", paddingLeft: m, marginBottom: 10 }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        backgroundColor: T.surfaceElevated, border: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Sparkle size={13} color={T.cta} weight="fill" />
      </div>
      <div style={{
        backgroundColor: T.surfaceElevated, border: `1px solid ${T.border}`,
        borderRadius: "20px 20px 20px 4px",
        paddingTop: 10, paddingRight: 14, paddingBottom: 10, paddingLeft: 14,
      }}>
        <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontFamily: font, lineHeight: 1.5, letterSpacing: "-0.01em" }}>
          {text}
        </span>
      </div>
    </motion.div>
  );
}

// ─── User bubble ──────────────────────────────────────────────
function UserBubble({ text }: { text: string }) {
  const m = HIG.screenMargin;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: IOS }}
      style={{ display: "flex", justifyContent: "flex-end", paddingLeft: "20%", paddingRight: m, marginBottom: 10 }}
    >
      <div style={{
        backgroundColor: T.cta,
        borderRadius: "20px 20px 4px 20px",
        paddingTop: 10, paddingRight: 14, paddingBottom: 10, paddingLeft: 14,
      }}>
        <span style={{ color: "#FFFFFF", fontSize: TYPE.subhead, fontFamily: font, lineHeight: 1.45, letterSpacing: "-0.01em" }}>
          {text}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Genie typing indicator ───────────────────────────────────
function TypingIndicator() {
  const m = HIG.screenMargin;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.22, ease: IOS }}
      style={{ display: "flex", alignItems: "flex-end", gap: 8, paddingRight: "20%", paddingLeft: m, marginBottom: 10 }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        backgroundColor: T.surfaceElevated, border: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Sparkle size={13} color={T.cta} weight="fill" />
      </div>
      <div style={{
        backgroundColor: T.surfaceElevated, border: `1px solid ${T.border}`,
        borderRadius: "20px 20px 20px 4px",
        paddingTop: 12, paddingRight: 16, paddingBottom: 12, paddingLeft: 16,
        display: "flex", alignItems: "center", gap: 5,
      }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: T.textTertiary }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.22, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Summary card ─────────────────────────────────────────────
function SummaryCard({
  questions, answers, serviceTitle, onConfirm,
}: {
  questions: Question[];
  answers: string[];
  serviceTitle: string;
  onConfirm: () => void;
}) {
  const m = HIG.screenMargin;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: IOS }}
      style={{ paddingLeft: m, paddingRight: m, marginTop: 4, marginBottom: 12 }}
    >
      <div style={{
        backgroundColor: T.surfaceElevated, border: `1px solid ${T.border}`,
        borderRadius: R.lg,
        paddingTop: 16, paddingRight: 16, paddingBottom: 4, paddingLeft: 16,
        marginBottom: 14,
      }}>
        <span style={{ display: "block", marginBottom: 14, color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 700, letterSpacing: "-0.02em", fontFamily: font }}>
          Summary
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <CheckCircle size={16} color={T.cta} weight="fill" style={{ flexShrink: 0 }} />
          <div style={{ display: "flex", justifyContent: "space-between", flex: 1 }}>
            <span style={{ color: T.textTertiary, fontSize: TYPE.footnote, fontFamily: font }}>Service</span>
            <span style={{ color: T.textPrimary, fontSize: TYPE.footnote, fontWeight: 600, fontFamily: font }}>{serviceTitle}</span>
          </div>
        </div>
        {questions.map((q, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <CheckCircle size={16} color={T.cta} weight="fill" style={{ flexShrink: 0 }} />
            <div style={{ display: "flex", justifyContent: "space-between", flex: 1 }}>
              <span style={{ color: T.textTertiary, fontSize: TYPE.footnote, fontFamily: font }}>{q.label}</span>
              <span style={{ color: T.textPrimary, fontSize: TYPE.footnote, fontWeight: 600, fontFamily: font }}>{answers[i] ?? "—"}</span>
            </div>
          </div>
        ))}
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onConfirm}
        style={{
          width: "100%", height: 52,
          backgroundColor: T.cta, border: "none", borderRadius: R.md,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        <span style={{ color: "#000000", fontSize: TYPE.callout, fontWeight: 600, letterSpacing: "-0.01em", fontFamily: font }}>
          Confirm &amp; Find Vendors
        </span>
      </motion.button>
    </motion.div>
  );
}

// ─── Main screen ──────────────────────────────────────────────
export function ChatConversationScreen() {
  const { serviceId }  = useParams<{ serviceId: string }>();
  const navigate       = useNavigate();
  const location       = useLocation();
  const scrollRef      = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const m              = HIG.screenMargin;

  const locationState = (location.state as { query?: string } | null);
  const qa = (serviceId && QA[serviceId]) ? QA[serviceId] : {
    ...DEFAULT_QA,
    title: serviceId ? serviceId.charAt(0).toUpperCase() + serviceId.slice(1) : "Genie",
    intro: locationState?.query
      ? `I'll help with: "${locationState.query}". Let me ask a couple of quick questions.`
      : DEFAULT_QA.intro,
  };

  const [log,          setLog]          = useState<LogEntry[]>([]);
  const [answers,      setAnswers]      = useState<string[]>([]);
  const [activeChips,  setActiveChips]  = useState<ActiveChips | null>(null);
  const [inputText,    setInputText]    = useState("");
  const [genieTyping,  setGenieTyping]  = useState(false);

  // ── Derived state ──────────────────────────────────────────
  const summaryShown = log.some((e) => e.kind === "summary");
  const inputDisabled = genieTyping || summaryShown;
  const canSend = inputText.trim().length > 0 && !!activeChips && !genieTyping && !summaryShown;

  const placeholder = genieTyping
    ? "Genie is thinking…"
    : summaryShown
    ? "All done — confirm above ↑"
    : activeChips
    ? "Or describe it yourself…"
    : "Waiting for Genie…";

  // ── Initial sequence ───────────────────────────────────────
  useEffect(() => {
    setLog([]);
    setAnswers([]);
    setActiveChips(null);
    setInputText("");
    setGenieTyping(false);

    const t1 = setTimeout(() => {
      setLog([{ kind: "genie", text: qa.intro, id: "g-intro" }]);
    }, 400);
    const t2 = setTimeout(() => {
      setLog((prev) => [...prev, { kind: "genie", text: qa.questions[0].text, id: "g-q0" }]);
    }, 1400);
    const t3 = setTimeout(() => {
      setActiveChips({ options: qa.questions[0].options, questionIdx: 0 });
    }, 1750);

    return () => [t1, t2, t3].forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  // ── Auto-scroll ────────────────────────────────────────────
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [log, genieTyping]);

  // ── Handle any answer (chip tap or typed text) ─────────────
  function handleAnswer(option: string, questionIdx: number) {
    setActiveChips(null);
    setInputText("");

    setLog((prev) => [...prev, { kind: "user", text: option, id: `u-${questionIdx}` }]);
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    setGenieTyping(true);

    setTimeout(() => {
      setGenieTyping(false);
      const nextIdx = questionIdx + 1;

      if (nextIdx < qa.questions.length) {
        setLog((prev) => [...prev, { kind: "genie", text: qa.questions[nextIdx].text, id: `g-q${nextIdx}` }]);
        setTimeout(() => {
          setActiveChips({ options: qa.questions[nextIdx].options, questionIdx: nextIdx });
        }, 320);
      } else {
        setLog((prev) => [
          ...prev,
          {
            kind: "genie",
            text: "Got it! Here's a summary of what I understood. Confirm and I'll start finding the best vendors near you.",
            id: "g-confirm",
          },
          { kind: "summary", questions: qa.questions, answers: newAnswers, id: "summary" },
        ]);
      }
    }, 950);
  }

  // ── Send typed message ─────────────────────────────────────
  function handleSend() {
    const text = inputText.trim();
    if (!text || !activeChips || genieTyping || summaryShown) return;
    handleAnswer(text, activeChips.questionIdx);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <div style={{ height: "100%", backgroundColor: T.bg, display: "flex", flexDirection: "column", fontFamily: font }}>

      {/* hide horizontal scrollbar on chip tray */}
      <style>{`.chip-tray::-webkit-scrollbar { display: none; }`}</style>

      {/* ── Header ── */}
      <div style={{
        flexShrink: 0,
        display: "flex", alignItems: "center",
        paddingLeft: 4, paddingRight: m,
        paddingTop: 8, paddingBottom: 8,
        minHeight: 56,
        borderBottom: `0.5px solid ${T.border}`,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            minWidth: HIG.minTapTarget, minHeight: HIG.minTapTarget,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", flexShrink: 0,
          }}
        >
          <CaretLeft size={22} color={T.textPrimary} weight="bold" />
        </button>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ color: T.textPrimary, fontSize: TYPE.headline, fontWeight: 700, letterSpacing: "-0.022em", fontFamily: font }}>
            {qa.title}
          </span>
          <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font, letterSpacing: "-0.005em" }}>
            Powered by Genie AI
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget, flexShrink: 0 }} />
      </div>

      {/* ── Message stream ── */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: "auto", paddingTop: 20, paddingBottom: 8, maxWidth: 720, margin: "0 auto", width: "100%" }}
      >
        <AnimatePresence initial={false}>
          {log.map((entry) => {
            if (entry.kind === "genie") return <GenieBubble key={entry.id} text={entry.text} />;
            if (entry.kind === "user")  return <UserBubble  key={entry.id} text={entry.text} />;
            if (entry.kind === "summary") {
              return (
                <SummaryCard
                  key={entry.id}
                  questions={entry.questions}
                  answers={entry.answers}
                  serviceTitle={qa.title}
                  onConfirm={() =>
                    navigate("/home/address", {
                      state: {
                        serviceId,
                        serviceName: qa.title,
                        answers: entry.answers,
                        questionLabels: entry.questions.map((q) => q.label),
                      },
                    })
                  }
                />
              );
            }
            return null;
          })}
        </AnimatePresence>

        {/* Genie typing indicator */}
        <AnimatePresence>
          {genieTyping && <TypingIndicator key="typing" />}
        </AnimatePresence>

        <div style={{ height: 8 }} />
      </div>

      {/* ══════════════════════════════════════════════════════
          ── Hybrid input area (pinned to bottom) ──
          ══════════════════════════════════════════════════════ */}
      <div style={{
        flexShrink: 0,
        backgroundColor: T.bg,
        borderTop: `0.5px solid ${T.border}`,
      }}>

        {/* ── Suggestion chip tray (slides in when there are active chips) ── */}
        <AnimatePresence>
          {activeChips && !summaryShown && (
            <motion.div
              key="chip-tray"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: IOS }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ paddingTop: 10, paddingBottom: 0 }}>
                {/* Label */}
                <span style={{
                  display: "block",
                  paddingLeft: m,
                  marginBottom: 8,
                  color: T.textTertiary,
                  fontSize: TYPE.caption1,
                  fontFamily: font,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase" as const,
                }}>
                  Quick replies
                </span>

                {/* Horizontally scrollable chips */}
                <div
                  className="chip-tray"
                  style={{
                    overflowX: "auto",
                    paddingLeft: m,
                    paddingRight: m,
                    paddingBottom: 10,
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <div style={{ display: "flex", gap: 8, width: "max-content" }}>
                    {activeChips.options.map((opt) => (
                      <motion.button
                        key={opt}
                        whileTap={{ scale: 0.91 }}
                        onClick={() => handleAnswer(opt, activeChips.questionIdx)}
                        style={{
                          height: 34,
                          paddingLeft: 14, paddingRight: 14,
                          borderRadius: R.full,
                          backgroundColor: T.surfaceElevated,
                          border: `1px solid ${T.border}`,
                          color: T.textPrimary,
                          fontSize: TYPE.footnote,
                          fontFamily: font,
                          letterSpacing: "-0.01em",
                          cursor: "pointer",
                          whiteSpace: "nowrap" as const,
                          flexShrink: 0,
                        }}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Separator */}
                <div style={{ height: "0.5px", backgroundColor: T.border }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Text input row ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          paddingLeft: m, paddingRight: m,
          paddingTop: 10, paddingBottom: 14,
        }}>
          {/* Input pill */}
          <div style={{
            flex: 1,
            display: "flex", alignItems: "center",
            backgroundColor: T.surfaceElevated,
            border: `1px solid ${inputText.length > 0 ? T.cta : T.border}`,
            borderRadius: R.full,
            paddingLeft: 16, paddingRight: 6,
            minHeight: 44,
            transition: "border-color 0.18s",
          }}>
            <input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={inputDisabled}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                color: inputDisabled ? T.textTertiary : T.textPrimary,
                fontSize: TYPE.subhead,
                fontFamily: font,
                letterSpacing: "-0.01em",
                cursor: inputDisabled ? "default" : "text",
                minWidth: 0,
              }}
            />
          </div>

          {/* Send button */}
          <motion.button
            whileTap={canSend ? { scale: 0.88 } : {}}
            onClick={handleSend}
            style={{
              width: 44, height: 44,
              borderRadius: "50%",
              backgroundColor: canSend ? T.cta : T.surfaceElevated,
              border: `1.5px solid ${canSend ? T.cta : T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: canSend ? "pointer" : "default",
              flexShrink: 0,
              transition: "background-color 0.18s, border-color 0.18s",
            }}
          >
            <ArrowUp size={18} color={canSend ? "#000000" : T.textTertiary} weight="bold" />
          </motion.button>
        </div>
      </div>

    </div>
  );
}