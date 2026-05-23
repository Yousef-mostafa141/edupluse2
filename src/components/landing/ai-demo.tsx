"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { Upload, Mic } from "lucide-react";

const demoMessages = [
  { role: "user", text: "Can you explain photosynthesis simply?" },
  { role: "ai", text: "Photosynthesis is how plants convert sunlight, water, and CO₂ into energy and oxygen. Think of leaves as tiny solar panels! 🌱" },
];

export function AIDemo() {
  const [typing, setTyping] = useState(true);
  const [visibleMsg, setVisibleMsg] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (visibleMsg >= demoMessages.length) return;
    const msg = demoMessages[visibleMsg];
    if (msg.role === "ai") {
      setTyping(true);
      let i = 0;
      const interval = setInterval(() => {
        setDisplayText(msg.text.slice(0, i));
        i++;
        if (i > msg.text.length) {
          clearInterval(interval);
          setTyping(false);
          setTimeout(() => setVisibleMsg((v) => v + 1), 1000);
        }
      }, 30);
      return () => clearInterval(interval);
    } else {
      setDisplayText("");
      setTimeout(() => setVisibleMsg((v) => v + 1), 800);
    }
  }, [visibleMsg]);

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-center mb-12">
          See AI in Action
        </h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <GlassCard className="min-h-[320px] flex flex-col">
            <div className="flex-1 space-y-4 overflow-hidden">
              {demoMessages.slice(0, visibleMsg).map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                      m.role === "user"
                        ? "bg-accent-primary text-white rounded-br-sm"
                        : "glass border border-accent-primary/20 rounded-bl-sm"
                    }`}
                  >
                    {m.role === "ai" && i === visibleMsg - 1 ? displayText : m.text}
                    {m.role === "ai" && i === visibleMsg - 1 && typing && (
                      <span className="typing-cursor" />
                    )}
                  </div>
                </motion.div>
              ))}
              {typing && visibleMsg < demoMessages.length && (
                <TypingIndicator />
              )}
            </div>
            <div className="mt-4 flex gap-2 p-3 rounded-2xl glass border border-accent-primary/20">
              <input
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-sm outline-none"
                readOnly
              />
              <Mic className="w-5 h-5 text-accent-secondary cursor-pointer" />
              <Upload className="w-5 h-5 text-muted cursor-pointer" />
            </div>
          </GlassCard>

          <div className="space-y-4">
            <GlassCard>
              <p className="text-sm text-muted mb-3">Voice Waveform</p>
              <div className="flex items-end gap-1 h-16">
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-accent-gradient rounded-full"
                    animate={{ height: ["20%", `${30 + Math.random() * 70}%`, "20%"] }}
                    transition={{
                      duration: 0.8 + Math.random() * 0.4,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
            </GlassCard>
            <GlassCard>
              <p className="text-sm text-muted mb-3">File Upload Preview</p>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent-primary/10 border border-dashed border-accent-primary/30">
                <div className="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center text-lg">
                  📚
                </div>
                <div>
                  <p className="text-sm font-medium">Biology_Chapter3.pdf</p>
                  <p className="text-xs text-success">Analyzed • 24 pages</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
