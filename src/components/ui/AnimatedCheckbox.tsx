"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export default function AnimatedCheckbox({
  checked,
  onChange,
  disabled = false,
  className,
  size = "md",
}: AnimatedCheckboxProps) {
  const sizeClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      whileHover={disabled ? undefined : { scale: 1.08 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => onChange(!checked)}
      className={cn(
        "shrink-0 rounded-[3px] border-2 outline-none transition-colors duration-200",
        "focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "border-blue-600 bg-blue-600"
          : "border-gray-300 bg-white hover:border-blue-400",
        sizeClass,
        className,
      )}
    >
      <motion.svg
        className="h-full w-full"
        viewBox="0 0 12 12"
        fill="none"
        initial={false}
      >
        <motion.path
          d="M2.5 6L5 8.5L9.5 3.5"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          animate={checked ? "checked" : "unchecked"}
          variants={{
            checked: {
              pathLength: 1,
              opacity: 1,
              transition: {
                pathLength: { duration: 0.25, ease: "easeInOut", delay: 0.05 },
                opacity: { duration: 0.1 },
              },
            },
            unchecked: {
              pathLength: 0,
              opacity: 0,
              transition: {
                pathLength: { duration: 0.2, ease: "easeInOut" },
                opacity: { duration: 0.15, delay: 0.1 },
              },
            },
          }}
        />
      </motion.svg>
    </motion.button>
  );
}
