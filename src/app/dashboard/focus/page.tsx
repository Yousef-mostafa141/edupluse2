"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function FocusPage() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          setRunning(false);
          return;
        }
        setMinutes((m) => m - 1);
        setSeconds(59);
      } else {
        setSeconds((s) => s - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [running, minutes, seconds]);

  const reset = () => {
    setRunning(false);
    setMinutes(25);
    setSeconds(0);
  };

  const progress = ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] relative">
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 30% 50%, #6C63FF33, transparent)",
            "radial-gradient(circle at 70% 50%, #00D4FF33, transparent)",
            "radial-gradient(circle at 30% 50%, #6C63FF33, transparent)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <p className="text-sm text-muted mb-2 z-10">🎧 LoFi Focus Mode</p>

      <div className="relative z-10 mb-8">
        <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1B2540" strokeWidth="2" />
          <motion.circle
            cx="50" cy="50" r="45" fill="none"
            stroke="url(#focusGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.83} 283`}
          />
          <defs>
            <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6C63FF" />
              <stop offset="100%" stopColor="#00D4FF" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-display font-bold tabular-nums">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-sm text-muted mt-1">Pomodoro</span>
        </div>
      </div>

      <div className="flex gap-4 z-10">
        <motion.button
          onClick={() => setRunning(!running)}
          className="w-16 h-16 rounded-full bg-accent-gradient flex items-center justify-center shadow-glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {running ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </motion.button>
        <button
          onClick={reset}
          className="w-16 h-16 rounded-full glass flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-3 mt-8 z-10">
        {[15, 25, 45].map((m) => (
          <button
            key={m}
            onClick={() => { reset(); setMinutes(m); }}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              minutes === m && !running ? "bg-accent-primary/20 text-accent-primary" : "glass text-muted"
            }`}
          >
            {m} min
          </button>
        ))}
      </div>
    </div>
  );
}
