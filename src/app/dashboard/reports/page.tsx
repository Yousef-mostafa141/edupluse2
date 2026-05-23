"use client";

import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { AnimatedChart } from "@/components/ui/animated-chart";
import { useApp } from "@/context/app-context";

export default function ReportsPage() {
  const { userName } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold">Weekly AI Reports</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-gradient text-white text-sm">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl overflow-hidden border border-[var(--border)]"
      >
        {/* Report Cover */}
        <div className="relative p-8 lg:p-12 bg-gradient-to-br from-accent-primary via-purple-700 to-accent-secondary">
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              />
            ))}
          </div>
          <p className="text-white/70 text-sm mb-2">Weekly Report • May 2026</p>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-2">
            {userName}&apos;s Learning Journey
          </h2>
          <p className="text-white/80">EduPulse AI • Academic & Emotional Insights</p>
        </div>

        <div className="bg-[var(--bg-card)] p-6 lg:p-8 space-y-8">
          <section>
            <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent-primary" />
              AI Analysis
            </h3>
            <p className="text-muted leading-relaxed text-sm">
              This week showed strong improvement in study consistency. You completed 85% of daily tasks
              and maintained a 7-day streak. Your focus sessions increased by 23% compared to last week.
            </p>
          </section>

          <div className="grid sm:grid-cols-2 gap-4">
            <AnimatedChart title="Academic Progress" type="area" color="#6C63FF" />
            <AnimatedChart title="Emotional Wellness" type="line" color="#00D4FF" />
          </div>

          <section className="grid sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-accent-primary/10 border border-accent-primary/20">
              <h4 className="font-semibold mb-2">Academic Summary</h4>
              <ul className="text-sm text-muted space-y-1">
                <li>• Math: 92% (↑ 5%)</li>
                <li>• Biology: 88% (↑ 3%)</li>
                <li>• Study hours: 24h total</li>
              </ul>
            </div>
            <div className="p-5 rounded-2xl bg-accent-secondary/10 border border-accent-secondary/20">
              <h4 className="font-semibold mb-2">Emotional Summary</h4>
              <ul className="text-sm text-muted space-y-1">
                <li>• Average mood: 7.8/10</li>
                <li>• Stress level: Low</li>
                <li>• 3 wellness check-ins completed</li>
              </ul>
            </div>
          </section>

          <section className="p-5 rounded-2xl glass border border-success/20">
            <h4 className="font-semibold text-success mb-2">AI Recommendations</h4>
            <p className="text-sm text-muted">
              Continue your morning study routine — it correlates with your highest focus scores.
              Consider a short break before Thursday&apos;s Chemistry test. Try the Know Yourself
              breathing exercise when stress peaks above 50%.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
