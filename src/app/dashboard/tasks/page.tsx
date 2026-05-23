"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Plus } from "lucide-react";
import { useApp } from "@/context/app-context";

const initialTasks = [
  { id: 1, title: "Finish Math assignment", subject: "Math", xp: 50, done: false, priority: "high" },
  { id: 2, title: "Read Chapter 5 - Biology", subject: "Biology", xp: 30, done: true, priority: "medium" },
  { id: 3, title: "Practice Arabic essay", subject: "Arabic", xp: 40, done: false, priority: "medium" },
  { id: 4, title: "Review for Chemistry test", subject: "Chemistry", xp: 60, done: false, priority: "high" },
];

export default function TasksPage() {
  const { addXp } = useApp();
  const [tasks, setTasks] = useState(initialTasks);

  const toggle = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id && !t.done) addXp(t.xp);
        return t.id === id ? { ...t, done: !t.done } : t;
      })
    );
  };

  const priorityColors = { high: "#EF4444", medium: "#F59E0B", low: "#22C55E" };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold">Tasks</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-gradient text-white text-sm">
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            className={`glass-card p-4 rounded-2xl flex items-center gap-4 cursor-pointer ${
              task.done ? "opacity-60" : ""
            }`}
            onClick={() => toggle(task.id)}
            whileHover={{ x: 4 }}
          >
            <CheckCircle2
              className={`w-6 h-6 shrink-0 ${task.done ? "text-success" : "text-muted"}`}
            />
            <div className="flex-1">
              <p className={`font-medium ${task.done ? "line-through" : ""}`}>{task.title}</p>
              <p className="text-xs text-muted">{task.subject}</p>
            </div>
            <div
              className="w-2 h-8 rounded-full"
              style={{ background: priorityColors[task.priority as keyof typeof priorityColors] }}
            />
            <span className="text-xs font-bold text-accent-primary">+{task.xp} XP</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
