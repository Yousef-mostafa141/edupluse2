"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Upload,
  Focus,
  Heart,
  Flame,
} from "lucide-react";
import { AIOrb } from "@/components/ui/ai-orb";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedChart } from "@/components/ui/animated-chart";
import { useApp } from "@/context/app-context";
import Link from "next/link";

const quickActions = [
  { icon: MessageSquare, label: "Ask AI", href: "/dashboard/chat", color: "#6C63FF" },
  { icon: Upload, label: "Upload Files", href: "/dashboard/upload", color: "#00D4FF" },
  { icon: Focus, label: "Focus Mode", href: "/dashboard/focus", color: "#22C55E" },
  { icon: Heart, label: "Know Yourself", href: "/dashboard/know-yourself", color: "#F59E0B" },
];

export default function DashboardPage() {
  const { userName, streak, xp, grades, tasks, sessions } = useApp();

  const completedTasks = tasks.filter((task) => task.completed).length;
  const taskProgress = tasks.length ? `${completedTasks} / ${tasks.length}` : "No tasks yet";

  const gradeTrendData = useMemo(() => {
    return grades
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((grade) => ({ name: grade.date, value: Math.round(grade.score) }));
  }, [grades]);

  const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const studyHoursData = useMemo(() => {
    const map = new Map<string, number>();
    const today = new Date();
    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      map.set(date.toISOString().slice(0, 10), 0);
    }
    sessions.forEach((session) => {
      const key = new Date(session.date).toISOString().slice(0, 10);
      map.set(key, (map.get(key) ?? 0) + session.duration / 60);
    });
    return Array.from(map.entries()).map(([date, hours]) => ({ name: weekLabels[new Date(date).getDay()], value: Number(hours.toFixed(1)) }));
  }, [sessions]);

  const focusData = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    const today = new Date();
    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      map.set(date.toISOString().slice(0, 10), { total: 0, count: 0 });
    }
    sessions.forEach((session) => {
      const key = new Date(session.date).toISOString().slice(0, 10);
      const record = map.get(key) ?? { total: 0, count: 0 };
      record.total += session.focusLevel;
      record.count += 1;
      map.set(key, record);
    });
    return Array.from(map.entries()).map(([date, record]) => ({
      name: weekLabels[new Date(date).getDay()],
      value: record.count ? Math.round(record.total / record.count) : 0,
    }));
  }, [sessions]);

  const averageGrade = grades.length ? Math.round(grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length) : 0;
  const totalStudyHours = sessions.reduce((sum, session) => sum + session.duration / 60, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 lg:p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 via-transparent to-accent-secondary/10" />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">Welcome back, {userName}</h1>
            <p className="text-muted">Your learning dashboard is connected to real school data.</p>
          </div>
          <div className="flex items-center gap-6">
            <AIOrb size="md" />
            <div className="text-right">
              <p className="text-3xl font-bold">{Math.round(totalStudyHours)}h</p>
              <p className="text-sm text-muted">Study hours this week</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
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
          <AnimatedChart title="Grades" type="area" data={gradeTrendData.length ? gradeTrendData : [{ name: "No data", value: 0 }]} color="#6C63FF" />
          <AnimatedChart title="Study Hours" type="bar" data={studyHoursData} color="#00D4FF" />
          <AnimatedChart title="Focus Level" type="line" data={focusData} color="#22C55E" />
          <AnimatedChart title="Average Grade" type="area" data={gradeTrendData.length ? gradeTrendData : [{ name: "No data", value: 0 }]} color="#F59E0B" />
        </div>

        <div className="space-y-4">
          <GlassCard className="text-center py-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-12 h-12 text-warning mx-auto fire-animate mb-2" />
              <p className="text-4xl font-display font-bold text-warning">{streak}</p>
              <p className="text-muted text-sm mt-1">Day streak</p>
            </motion.div>
          </GlassCard>

          <GlassCard className="p-6 rounded-3xl text-left">
            <h3 className="font-semibold mb-3">Task progress</h3>
            <p className="text-muted mb-4">{taskProgress}</p>
            <Link href="/dashboard/tasks" className="text-sm text-accent-primary hover:underline">
              Manage tasks
            </Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
