"use client";

import { AnimatedChart } from "@/components/ui/animated-chart";
import { GlassCard } from "@/components/ui/glass-card";
import { BarChart3, TrendingUp, Clock, Smile } from "lucide-react";
import { useApp } from "@/context/app-context";

export default function AnalyticsPage() {
  const { grades, streak, xp } = useApp();

  const averageGrade = grades.length
    ? Math.round(grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length)
    : 0;

  const studyHours = grades.length * 2 + streak * 1;
  const attendance = grades.length ? Math.min(100, 70 + streak * 3) : 0;
  const mood = grades.length ? Math.min(100, 50 + Math.floor(streak * 4)) : 0;

  const gradeTrendData = grades.length
    ? grades.map((grade) => ({ name: grade.date, value: grade.score }))
    : [{ name: "No grades yet", value: 0 }];

  const attendanceData = grades.length
    ? Array.from({ length: 7 }).map((_, index) => ({
        name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
        value: Math.min(100, 70 + index * 4),
      }))
    : Array.from({ length: 7 }).map((_, index) => ({ name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index], value: 0 }));

  const studyHoursData = grades.length
    ? Array.from({ length: 7 }).map((_, index) => ({
        name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
        value: 1 + index * 1.5,
      }))
    : Array.from({ length: 7 }).map((_, index) => ({ name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index], value: 0 }));

  const moodData = grades.length
    ? Array.from({ length: 7 }).map((_, index) => ({
        name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
        value: Math.min(100, 50 + index * 6),
      }))
    : Array.from({ length: 7 }).map((_, index) => ({ name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index], value: 0 }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-display font-bold">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: "Average Grade", value: grades.length ? `${averageGrade}%` : "0%", color: "#6C63FF" },
          { icon: Clock, label: "Study Hours", value: `${studyHours}h`, color: "#00D4FF" },
          { icon: BarChart3, label: "Attendance", value: grades.length ? `${attendance}%` : "0%", color: "#22C55E" },
          { icon: Smile, label: "Mood Score", value: grades.length ? `${mood}%` : "0%", color: "#F59E0B" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <GlassCard key={s.label} hover={false}>
              <Icon className="w-6 h-6 mb-3" style={{ color: s.color }} />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </GlassCard>
          );
        })}
      </div>

      {grades.length === 0 && (
        <div className="glass-card p-6 rounded-3xl border border-dashed border-[var(--border)] text-center">
          <p className="font-semibold">Add your first grade in Settings to activate analytics.</p>
          <p className="text-sm text-muted mt-2">Grades drive your score charts, attendance estimates, and mood insights.</p>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <AnimatedChart title="Grades Over Time" type="area" data={gradeTrendData} color="#6C63FF" />
        <AnimatedChart title="Attendance" type="bar" data={attendanceData} color="#22C55E" />
        <AnimatedChart title="Study Hours" type="line" data={studyHoursData} color="#00D4FF" />
        <AnimatedChart title="Mood Tracking" type="area" data={moodData} color="#F59E0B" />
        <AnimatedChart title="Focus Level" type="line" color="#6C63FF" />
      </div>
    </div>
  );
}
