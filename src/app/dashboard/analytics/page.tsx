"use client";

import { useMemo } from "react";
import { AnimatedChart } from "@/components/ui/animated-chart";
import { GlassCard } from "@/components/ui/glass-card";
import { BarChart3, TrendingUp, Clock, Smile } from "lucide-react";
import { useApp } from "@/context/app-context";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AnalyticsPage() {
  const { grades, streak, xp, sessions } = useApp();

  const averageGrade = useMemo(
    () => (grades.length ? Math.round(grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length) : 0),
    [grades]
  );

  const studyHours = useMemo(
    () => Math.round(sessions.reduce((sum, session) => sum + session.duration / 60, 0)),
    [sessions]
  );

  const attendance = useMemo(() => {
    const uniqueDays = new Set(sessions.map((session) => new Date(session.date).toISOString().slice(0, 10)));
    return Math.min(100, Math.round((uniqueDays.size / 5) * 100));
  }, [sessions]);

  const mood = useMemo(() => {
    if (!sessions.length) return 0;
    const averageFocus = sessions.reduce((sum, session) => sum + session.focusLevel, 0) / sessions.length;
    return Math.round(Math.min(100, averageFocus));
  }, [sessions]);

  const gradeTrendData = useMemo(
    () =>
      grades
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((grade) => ({ name: grade.date, value: grade.score })),
    [grades]
  );

  const studyHoursData = useMemo(() => {
    const map = new Map<string, number>();
    const today = new Date();
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      map.set(d.toISOString().slice(0, 10), 0);
    }

    sessions.forEach((session) => {
      const key = new Date(session.date).toISOString().slice(0, 10);
      map.set(key, (map.get(key) ?? 0) + session.duration / 60);
    });

    return Array.from(map.entries()).map(([date, value]) => ({
      name: weekDays[new Date(date).getDay()],
      value: Number(value.toFixed(1)),
    }));
  }, [sessions]);

  const moodData = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    const today = new Date();
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      map.set(d.toISOString().slice(0, 10), { total: 0, count: 0 });
    }

    sessions.forEach((session) => {
      const key = new Date(session.date).toISOString().slice(0, 10);
      const record = map.get(key) ?? { total: 0, count: 0 };
      record.total += session.focusLevel;
      record.count += 1;
      map.set(key, record);
    });

    return Array.from(map.entries()).map(([date, record]) => ({
      name: weekDays[new Date(date).getDay()],
      value: record.count ? Math.round(record.total / record.count) : 0,
    }));
  }, [sessions]);

  const attendanceData = useMemo(() => {
    const map = new Map<string, number>();
    const today = new Date();
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      map.set(d.toISOString().slice(0, 10), 0);
    }

    const presentDays = new Set(sessions.map((session) => new Date(session.date).toISOString().slice(0, 10)));
    presentDays.forEach((day) => {
      if (map.has(day)) {
        map.set(day, 100);
      }
    });

    return Array.from(map.entries()).map(([date, value]) => ({
      name: weekDays[new Date(date).getDay()],
      value,
    }));
  }, [sessions]);

  const focusData = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    const today = new Date();
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      map.set(d.toISOString().slice(0, 10), { total: 0, count: 0 });
    }

    sessions.forEach((session) => {
      const key = new Date(session.date).toISOString().slice(0, 10);
      const record = map.get(key) ?? { total: 0, count: 0 };
      record.total += session.focusLevel;
      record.count += 1;
      map.set(key, record);
    });

    return Array.from(map.entries()).map(([date, record]) => ({
      name: weekDays[new Date(date).getDay()],
      value: record.count ? Math.round(record.total / record.count) : 0,
    }));
  }, [sessions]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-display font-bold">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: "Average Grade", value: grades.length ? `${averageGrade}%` : "0%", color: "#6C63FF" },
          { icon: Clock, label: "Study Hours", value: `${studyHours}h`, color: "#00D4FF" },
          { icon: BarChart3, label: "Attendance", value: sessions.length ? `${attendance}%` : "0%", color: "#22C55E" },
          { icon: Smile, label: "Mood Score", value: sessions.length ? `${mood}%` : "0%", color: "#F59E0B" },
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
        <AnimatedChart title="Focus Level" type="line" data={focusData} color="#6C63FF" />
      </div>
    </div>
  );
}
