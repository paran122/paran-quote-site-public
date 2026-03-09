"use client";

import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.3 } },
};

const fadeIn = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function MotionPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {children}
    </motion.div>
  );
}

export function MotionSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeIn} className={className}>
      {children}
    </motion.div>
  );
}

const wordVariant = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function MotionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const text = typeof children === "string" ? children : String(children);
  const words = text.split(" ");
  return (
    <motion.h1
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariant}
          className="inline-block"
        >
          {word}
          {i < words.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </motion.h1>
  );
}
