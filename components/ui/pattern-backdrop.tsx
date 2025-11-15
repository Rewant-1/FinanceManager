"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PatternBackdropProps {
  className?: string;
  blur?: boolean;
  rounded?: boolean;
  overlayClassName?: string;
}

export function PatternBackdrop({
  className,
  blur = true,
  rounded = true,
  overlayClassName,
}: PatternBackdropProps) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 0.8, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden pattern-grid",
        rounded && "rounded-[2.5rem]",
        blur && "pattern-mask",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-br from-[#052017]/70 via-transparent to-[#04121c]/60 mix-blend-soft-light",
          overlayClassName
        )}
      />
    </motion.div>
  );
}
