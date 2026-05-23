"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AIOrbProps {
  size?: "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
  className?: string;
}

const sizes = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
};

export function AIOrb({ size = "md", interactive = true, className }: AIOrbProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

  useEffect(() => {
    if (!interactive) return;
    const handleMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set((e.clientX - cx) / rect.width);
      mouseY.set((e.clientY - cy) / rect.height);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [interactive, mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative", sizes[size], className)}
      style={interactive ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            "0 0 30px rgba(108,99,255,0.4), 0 0 60px rgba(0,212,255,0.2)",
            "0 0 50px rgba(108,99,255,0.6), 0 0 80px rgba(0,212,255,0.35)",
            "0 0 30px rgba(108,99,255,0.4), 0 0 60px rgba(0,212,255,0.2)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-br from-accent-primary via-purple-500 to-accent-secondary",
          "flex items-center justify-center"
        )}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-2 rounded-full bg-surface-bg/30 backdrop-blur-sm" />
        <motion.div
          className="w-1/3 h-1/3 rounded-full bg-white/80"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/20"
            style={{ inset: `${10 + i * 15}%` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
