"use client";

import { motion } from "framer-motion";
import { Upload, MessageSquare, TrendingUp, ArrowRight } from "lucide-react";
import { useApp } from "@/context/app-context";

const steps = [
  { icon: Upload, key: "step1" as const },
  { icon: MessageSquare, key: "step2" as const },
  { icon: TrendingUp, key: "step3" as const },
];

export function HowItWorks() {
  const { t } = useApp();

  return (
    <section id="how-it-works" className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-center mb-16">
          {t("howItWorks")}
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.key} className="flex items-center gap-4 md:gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-accent-gradient flex items-center justify-center mb-4 shadow-glow"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <span className="text-xs text-accent-primary font-bold mb-1">
                    STEP {i + 1}
                  </span>
                  <p className="font-medium max-w-[160px]">{t(step.key)}</p>
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div
                    className="hidden md:block"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6 text-accent-primary" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
