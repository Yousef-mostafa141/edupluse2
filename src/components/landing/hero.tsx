"use client";

import { motion } from "framer-motion";
import { AIOrb } from "@/components/ui/ai-orb";
import { Particles } from "@/components/ui/particles";
import { NeuralNetwork } from "@/components/ui/neural-network";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
import { Sparkles } from "lucide-react";

export function Hero() {
  const { t } = useApp();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden neural-bg">
      <div className="absolute inset-0 bg-hero-gradient" />
      <NeuralNetwork />
      <Particles count={50} />

      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #6C63FF, transparent)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #00D4FF, transparent)" }}
        animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <AIOrb size="xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mb-4 px-4 py-2 rounded-full glass text-sm text-accent-secondary"
        >
          <Sparkles className="w-4 h-4" />
          <span>Powered by Advanced AI</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold mb-6"
        >
          <span className="text-gradient">{t("tagline")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg sm:text-xl text-muted max-w-2xl mb-10"
        >
          {t("heroSub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button href="/signup" size="lg">
            {t("getStarted")}
          </Button>
          <Button href="/demo" variant="secondary" size="lg">
            {t("tryDemo")}
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 bg-accent-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
