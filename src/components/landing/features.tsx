"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Mic,
  BarChart3,
  Heart,
  LayoutDashboard,
  BookOpen,
  FileText,
  Gamepad2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useApp } from "@/context/app-context";

const features = [
  { icon: MessageSquare, title: "AI Chat", desc: "Smart conversations for any subject", color: "#6C63FF" },
  { icon: Mic, title: "Voice AI", desc: "Talk naturally with your AI tutor", color: "#00D4FF" },
  { icon: BarChart3, title: "Study Analytics", desc: "Track progress with beautiful charts", color: "#22C55E" },
  { icon: Heart, title: "Emotional Support", desc: "A safe space for your feelings", color: "#F59E0B" },
  { icon: LayoutDashboard, title: "Smart Dashboard", desc: "Everything at a glance", color: "#6C63FF" },
  { icon: BookOpen, title: "Ask Your Book", desc: "AI-powered study from your materials", color: "#00D4FF" },
  { icon: FileText, title: "Weekly Reports", desc: "Premium AI-generated insights", color: "#22C55E" },
  { icon: Gamepad2, title: "Gamification", desc: "XP, streaks, and achievements", color: "#EF4444" },
];

export function Features() {
  const { t } = useApp();

  return (
    <section id="features" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl sm:text-4xl font-display font-bold text-center mb-4"
        >
          {t("features")}
        </motion.h2>
        <p className="text-muted text-center mb-16 max-w-xl mx-auto">
          Everything you need to learn smarter and feel supported
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <GlassCard key={f.title} delay={i * 0.08} className="group cursor-default">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${f.color}33, ${f.color}11)`,
                    boxShadow: `0 0 20px ${f.color}33`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted">{f.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
