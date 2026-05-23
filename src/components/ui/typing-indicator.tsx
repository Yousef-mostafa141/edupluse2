"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 glass-card rounded-2xl w-fit">
      <motion.div
        className="w-2 h-2 rounded-full bg-accent-primary"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-accent-secondary"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-accent-primary"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
      />
      <motion.span
        className="ml-2 text-xs text-muted"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        AI is typing
      </motion.span>
    </div>
  );
}
