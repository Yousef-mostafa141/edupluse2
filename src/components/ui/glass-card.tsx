"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className,
  hover = true,
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow: "0 0 30px rgba(108, 99, 255, 0.25)",
            }
          : undefined
      }
      className={cn(
        "glass-card rounded-2xl p-6 transition-all duration-300",
        "bg-[var(--bg-card)] border border-[var(--border)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
