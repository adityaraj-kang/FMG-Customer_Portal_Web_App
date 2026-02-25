// HapticButton.tsx — Global haptic-style press feel for all primary CTAs.
// whileTap compresses to 0.96, spring physics overshoots to ~1.02 on release → 1.0.

import { motion, type MotionProps } from "motion/react";
import { type CSSProperties, type ReactNode } from "react";

interface HapticButtonProps extends MotionProps {
  children: ReactNode;
  disabled?: boolean;
  style?: CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export function HapticButton({
  children,
  disabled,
  style,
  ...props
}: HapticButtonProps) {
  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.96 } : {}}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      disabled={disabled}
      style={{ touchAction: "manipulation", cursor: disabled ? "default" : "pointer", ...style }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
