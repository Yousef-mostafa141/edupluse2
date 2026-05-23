"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { AnimatedChart } from "@/components/ui/animated-chart";
import { useApp } from "@/context/app-context";

export default function ReportsPage() {
  const { userName, grades, tasks, sessions, xp, streak } = useApp();

  const averageGrade = useMemo(
    () => (grades.length ? Math.round(grades.reduce((sum, item) => sum + item.score, 0) / grades.length) : 0),
    [grades]
  );

  const completedTasks = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const studyHours = useMemo(() => Math.round(sessions.reduce((total, session) => total + session.duration / 60, 0)), [sessions]);
  const focusScore = useMemo(
    () => (sessions.length ? Math.round(sessions.reduce((total, session) => total + session.focusLevel, 0) / sessions.length) : 0),
    [sessions]
  );

  const subjectSummary = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    grades.forEach((grade) => {
      const existing = map.get(grade.subject) ?? { total: 0, count: 0 };
      existing.total += grade.score;
      existing.count += 1;
      map.set(grade.subject, existing);
    });
    return Array.from(map.entries()).map(([subject, record]) => ({
      subject,
      average: Math.round(record.total / record.count),
    }));
  }, [grades]);

  const recentGrades = useMemo(
    () => grades.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4),
    [grades]
  );

  const gradeTrendData = useMemo(
    () =>
      grades
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((grade) => ({ name: grade.date, value: grade.score })),
    [grades]
  );

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Weekly Learning Report</h1>
          <p className="text-sm text-muted mt-1">Real performance data from your latest grades, tasks, and focus sessions.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-gradient text-white text-sm hover:opacity-90 transition"
        >
          <Download className="w-4 h-4" />
          Print report
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl overflow-hidden border border-[var(--border)]"
      >
        <div className="relative p-8 lg:p-12 bg-gradient-to-br from-accent-primary via-purple-700 to-accent-secondary">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_rgba(255,255,255,0.35),_transparent_62%)]" />
          <p className="text-white/70 text-sm mb-2">Weekly Report • {new Date().toLocaleDateString()}</p>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-2">
            {userName}&apos;s Learning Summary
          </h2>
          <p className="text-white/80">EduPulse AI • Academic, focus, and performance insights</p>
        </div>

        <div className="bg-[var(--bg-card)] p-6 lg:p-8 space-y-8">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: "Average Grade", value: `${averageGrade}%`, accent: "#6C63FF" },
              { label: "Tasks Completed", value: `${completedTasks}/${tasks.length}`, accent: "#22C55E" },
              { label: "Study Hours", value: `${studyHours}h`, accent: "#00D4FF" },
              { label: "Focus Score", value: `${focusScore}%`, accent: "#F59E0B" },
            ].map((item) => (
              <div key={item.label} className="glass-card p-5 rounded-3xl">
                <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2">{item.label}</p>
                <p className="text-3xl font-bold" style={{ color: item.accent }}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AnimatedChart title="Grade Trend" type="area" data={gradeTrendData.length ? gradeTrendData : [{ name: "No grades", value: 0 }]} color="#6C63FF" />
            <AnimatedChart title="Focus Over Time" type="line" data={sessions.length ? sessions.map((session) => ({ name: session.date, value: session.focusLevel })) : [{ name: "No sessions", value: 0 }]} color="#00D4FF" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 rounded-3xl bg-accent-primary/10 border border-accent-primary/20">
              <h4 className="font-semibold mb-3">Academic Summary</h4>
              <ul className="text-sm text-muted space-y-2">
                {subjectSummary.slice(0, 4).map((item) => (
                  <li key={item.subject}>
                    <span className="font-medium">{item.subject}:</span> {item.average}% average
                  </li>
                ))}
                {!subjectSummary.length && <li>No grade data available yet.</li>}
              </ul>
            </div>

            <div className="p-5 rounded-3xl bg-accent-secondary/10 border border-accent-secondary/20">
              <h4 className="font-semibold mb-3">Weekly Highlights</h4>
              <ul className="text-sm text-muted space-y-2">
                <li>• XP gained: {xp}</li>
                <li>• Current streak: {streak} days</li>
                <li>• Recent tasks done: {completionRate}%</li>
              </ul>
            </div>
          </div>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 rounded-3xl glass border border-[var(--border)]">
              <h4 className="font-semibold mb-3">Latest Grades</h4>
              <ul className="space-y-2 text-sm text-muted">
                {recentGrades.length ? (
                  recentGrades.map((grade) => (
                    <li key={grade.id}>
                      <span className="font-medium">{grade.subject}</span> - {grade.score}% ({grade.date})
                    </li>
                  ))
                ) : (
                  <li>No recent grade entries available.</li>
                )}
              </ul>
            </div>

            <div className="p-5 rounded-3xl glass border border-[var(--border)]">
              <h4 className="font-semibold mb-3">Task Snapshot</h4>
              <p className="text-sm text-muted">
                {tasks.length
                  ? `You have completed ${completedTasks} of ${tasks.length} tasks. Keep this pace for better results.`
                  : "No tasks have been added yet."}
              </p>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
