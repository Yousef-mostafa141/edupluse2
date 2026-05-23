"use client";

import { motion } from "framer-motion";

interface AIPetProps {
  mood?: "happy" | "sad" | "excited" | "neutral";
  level?: number;
  size?: "sm" | "md";
}

export function AIPet({ mood = "happy", level = 1, size = "md" }: AIPetProps) {
  const sizeClass = size === "sm" ? "w-16 h-16" : "w-24 h-24";

  const expressions = {
    happy: "◕ ‿ ◕",
    sad: "╥﹏╥",
    excited: "✧ ◡ ✧",
    neutral: "• ◡ •",
  };

  return (
    <motion.div
      className={`${sizeClass} relative`}
      animate={
        mood === "excited"
          ? { y: [0, -8, 0], rotate: [0, 5, -5, 0] }
          : mood === "sad"
          ? { y: [0, 2, 0] }
          : { y: [0, -4, 0] }
      }
      transition={{ duration: mood === "excited" ? 0.5 : 2, repeat: Infinity }}
    >
      <div
        className={`w-full h-full rounded-3xl flex flex-col items-center justify-center font-bold text-lg
          ${mood === "sad" ? "bg-blue-900/40" : "bg-accent-gradient"}
          shadow-glow border-2 border-white/20`}
      >
        <span className="text-white text-xs mb-0.5">Lv.{level}</span>
        <span className="text-white text-sm">{expressions[mood]}</span>
      </div>
      {mood === "excited" && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-warning text-xs"
              style={{ top: -5, left: i * 20 }}
              animate={{ opacity: [0, 1, 0], y: [-10, -20] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
            >
              ✨
            </motion.span>
          ))}
        </>
      )}
    </motion.div>
  );
}
