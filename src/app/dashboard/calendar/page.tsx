"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const events = [
  { day: 23, title: "Math Exam", type: "exam", color: "#EF4444" },
  { day: 25, title: "Biology Quiz", type: "task", color: "#6C63FF" },
  { day: 28, title: "AI Study Plan Review", type: "ai", color: "#00D4FF" },
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [month] = useState("May 2026");

  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 3;
    return day > 0 && day <= 31 ? day : null;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold">Smart Calendar</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-white/5"><ChevronLeft className="w-5 h-5" /></button>
          <span className="font-medium min-w-[120px] text-center">{month}</span>
          <button className="p-2 rounded-xl hover:bg-white/5"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <GlassCard className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map((d) => (
            <div key={d} className="text-center text-xs text-muted py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            const event = events.find((e) => e.day === day);
            const isToday = day === 23;
            return (
              <motion.div
                key={i}
                whileHover={day ? { scale: 1.05 } : undefined}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm relative ${
                  day
                    ? isToday
                      ? "bg-accent-primary/20 border border-accent-primary/50"
                      : "hover:bg-white/5 cursor-pointer"
                    : ""
                }`}
              >
                {day && (
                  <>
                    <span className={isToday ? "font-bold text-accent-primary" : ""}>{day}</span>
                    {event && (
                      <div
                        className="absolute bottom-1 w-1.5 h-1.5 rounded-full"
                        style={{ background: event.color }}
                      />
                    )}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      <div className="space-y-3">
        <h2 className="font-semibold">Upcoming</h2>
        {events.map((e) => (
          <GlassCard key={e.title} className="flex items-center gap-4 py-4">
            <div
              className="w-2 h-10 rounded-full"
              style={{ background: e.color }}
            />
            <div>
              <p className="font-medium">{e.title}</p>
              <p className="text-xs text-muted">May {e.day} • {e.type}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
