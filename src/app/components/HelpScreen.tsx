// HelpScreen.tsx — Searchable FAQ / knowledge base (/home/help)

import { useState } from "react";
import { useNavigate } from "react-router";
import {
  CaretLeft, MagnifyingGlass, CaretDown, CaretUp,
  Question, ChatCircle, ShieldCheck, CreditCard, Clock,
  MapPin, Star, Headset,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ElementType;
  iconColor: string;
}

const FAQS: FAQ[] = [
  { id: "f1", category: "General", question: "What is Find My Genie?", answer: "Find My Genie is an AI-powered home services platform. Genie calls around to local vendors on your behalf, negotiates the best price, and books the service — all in under 2 minutes.", icon: Question, iconColor: T.cta },
  { id: "f2", category: "General", question: "How does Genie find vendors?", answer: "Genie uses AI to call multiple licensed, insured vendors in your area simultaneously. It compares prices, availability, and ratings to present you with the best options.", icon: Question, iconColor: T.cta },
  { id: "f3", category: "Booking", question: "Can I cancel a booking?", answer: "Yes, you can cancel any booking before the vendor arrives at no charge. Once the vendor is on-site, cancellation fees may apply depending on the service type.", icon: Clock, iconColor: "#2E93FA" },
  { id: "f4", category: "Booking", question: "How do I reschedule?", answer: "Go to Activity → tap the job → Rebook. You can pick a new date and time. If the original vendor is unavailable, Genie will find another one.", icon: Clock, iconColor: "#2E93FA" },
  { id: "f5", category: "Payment", question: "What payment methods are accepted?", answer: "We accept Visa, Mastercard, Amex, bank transfers, and Apple Pay. All payments are processed securely after service completion.", icon: CreditCard, iconColor: "#A78BFA" },
  { id: "f6", category: "Payment", question: "How do refunds work?", answer: "Refunds are processed within 3-5 business days to your original payment method. If you're not satisfied with the service, contact support within 48 hours.", icon: CreditCard, iconColor: "#A78BFA" },
  { id: "f7", category: "Safety", question: "Are vendors background-checked?", answer: "Yes. All vendors on our platform undergo thorough background checks, license verification, and insurance confirmation before being approved.", icon: ShieldCheck, iconColor: "#34C759" },
  { id: "f8", category: "Safety", question: "What if something goes wrong during service?", answer: "You're covered by our Service Guarantee. Contact support immediately through the app. We'll work with the vendor to resolve the issue or provide a full refund.", icon: ShieldCheck, iconColor: "#34C759" },
  { id: "f9", category: "Account", question: "How do I change my address?", answer: "Go to Profile → Saved Addresses. You can add, edit, or remove addresses. Set your default address for faster bookings.", icon: MapPin, iconColor: "#FFC043" },
  { id: "f10", category: "Account", question: "How do I leave a review?", answer: "After each completed service, you'll be prompted to rate and review your vendor. You can also go to Activity → tap a completed job to leave feedback.", icon: Star, iconColor: "#FFC043" },
];

export function HelpScreen() {
  const navigate = useNavigate();
  const m = HIG.screenMargin;
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()) ||
      faq.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(filtered.map((f) => f.category))];

  return (
    <div style={{ height: "100%", backgroundColor: T.bg, display: "flex", flexDirection: "column", fontFamily: font, overflow: "hidden" }}>
      {/* Nav bar */}
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center",
        paddingTop: 8, paddingRight: m, paddingBottom: 4, paddingLeft: 4,
        minHeight: 56, borderBottom: `0.5px solid ${T.border}`,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ minWidth: HIG.minTapTarget, minHeight: HIG.minTapTarget, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}
        >
          <CaretLeft size={22} color={T.textPrimary} weight="bold" />
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <span style={{ color: T.textPrimary, fontSize: TYPE.headline, fontWeight: 700, letterSpacing: "-0.022em", fontFamily: font }}>
            Help & FAQ
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget }} />
      </div>

      {/* Search bar */}
      <div style={{ paddingTop: 12, paddingRight: m, paddingBottom: 12, paddingLeft: m, flexShrink: 0 }}>
        <div style={{
          height: 44, backgroundColor: T.surfaceElevated,
          border: `1px solid ${T.border}`, borderRadius: R.sm,
          display: "flex", alignItems: "center", paddingLeft: 14, paddingRight: 14, gap: 10,
        }}>
          <MagnifyingGlass size={16} color={T.textTertiary} weight="regular" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help topics..."
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: T.textPrimary, fontSize: TYPE.subhead, fontFamily: font,
            }}
          />
        </div>
      </div>

      {/* Scrollable FAQ list */}
      <div style={{ flex: 1, overflowY: "auto", maxWidth: 680, margin: "0 auto", width: "100%" }}>
        {categories.map((category) => (
          <div key={category} style={{ paddingRight: m, paddingLeft: m, marginBottom: 16 }}>
            <span style={{
              color: T.textTertiary, fontSize: TYPE.caption1, fontWeight: 500,
              letterSpacing: "0.04em", textTransform: "uppercase" as const,
              fontFamily: font, display: "block", marginBottom: 10,
            }}>
              {category}
            </span>
            {filtered
              .filter((f) => f.category === category)
              .map((faq, idx) => {
                const isOpen = expanded === faq.id;
                const Icon = faq.icon;
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.2 }}
                  >
                    <button
                      onClick={() => setExpanded(isOpen ? null : faq.id)}
                      style={{
                        width: "100%", background: "none", border: "none",
                        cursor: "pointer", textAlign: "left", padding: 0,
                        fontFamily: font,
                      }}
                    >
                      <div style={{
                        backgroundColor: T.surfaceElevated,
                        borderRadius: isOpen ? `${R.md}px ${R.md}px 0 0` : R.md,
                        border: `1px solid ${isOpen ? T.cta : T.border}`,
                        borderBottom: isOpen ? "none" : `1px solid ${T.border}`,
                        padding: "12px 14px",
                        display: "flex", alignItems: "center", gap: 12,
                        transition: "border-color 0.18s",
                        marginBottom: isOpen ? 0 : 8,
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: R.xs,
                          backgroundColor: T.surfaceElevated,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <Icon size={14} color={faq.iconColor} weight="regular" />
                        </div>
                        <span style={{ flex: 1, color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 500, letterSpacing: "-0.01em" }}>
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <CaretUp size={14} color={T.textTertiary} weight="regular" />
                        ) : (
                          <CaretDown size={14} color={T.textTertiary} weight="regular" />
                        )}
                      </div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: "hidden", marginBottom: 8 }}
                        >
                          <div style={{
                            backgroundColor: T.surfaceElevated,
                            borderRadius: `0 0 ${R.md}px ${R.md}px`,
                            border: `1px solid ${T.cta}`,
                            borderTop: `0.5px solid ${T.border}`,
                            padding: "12px 14px 14px",
                          }}>
                            <p style={{ margin: 0, paddingLeft: 40, color: T.textSecondary, fontSize: TYPE.footnote, lineHeight: 1.6, fontFamily: font }}>
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
          </div>
        ))}

        {/* Contact support CTA */}
        <div style={{ paddingRight: m, paddingBottom: 32, paddingLeft: m }}>
          <div style={{ height: "0.5px", backgroundColor: T.border, marginBottom: 20 }} />
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <span style={{ color: T.textTertiary, fontSize: TYPE.subhead, fontFamily: font }}>
              Can't find what you're looking for?
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/home/support")}
            style={{
              width: "100%", height: 52,
              backgroundColor: T.cta, border: "none", borderRadius: R.md,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: font,
            }}
          >
            <Headset size={18} color="#000000" weight="regular" />
            <span style={{ color: "#000000", fontSize: TYPE.callout, fontWeight: 600 }}>
              Contact Support
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}