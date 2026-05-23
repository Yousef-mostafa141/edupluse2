"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";

interface AchievementPopupProps {
  show: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export function AchievementPopup({
  show,
  title,
  description,
  onClose,
}: AchievementPopupProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50 max-w-sm"
        >
          <div className="glass-card p-5 border border-warning/30 shadow-[0_0_40px_rgba(245,158,11,0.3)] flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-warning font-bold uppercase tracking-wider">
                Achievement Unlocked!
              </p>
              <h4 className="font-bold mt-1">{title}</h4>
              <p className="text-sm text-muted mt-0.5">{description}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
