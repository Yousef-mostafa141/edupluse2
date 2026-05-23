"use client";

import { AnimatedChart } from "@/components/ui/animated-chart";
import { GlassCard } from "@/components/ui/glass-card";
import { BarChart3, TrendingUp, Clock, Smile } from "lucide-react";

const stats = [
  { icon: TrendingUp, label: "Average Grade", value: "87%", color: "#6C63FF" },
  { icon: Clock, label: "Study Hours", value: "24h", color: "#00D4FF" },
  { icon: BarChart3, label: "Attendance", value: "94%", color: "#22C55E" },
  { icon: Smile, label: "Avg Mood", value: "7.8", color: "#F59E0B" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-display font-bold">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
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

      <div className="grid sm:grid-cols-2 gap-4">
        <AnimatedChart title="Grades Over Time" type="area" color="#6C63FF" />
        <AnimatedChart title="Attendance" type="bar" color="#22C55E" />
        <AnimatedChart title="Study Hours" type="line" color="#00D4FF" />
        <AnimatedChart title="Mood Tracking" type="area" color="#F59E0B" />
        <AnimatedChart title="Focus Level" type="line" color="#6C63FF" />
      </div>
    </div>
  );
}
