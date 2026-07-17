"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { usd } from "@/lib/pricing";

/** Shared motion vocabulary — one easing family so the app moves as one. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const viewTransition = { duration: 0.4, ease: EASE };

/** Mount reveal with optional stagger delay. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Currency figure that springs to new values instead of snapping. */
export function AnimatedPrice({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 180, damping: 28 });
  const text = useTransform(spring, (v) => usd(v));
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  return <motion.span>{text}</motion.span>;
}
