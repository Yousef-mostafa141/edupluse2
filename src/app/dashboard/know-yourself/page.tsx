"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedChart } from "@/components/ui/animated-chart";
import { TypingIndicator } from "@/components/ui/typing-indicator";

const moodData = [
  { name: "Mon", value: 70 },
  { name: "Tue", value: 55 },
  { name: "Wed", value: 80 },
  { name: "Thu", value: 45 },
  { name: "Fri", value: 75 },
  { name: "Sat", value: 90 },
  { name: "Sun", value: 85 },
];

export default function KnowYourselfPage() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "I'm here for you. This is a safe space — share whatever is on your mind. 💙" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    if (!input.trim()) return;
    const prompt = input.trim();
    setMessages((current) => [...current, { role: "user", text: prompt }]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.text || "Unable to connect to the support assistant.");
      }

      setMessages((current) => [...current, { role: "ai", text: data.text }]);
    } catch (err: any) {
      const message = err?.message || "Something went wrong. Please try again later.";
      setMessages((current) => [
        ...current,
        { role: "ai", text: `There was an issue reaching the AI assistant: ${message}` },
      ]);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const meters = [
    { label: "Mood", value: 78, color: "#6C63FF" },
    { label: "Stress", value: 35, color: "#22C55E" },
    { label: "Motivation", value: 65, color: "#00D4FF" },
    { label: "Burnout Risk", value: 22, color: "#F59E0B" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="relative rounded-3xl p-8 overflow-hidden bg-calm-gradient">
        <Heart className="w-8 h-8 text-accent-primary mb-2" />
        <h1 className="text-2xl font-display font-bold">Know Yourself</h1>
        <p className="text-muted mt-1">A calming space for emotional wellness</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="font-semibold">Emotional AI Chat</h2>
          <div className="glass-card rounded-2xl p-4 min-h-[300px] flex flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto mb-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                      m.role === "user"
                        ? "bg-accent-primary/30 rounded-br-sm"
                        : "bg-white/5 border border-white/10 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {loading && <TypingIndicator />}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Share how you're feeling..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none text-sm focus:border-accent-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-xl bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {error && <p className="text-sm text-danger mt-2">{error}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold">Mental Dashboard</h2>
          <div className="grid grid-cols-2 gap-4">
            {meters.map((m) => (
              <GlassCard key={m.label} hover={false}>
                <p className="text-sm text-muted mb-3">{m.label}</p>
                <div className="relative w-20 h-20 mx-auto">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#1B2540" strokeWidth="3" />
                    <motion.circle
                      cx="18" cy="18" r="16" fill="none"
                      stroke={m.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${m.value} 100`}
                      initial={{ strokeDasharray: "0 100" }}
                      whileInView={{ strokeDasharray: `${m.value} 100` }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {m.value}%
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
          <AnimatedChart title="Weekly Emotional Chart" type="area" data={moodData} color="#6C63FF" />
        </div>
      </div>
    </div>
  );
}
