"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AIOrb } from "@/components/ui/ai-orb";
import { Button } from "@/components/ui/button";
import { X, ChevronRight } from "lucide-react";
import { useApp } from "@/context/app-context";

const steps = [
  { title: "Dashboard", desc: "Your command center for learning and progress." },
  { title: "AI Chat", desc: "Talk to your AI study companion anytime." },
  { title: "Upload Files", desc: "Upload books and materials for AI analysis." },
  { title: "Analytics", desc: "Track grades, mood, and study habits." },
  { title: "Know Yourself", desc: "Emotional support and mental wellness." },
  { title: "Settings", desc: "Customize your experience and preferences." },
];

export function OnboardingTutorial() {
  const { showOnboarding, setShowOnboarding } = useApp();
  const [step, setStep] = useState(0);

  if (!showOnboarding) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative max-w-md w-full glass-card p-8 rounded-3xl border border-accent-primary/30 shadow-glow"
        >
          <button
            onClick={() => setShowOnboarding(false)}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-6">
            <AIOrb size="md" interactive={false} />
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <p className="text-xs text-accent-primary font-medium mb-1">
              Step {step + 1} of {steps.length}
            </p>
            <h3 className="text-2xl font-display font-bold mb-2">
              {steps[step].title}
            </h3>
            <p className="text-muted mb-6">{steps[step].desc}</p>
          </motion.div>

          <div className="flex gap-2 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i <= step ? "bg-accent-primary" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {step < steps.length - 1 ? (
              <Button
                className="flex-1"
                onClick={() => setStep((s) => s + 1)}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button className="flex-1" onClick={() => setShowOnboarding(false)}>
                Get Started
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center pointer-events-none"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-accent-primary mx-auto" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
