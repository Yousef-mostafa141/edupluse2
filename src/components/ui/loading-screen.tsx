"use client";

import { motion } from "framer-motion";
import { AIOrb } from "./ai-orb";
import { Particles } from "./particles";

type LoadingType = "thinking" | "scanning" | "mood" | "dashboard";

const messages: Record<LoadingType, string> = {
  thinking: "AI is thinking...",
  scanning: "Scanning your file...",
  mood: "Analyzing your mood...",
  dashboard: "Loading your dashboard...",
};

export function LoadingScreen({ type = "thinking" }: { type?: LoadingType }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-bg neural-bg">
      <Particles count={30} />
      <AIOrb size="lg" interactive={false} />
      <motion.p
        className="mt-8 text-lg text-muted font-display"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {messages[type]}
      </motion.p>
      <div className="mt-6 w-48 h-1 rounded-full bg-surface-card overflow-hidden">
        <motion.div
          className="h-full bg-accent-gradient rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
}
