"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Upload, Send, Sparkles } from "lucide-react";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import Link from "next/link";

const suggestions = [
  "Explain quantum physics simply",
  "Help me with my essay",
  "Create a study plan for exams",
  "Summarize my uploaded chapter",
];

type Message = { role: "user" | "ai"; text: string };

const initialMessages: Message[] = [
  {
    role: "ai",
    text: "Hello! I'm your AI study companion. How can I help you learn today? ✨",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const nextMessages: Message[] = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setTyping(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      const aiText = response.ok ? data.text : data.error || "Gemini is unavailable. Please try again.";

      setMessages((prev) => [...prev, { role: "ai", text: aiText }] );
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "I couldn't connect to Gemini. Please check your network or API key.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-display font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-primary" />
          AI Chat
        </h1>
        <Link
          href="/dashboard/chat/voice"
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-accent-secondary/30 text-accent-secondary text-sm hover:shadow-glow-cyan transition-all"
        >
          <Mic className="w-4 h-4" />
          Voice Mode
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-hide">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent-primary text-white rounded-br-md"
                    : "glass-card border border-accent-primary/20 rounded-bl-md shadow-[0_0_20px_rgba(108,99,255,0.1)]"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && <TypingIndicator />}
      </div>

      {error && <p className="text-sm text-danger mb-3">{error}</p>}

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs px-3 py-2 rounded-xl glass border border-[var(--border)] hover:border-accent-primary/50 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="glass-card p-3 rounded-2xl border border-accent-primary/20 flex items-center gap-3 shadow-glow">
        <button className="p-2 rounded-xl hover:bg-white/5 text-muted">
          <Upload className="w-5 h-5" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask your AI companion..."
          className="flex-1 bg-transparent outline-none text-sm"
        />
        <button
          onClick={() => sendMessage(input)}
          className="p-2.5 rounded-xl bg-accent-gradient text-white hover:shadow-glow transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
        <Link href="/dashboard/chat/voice">
          <button className="p-2 rounded-xl hover:bg-white/5 text-accent-secondary">
            <Mic className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  );
}
