"use client";

import { motion } from "framer-motion";
import { Trophy, Flame, Star, Target } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { AIPet } from "@/components/gamification/ai-pet";
import { useApp } from "@/context/app-context";

const achievements = [
  { title: "Study Master", desc: "100 hours studied", icon: Trophy, unlocked: true },
  { title: "Focus Hero", desc: "50 focus sessions", icon: Target, unlocked: true },
  { title: "Night Warrior", desc: "Study after 10 PM", icon: Star, unlocked: false },
  { title: "Consistency King", desc: "30 day streak", icon: Flame, unlocked: false },
];

export default function ProfilePage() {
  const { userName, xp, streak, level } = useApp();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-gradient opacity-10" />
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-accent-gradient flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-glow">
            {userName[0]}
          </div>
          <h1 className="text-2xl font-display font-bold">{userName}</h1>
          <p className="text-muted">Grade 11 Student</p>
          <div className="flex justify-center gap-6 mt-6">
            <div>
              <p className="text-2xl font-bold text-accent-primary">LVL {level}</p>
              <p className="text-xs text-muted">Level</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{streak}🔥</p>
              <p className="text-xs text-muted">Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-secondary">{xp}</p>
              <p className="text-xs text-muted">XP</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <AIPet mood="excited" level={level} />
      </div>

      <div>
        <h2 className="font-semibold mb-4">Achievements</h2>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((a, i) => {
            const Icon = a.icon;
            return (
              <GlassCard
                key={a.title}
                delay={i * 0.1}
                className={!a.unlocked ? "opacity-50" : ""}
              >
                <Icon
                  className={`w-8 h-8 mb-3 ${
                    a.unlocked ? "text-warning" : "text-muted"
                  }`}
                />
                <h3 className="font-semibold text-sm">{a.title}</h3>
                <p className="text-xs text-muted mt-1">{a.desc}</p>
                {a.unlocked && (
                  <motion.span
                    className="inline-block mt-2 text-xs text-success font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓ Unlocked
                  </motion.span>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
