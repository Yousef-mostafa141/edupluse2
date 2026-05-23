"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useApp } from "@/context/app-context";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildCalendar(year: number, month: number) {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [];

  for (let i = 0; i < firstDayOfWeek; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  return cells;
}

export default function CalendarPage() {
  const { tasks, sessions } = useApp();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const calendarCells = useMemo(() => buildCalendar(year, month), [year, month]);

  const events = useMemo(() => {
    const taskEvents = tasks.map((task) => ({
      date: new Date(task.dueDate),
      title: task.title,
      type: task.completed ? "Completed Task" : "Due Task",
      color: task.completed ? "#22C55E" : "#6C63FF",
    }));

    const sessionEvents = sessions.map((session) => ({
      date: new Date(session.date),
      title: `${session.subject} session`,
      type: "Study Session",
      color: "#F59E0B",
    }));

    return [...taskEvents, ...sessionEvents].filter((event) => event.date.getMonth() === month && event.date.getFullYear() === year);
  }, [tasks, sessions, month, year]);

  const eventsByDay = useMemo(() => {
    const map = new Map<number, typeof events[0][]>();
    events.forEach((event) => {
      const day = event.date.getDate();
      const existing = map.get(day) ?? [];
      existing.push(event);
      map.set(day, existing);
    });
    return map;
  }, [events]);

  const upcomingEvents = useMemo(() => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 1);
    return events
      .filter((event) => event.date >= threshold)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 6);
  }, [events]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Academic Calendar</h1>
          <p className="text-sm text-muted mt-1">Your study sessions and task deadlines for {now.toLocaleString("default", { month: "long" })} {year}.</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white/5 p-2">
          <button className="p-2 rounded-xl hover:bg-white/10" aria-label="Previous month">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">{now.toLocaleString("default", { month: "long" })} {year}</span>
          <button className="p-2 rounded-xl hover:bg-white/10" aria-label="Next month">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <GlassCard className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-xs text-muted py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((day, index) => {
            const dayEvents = day ? eventsByDay.get(day) ?? [] : [];
            const isToday = day === now.getDate();
            return (
              <motion.div
                key={`${day}-${index}`}
                whileHover={day ? { scale: 1.02 } : undefined}
                className={`aspect-square rounded-xl border border-[var(--border)] p-2 flex flex-col justify-between text-sm ${
                  day
                    ? isToday
                      ? "bg-accent-primary/10 border-accent-primary/40"
                      : "hover:bg-white/5 cursor-pointer"
                    : "bg-transparent"
                }`}
              >
                {day ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className={isToday ? "font-semibold text-accent-primary" : "font-medium"}>{day}</span>
                      {dayEvents.length > 0 && <span className="text-[10px] text-muted">{dayEvents.length}</span>}
                    </div>
                    <div className="mt-2 space-y-1">
                      {dayEvents.slice(0, 2).map((event, idx) => (
                        <span
                          key={idx}
                          className="block truncate rounded-full px-2 py-1 text-[10px] font-medium"
                          style={{ background: `${event.color}20`, color: event.color }}
                        >
                          {event.title}
                        </span>
                      ))}
                    </div>
                  </>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upcoming Events</h2>
        {upcomingEvents.length ? (
          upcomingEvents.map((event) => (
            <GlassCard key={`${event.title}-${event.date.toISOString()}`} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{event.title}</p>
                <p className="text-xs text-muted">{event.type} • {event.date.toLocaleDateString()}</p>
              </div>
              <span className="text-xs font-semibold" style={{ color: event.color }}>
                {event.date.toLocaleDateString(undefined, { weekday: "short" })}
              </span>
            </GlassCard>
          ))
        ) : (
          <GlassCard className="p-6 text-center text-sm text-muted">
            No upcoming calendar events found. Add tasks or study sessions to populate the calendar.
          </GlassCard>
        )}
      </div>
    </div>
  );
}
