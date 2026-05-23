"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useApp } from "@/context/app-context";

const testimonials = [
  { name: "Sara M.", grade: "Grade 11", text: "EduPulse helped me understand chemistry and feel less stressed before exams.", avatar: "S", rating: 5 },
  { name: "Omar K.", grade: "Grade 10", text: "The AI chat feels like talking to a patient tutor who never gets tired.", avatar: "O", rating: 5 },
  { name: "Layla A.", grade: "Grade 12", text: "Know Yourself section changed how I handle study burnout. Truly calming.", avatar: "L", rating: 5 },
  { name: "Youssef H.", grade: "University", text: "Weekly reports are gorgeous. My parents actually understand my progress now.", avatar: "Y", rating: 5 },
];

export function Testimonials() {
  const { t } = useApp();

  return (
    <section className="py-24 overflow-hidden">
      <h2 className="text-3xl font-display font-bold text-center mb-12 px-4">
        {t("testimonials")}
      </h2>
      <div className="relative">
        <motion.div
          className="flex gap-6 px-4"
          animate={{ x: [0, -1200] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...testimonials, ...testimonials].map((item, i) => (
            <GlassCard
              key={i}
              className="min-w-[300px] max-w-[300px] shrink-0"
              hover={false}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center font-bold">
                  {item.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-muted">{item.grade}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(item.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-muted leading-relaxed">{item.text}</p>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
