"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Shield, Palette, Globe, Bell, Bot, Lock, Accessibility, Info, LogOut,
  ChevronRight, Moon, Sun,
} from "lucide-react";
import { useApp } from "@/context/app-context";

const sections = [
  { icon: User, label: "Profile", desc: "Name, avatar, nickname" },
  { icon: Shield, label: "Account", desc: "Email, password, security" },
  { icon: Palette, label: "Appearance", desc: "Theme, colors, display" },
  { icon: Globe, label: "Language", desc: "Arabic / English" },
  { icon: Bell, label: "Notifications", desc: "Alerts and reminders" },
  { icon: Bot, label: "AI Preferences", desc: "Personality, voice settings" },
  { icon: Lock, label: "Privacy", desc: "Data and permissions" },
  { icon: Accessibility, label: "Accessibility", desc: "Font size, contrast" },
  { icon: Info, label: "About", desc: "Version, support, legal" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, userName, setUserName, grades, addGrade, userProfile } = useApp();
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");
  const [message, setMessage] = useState("");

  const handleAddGrade = () => {
    const scoreValue = Number(score);
    if (!subject.trim() || !score.trim() || Number.isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
      setMessage("Enter a valid subject and score between 0 and 100.");
      return;
    }

    addGrade({ subject: subject.trim(), score: scoreValue, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) });
    setSubject("");
    setScore("");
    setMessage("Grade added successfully.");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold">Settings</h1>

      <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-accent-gradient flex items-center justify-center text-2xl font-bold">
          {userName[0]}
        </div>
        <div className="flex-1">
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="font-bold text-lg bg-transparent outline-none border-b border-transparent focus:border-accent-primary/50 w-full"
          />
          <p className="text-sm text-muted">{userProfile?.grade || "Grade not set"} • Level {Math.max(1, Math.floor((grades.length * 2 + 1) / 5))}</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold">Add Grade</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] outline-none"
          />
          <input
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="Score (0-100)"
            type="number"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] outline-none"
          />
        </div>
        <button
          onClick={handleAddGrade}
          className="w-full rounded-2xl bg-accent-primary px-4 py-3 text-white font-semibold hover:opacity-90 transition"
        >
          Save Grade
        </button>
        {message && <p className="text-sm text-muted">{message}</p>}
        {grades.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Recent Grades</p>
            <div className="grid gap-2">
              {grades.slice(-4).reverse().map((grade, index) => (
                <div key={`${grade.subject}-${index}`} className="glass-card p-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-medium">{grade.subject}</p>
                    <p className="text-xs text-muted">{grade.date}</p>
                  </div>
                  <span className="text-sm font-bold">{grade.score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden divide-y divide-[var(--border)]">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={s.label}
              className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left"
              whileHover={{ x: 4 }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Icon className="w-5 h-5 text-muted" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{s.label}</p>
                <p className="text-xs text-muted">{s.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted" />
            </motion.button>
          );
        })}
      </div>

      <div className="glass-card rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Dark / Light Mode</span>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass text-sm"
          >
            {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {theme === "dark" ? "Dark" : "Light"}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Language</span>
          <button
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="px-3 py-1.5 rounded-xl glass text-sm"
          >
            {locale === "en" ? "English" : "العربية"}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">AI Personality</span>
          <select className="px-3 py-1.5 rounded-xl glass text-sm bg-transparent outline-none">
            <option>Friendly Tutor</option>
            <option>Strict Coach</option>
            <option>Calm Mentor</option>
          </select>
        </div>
        {["Study reminders", "Streak alerts", "Mood check-ins"].map((n) => (
          <div key={n} className="flex items-center justify-between">
            <span className="text-sm">{n}</span>
            <div className="w-10 h-6 rounded-full bg-accent-primary relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-danger hover:bg-danger/10 transition-colors">
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}
