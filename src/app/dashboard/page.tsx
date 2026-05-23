"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Upload,
  Focus,
  Heart,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { AIOrb } from "@/components/ui/ai-orb";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedChart } from "@/components/ui/animated-chart";
import { Button } from "@/components/ui/button";
import { AIPet } from "@/components/gamification/ai-pet";
import { useApp } from "@/context/app-context";
import Link from "next/link";
import { useState } from "react";
import { AchievementPopup } from "@/components/gamification/achievement-popup";

const tasks = [
  { id: 1, title: "Complete Math homework", xp: 50, done: false },
  { id: 2, title: "Review Biology notes", xp: 30, done: true },
  { id: 3, title: "30 min focus session", xp: 40, done: false },
  { id: 4, title: "Mood check-in", xp: 20, done: false },
];

export default function DashboardPage() {
  const { t, userName, streak, addXp } = useApp();
  const [taskList, setTaskList] = useState(tasks);
  const [showAchievement, setShowAchievement] = useState(false);

  const toggleTask = (id: number) => {
    setTaskList((prev) =>
      prev.map((task) => {
        if (task.id === id && !task.done) {
          addXp(task.xp);
          setShowAchievement(true);
          setTimeout(() => setShowAchievement(false), 4000);
          return { ...task, done: true };
        }
        return task.id === id ? { ...task, done: !task.done } : task;
      })
    );
  };

  const quickActions = [
    { icon: MessageSquare, label: t("askAI"), href: "/dashboard/chat", color: "#6C63FF" },
    { icon: Upload, label: t("uploadBook"), href: "/dashboard/upload", color: "#00D4FF" },
    { icon: Focus, label: t("focusMode"), href: "/dashboard/focus", color: "#22C55E" },
    { icon: Heart, label: t("analyzeMood"), href: "/dashboard/know-yourself", color: "#F59E0B" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AchievementPopup
        show={showAchievement}
        title="Task Complete!"
        description="+50 XP earned. Keep going!"
        onClose={() => setShowAchievement(false)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 lg:p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 via-transparent to-accent-secondary/10" />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
              {t("goodEvening")} {userName} 👋
            </h1>
            <p className="text-muted">{t("readyJourney")}</p>
          </div>
          <div className="flex items-center gap-6">
            <AIOrb size="md" />
            <AIPet mood="happy" level={3} />
          </div>
        </div>
      </motion.div>

      <div>
        <h2 className="text-lg font-semibold mb-4">{t("quickActions")}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="glass-card p-4 rounded-2xl flex flex-col items-center gap-3 cursor-pointer group"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-shadow group-hover:shadow-glow"
                    style={{ background: `${action.color}22` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: action.color }} />
                  </div>
                  <span className="text-sm font-medium text-center">{action.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          <AnimatedChart title="Grades" type="area" color="#6C63FF" />
          <AnimatedChart title="Study Hours" type="bar" color="#00D4FF" />
          <AnimatedChart title="Mood Tracking" type="line" color="#F59E0B" />
          <AnimatedChart title="Focus Level" type="area" color="#22C55E" />
        </div>

        <div className="space-y-4">
          <GlassCard className="text-center py-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-12 h-12 text-warning mx-auto fire-animate mb-2" />
              <p className="text-4xl font-display font-bold text-warning">{streak}</p>
              <p className="text-muted text-sm mt-1">{t("streak")}</p>
            </motion.div>
          </GlassCard>

          <div>
            <h3 className="font-semibold mb-3">{t("dailyTasks")}</h3>
            <div className="space-y-2">
              {taskList.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  className={`glass-card p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                    task.done ? "opacity-60" : ""
                  }`}
                  onClick={() => toggleTask(task.id)}
                  whileHover={{ x: 4 }}
                >
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 ${
                      task.done ? "text-success" : "text-muted"
                    }`}
                  />
                  <span className={`flex-1 text-sm ${task.done ? "line-through" : ""}`}>
                    {task.title}
                  </span>
                  <span className="text-xs text-accent-primary font-bold">+{task.xp} XP</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
