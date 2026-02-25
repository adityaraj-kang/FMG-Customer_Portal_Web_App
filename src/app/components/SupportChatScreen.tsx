// SupportChatScreen.tsx — Live support thread (/home/support)
// Distinct from Genie service chat — this is human support.

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { CaretLeft, PaperPlaneTilt, Headset } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { T, font, R, HIG, TYPE } from "../tokens";

interface Message {
  id: string;
  from: "user" | "support";
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: "m1", from: "support", text: "Hi Dinesh! I'm Maya from the Genie support team. How can I help you today?", time: "2:14 PM" },
];

const AUTO_REPLIES: string[] = [
  "Thanks for reaching out! Let me look into that for you.",
  "I can definitely help with that. Give me just a moment to check our records.",
  "Great question! Here's what I found...",
  "I've made a note of that. Is there anything else I can help with?",
];

export function SupportChatScreen() {
  const navigate = useNavigate();
  const m = HIG.screenMargin;
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const replyIdx = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const userMsg: Message = {
      id: `u${Date.now()}`,
      from: "user",
      text: input.trim(),
      time,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Auto reply
    setTimeout(() => {
      const reply: Message = {
        id: `s${Date.now()}`,
        from: "support",
        text: AUTO_REPLIES[replyIdx.current % AUTO_REPLIES.length],
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      };
      replyIdx.current++;
      setMessages((prev) => [...prev, reply]);
    }, 1200);
  }

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
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ color: T.textPrimary, fontSize: TYPE.headline, fontWeight: 700, letterSpacing: "-0.022em", fontFamily: font }}>
            Support
          </span>
          <span style={{ color: "#34C759", fontSize: TYPE.caption2, fontWeight: 500, fontFamily: font }}>
            Online
          </span>
        </div>
        <div style={{ width: HIG.minTapTarget, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Headset size={20} color={T.textTertiary} weight="regular" />
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: `16px ${m}px 8px` }}>
        {messages.map((msg, idx) => {
          const isUser = msg.from === "user";
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}
            >
              <div style={{ maxWidth: "80%" }}>
                {!isUser && idx === 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: R.full,
                      backgroundColor: T.cta,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Headset size={11} color="#000000" weight="fill" />
                    </div>
                    <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontWeight: 500, fontFamily: font }}>
                      Maya · Support
                    </span>
                  </div>
                )}
                <div style={{
                  padding: "10px 14px",
                  borderRadius: isUser
                    ? `${R.lg}px ${R.lg}px ${R.xs}px ${R.lg}px`
                    : `${R.lg}px ${R.lg}px ${R.lg}px ${R.xs}px`,
                  backgroundColor: isUser ? T.cta : T.surfaceElevated,
                  border: isUser ? "none" : `1px solid ${T.border}`,
                }}>
                  <span style={{
                    color: isUser ? "#FFFFFF" : T.textPrimary,
                    fontSize: TYPE.subhead,
                    fontFamily: font,
                    lineHeight: 1.45,
                  }}>
                    {msg.text}
                  </span>
                </div>
                <div style={{
                  marginTop: 4,
                  textAlign: isUser ? "right" : "left",
                  paddingLeft: isUser ? 0 : 4,
                  paddingRight: isUser ? 4 : 0,
                }}>
                  <span style={{ color: T.textTertiary, fontSize: TYPE.caption2, fontFamily: font }}>
                    {msg.time}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick topics */}
      {messages.length <= 2 && (
        <div style={{
          paddingTop: 0, paddingRight: m, paddingBottom: 8, paddingLeft: m,
          display: "flex", gap: 6, overflowX: "auto", flexShrink: 0,
        }}>
          {["Billing issue", "Cancel booking", "Report a problem", "Account help"].map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setInput(topic);
              }}
              style={{
                flexShrink: 0, height: 32,
                paddingLeft: 12, paddingRight: 12,
                backgroundColor: T.surfaceElevated,
                border: `1px solid ${T.border}`,
                borderRadius: R.full,
                cursor: "pointer", fontFamily: font,
              }}
            >
              <span style={{ color: T.textSecondary, fontSize: TYPE.caption1, fontWeight: 500 }}>
                {topic}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{
        flexShrink: 0,
        paddingTop: 8, paddingRight: m, paddingBottom: 12, paddingLeft: m,
        borderTop: `0.5px solid ${T.border}`,
        backgroundColor: T.bg,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          height: 44,
          backgroundColor: T.surfaceElevated,
          border: `1px solid ${T.border}`,
          borderRadius: R.full,
          paddingLeft: 16, paddingRight: 6,
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: T.textPrimary, fontSize: TYPE.subhead, fontFamily: font,
            }}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            style={{
              width: 32, height: 32, borderRadius: R.full,
              backgroundColor: input.trim() ? T.cta : T.surfaceElevated,
              border: input.trim() ? "none" : `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: input.trim() ? "pointer" : "default",
              transition: "background-color 0.18s",
            }}
          >
            <PaperPlaneTilt size={14} color={input.trim() ? "#000000" : T.textTertiary} weight="fill" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}