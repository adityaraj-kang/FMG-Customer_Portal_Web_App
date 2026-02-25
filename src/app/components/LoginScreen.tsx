import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  EnvelopeSimple,
  Lock,
  Eye,
  EyeSlash,
  User,
  Phone,
} from "@phosphor-icons/react";
import { T, font, R, HIG, TYPE } from "../tokens";
import { useIsMobile } from "./ui/use-mobile";

type Mode = "signin" | "signup";

// iOS UIKit easing
const IOS = [0.32, 0.72, 0, 1] as const;

// ─── Apple Icon ───────────────────────────────────────────────
function AppleIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 814 1000" fill="currentColor">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 192.5-49 30.8 0 133.4 2.6 198.3 99zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
}

// ─── Google Icon ──────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M19.6 10.23c0-.68-.06-1.36-.17-2.01H10v3.8h5.4c-.23 1.24-.94 2.28-2 2.97v2.46h3.24c1.89-1.74 2.97-4.3 2.97-7.22z" fill="#4285F4" />
      <path d="M10 20c2.7 0 4.97-.9 6.62-2.43l-3.24-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.6-4.13H1.07v2.57C2.72 17.75 6.1 20 10 20z" fill="#34A853" />
      <path d="M4.4 11.9c-.2-.6-.31-1.23-.31-1.9s.11-1.31.31-1.9V5.53H1.07C.38 6.9 0 8.4 0 10s.38 3.1 1.07 4.47L4.4 11.9z" fill="#FBBC05" />
      <path d="M10 3.96c1.47 0 2.8.51 3.84 1.5l2.88-2.87C14.97.99 12.7 0 10 0 6.1 0 2.72 2.25 1.07 5.53L4.4 7.1C5.2 5.73 7.4 3.96 10 3.96z" fill="#EA4335" />
    </svg>
  );
}

// ─── Input Field ──────────────────────────────────────────────
function InputField({
  placeholder,
  value,
  onChange,
  type = "text",
  leadIcon,
  trailContent,
  isFocused,
  onFocus,
  onBlur,
  inputClass,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  leadIcon: React.ReactNode;
  trailContent?: React.ReactNode;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  inputClass: string;
}) {
  return (
    <div
      style={{
        height: 50,
        backgroundColor: T.surfaceElevated,
        border: `1px solid ${isFocused ? T.cta : T.border}`,
        borderRadius: R.sm,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 12,
        transition: "border-color 0.18s ease",
      }}
    >
      <div style={{ flexShrink: 0, display: "flex", opacity: isFocused ? 1 : 0.55, transition: "opacity 0.18s" }}>
        {leadIcon}
      </div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className={inputClass}
        style={{
          flex: 1,
          background: "none",
          border: "none",
          outline: "none",
          color: T.textPrimary,
          fontSize: TYPE.subhead,
          fontWeight: 400,
          fontFamily: font,
          letterSpacing: "-0.01em",
        }}
      />
      {trailContent}
    </div>
  );
}

// ─── Social Button ────────────────────────────────────────────
function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      style={{
        width: "100%",
        height: 50,
        backgroundColor: T.surfaceElevated,
        border: `1px solid ${T.border}`,
        borderRadius: R.md,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        cursor: "pointer",
        fontFamily: font,
      }}
    >
      {icon}
      <span style={{ color: T.textPrimary, fontSize: TYPE.subhead, fontWeight: 500, letterSpacing: "-0.01em" }}>
        {label}
      </span>
    </button>
  );
}

// ─── Tab Switcher ─────────────────────────────────────────────
function TabSwitcher({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: T.surface,
        borderRadius: R.md,
        padding: 4,
        gap: 4,
      }}
    >
      {(["signin", "signup"] as Mode[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            flex: 1,
            height: HIG.minTapTarget - 4,
            position: "relative",
            background: "none",
            border: "none",
            cursor: "pointer",
            borderRadius: R.sm,
          }}
        >
          {mode === tab && (
            <motion.div
              layoutId="tab-pill"
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: T.surfaceElevated,
                borderRadius: R.sm,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 38, mass: 0.8 }}
            />
          )}
          <span
            style={{
              position: "relative",
              zIndex: 1,
              color: mode === tab ? T.textPrimary : T.textTertiary,
              fontSize: TYPE.subhead,
              fontWeight: mode === tab ? 600 : 500,
              fontFamily: font,
              letterSpacing: "-0.01em",
              transition: "color 0.18s",
            }}
          >
            {tab === "signin" ? "Sign In" : "Sign Up"}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── OR Divider ───────────────────────────────────────────────
function OrDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, height: 0.5, backgroundColor: T.border }} />
      <span style={{ color: T.textTertiary, fontSize: TYPE.footnote, fontFamily: font }}>or</span>
      <div style={{ flex: 1, height: 0.5, backgroundColor: T.border }} />
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────
export function LoginScreen() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [mode, setMode] = useState<Mode>("signin");
  const [focused, setFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [password, setPassword] = useState("");

  const handleModeChange = (m: Mode) => {
    setMode(m);
    setFocused(null);
    setShowPassword(false);
  };

  const formContent = (
    <>
      <style>{`.gi-input::placeholder { color: ${T.textTertiary}; }`}</style>
      <div style={{ overflowY: "auto", padding: `0 ${HIG.screenMargin}px`, flex: isMobile ? 1 : undefined }}>

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 16,
            paddingBottom: 28,
          }}
        >
          <span
            style={{
              fontSize: TYPE.title1,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              fontFamily: font,
            }}
          >
            <span style={{ color: T.textPrimary }}>Find My </span>
            <span style={{ color: T.cta }}>Genie</span>
          </span>
        </div>

        <TabSwitcher mode={mode} onChange={handleModeChange} />

        <AnimatePresence mode="wait">
          <motion.div
            key={mode + "-heading"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 440, damping: 36, mass: 0.9 }}
            style={{ paddingTop: 24, paddingBottom: 24 }}
          >
            <h2
              style={{
                margin: "0 0 6px",
                color: T.textPrimary,
                fontSize: TYPE.title1,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                fontFamily: font,
              }}
            >
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h2>
            <p
              style={{
                margin: 0,
                color: T.textTertiary,
                fontSize: TYPE.subhead,
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              {mode === "signin"
                ? "Sign in to continue to Genie"
                : "Get started — it only takes a minute"}
            </p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode + "-form"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28, ease: IOS }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mode === "signup" && (
                <InputField
                  placeholder="Full name"
                  value={name}
                  onChange={setName}
                  leadIcon={<User size={18} color={T.textTertiary} />}
                  isFocused={focused === "name"}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  inputClass="gi-input"
                />
              )}

              <InputField
                placeholder="Email address"
                value={email}
                onChange={setEmail}
                type="email"
                leadIcon={<EnvelopeSimple size={18} color={T.textTertiary} />}
                isFocused={focused === "email"}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                inputClass="gi-input"
              />

              {mode === "signup" && (
                <InputField
                  placeholder="Phone number"
                  value={phone}
                  onChange={setPhone}
                  type="tel"
                  leadIcon={<Phone size={18} color={T.textTertiary} />}
                  isFocused={focused === "phone"}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused(null)}
                  inputClass="gi-input"
                />
              )}

              <InputField
                placeholder="Password"
                value={password}
                onChange={setPassword}
                type={showPassword ? "text" : "password"}
                leadIcon={<Lock size={18} color={T.textTertiary} />}
                trailContent={
                  <button
                    onClick={() => setShowPassword((v) => !v)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      flexShrink: 0,
                      minWidth: HIG.minTapTarget,
                      minHeight: HIG.minTapTarget,
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "-12px -16px -12px 0",
                    }}
                  >
                    {showPassword
                      ? <EyeSlash size={18} color={T.textTertiary} />
                      : <Eye size={18} color={T.textTertiary} />}
                  </button>
                }
                isFocused={focused === "password"}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                inputClass="gi-input"
              />

              {mode === "signin" && (
                <div style={{ textAlign: "right", marginTop: -4 }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: T.cta,
                      fontSize: TYPE.footnote,
                      fontWeight: 500,
                      fontFamily: font,
                      padding: "4px 0",
                      minHeight: HIG.minTapTarget,
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA button — navigates to /home */}
        <motion.button
          onClick={() => navigate("/home")}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 600, damping: 35 }}
          style={{
            width: "100%",
            height: 52,
            backgroundColor: T.cta,
            border: "none",
            borderRadius: R.md,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <span
            style={{
              color: "#000000",
              fontSize: TYPE.callout,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              fontFamily: font,
            }}
          >
            {mode === "signin" ? "Sign In" : "Create Account"}
          </span>
        </motion.button>

        <div style={{ marginTop: 24, marginBottom: 16 }}>
          <OrDivider />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SocialButton icon={<AppleIcon />}  label="Continue with Apple" />
          <SocialButton icon={<GoogleIcon />} label="Continue with Google" />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            paddingTop: 28,
            paddingBottom: 24,
          }}
        >
          <span style={{ color: T.textTertiary, fontSize: TYPE.subhead, fontFamily: font }}>
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            onClick={() => handleModeChange(mode === "signin" ? "signup" : "signin")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.cta,
              fontSize: TYPE.subhead,
              fontWeight: 600,
              fontFamily: font,
              padding: 0,
              minHeight: HIG.minTapTarget,
            }}
          >
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </>
  );

  // ── Desktop: centered card ────────────────────────────────────
  if (!isMobile) {
    return (
      <div
        style={{
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: T.bg,
          fontFamily: font,
          padding: "40px 16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 440,
            backgroundColor: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: "8px 0",
          }}
        >
          {formContent}
        </div>
      </div>
    );
  }

  // ── Mobile: full-screen ───────────────────────────────────────
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
      {formContent}
    </div>
  );
}
