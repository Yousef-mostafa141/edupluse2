"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Plus, Trash2, Flag } from "lucide-react";
import { useApp, Task } from "@/context/app-context";
import { GlassCard } from "@/components/ui/glass-card";

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, addXp } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    subject: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
  }>({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
    priority: "medium",
  });

  const handleAddTask = async () => {
    if (!formData.title.trim() || !formData.subject.trim() || !formData.dueDate) {
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      subject: formData.subject.trim(),
      dueDate: formData.dueDate,
      priority: formData.priority,
    };

    const success = await addTask(payload);
    if (!success) {
      return;
    }

    setFormData({ title: "", description: "", subject: "", dueDate: "", priority: "medium" });
    setShowForm(false);
  };

  const handleToggleTask = (task: Task) => {
    updateTask(task.id, { completed: !task.completed });
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const priorityColors: Record<string, string> = {
    high: "#EF4444",
    medium: "#F59E0B",
    low: "#22C55E",
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Tasks</h1>
          <p className="text-sm text-muted mt-1">
            {completedCount} of {tasks.length} completed
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-primary text-white hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-2xl space-y-4"
          >
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Task title..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none transition-colors"
            />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description (optional)..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none transition-colors resize-none h-24"
            />
            <div className="grid sm:grid-cols-3 gap-3">
              <input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Subject..."
                className="px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none transition-colors"
              />
              <input
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                type="date"
                className="px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none transition-colors"
              />
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as "low" | "medium" | "high",
                  })
                }
                className="px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none transition-colors"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddTask}
                className="flex-1 px-4 py-3 rounded-xl bg-accent-primary text-white hover:opacity-90 transition"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] hover:bg-white/5 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <GlassCard>
            <p className="text-center text-muted py-8">No tasks yet. Create one to get started!</p>
          </GlassCard>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`glass-card p-4 rounded-2xl flex items-start gap-4 group cursor-pointer ${
                task.completed ? "opacity-60" : ""
              }`}
              onClick={() => handleToggleTask(task)}
            >
              <button
                className="mt-1 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleTask(task);
                }}
              >
                <CheckCircle2
                  className={`w-6 h-6 transition ${
                    task.completed ? "text-success fill-success" : "text-muted"
                  }`}
                />
              </button>
              <div className="flex-1">
                <p className={`font-semibold ${task.completed ? "line-through text-muted" : ""}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-muted mt-1">{task.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs px-2 py-1 rounded-lg bg-white/10">
                    {task.subject}
                  </span>
                  <div
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                    style={{ background: `${priorityColors[task.priority]}20` }}
                  >
                    <Flag className="w-3 h-3" style={{ color: priorityColors[task.priority] }} />
                    {task.priority}
                  </div>
                  <span className="text-xs text-muted">Due: {task.dueDate}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition flex-shrink-0 text-danger hover:bg-danger/10 p-2 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
