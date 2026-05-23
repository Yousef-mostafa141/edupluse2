"use client";

import { motion } from "framer-motion";
import { Search, Bell, Flame, Menu, LogOut } from "lucide-react";
import { useApp } from "@/context/app-context";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { t, xp, streak, level, userName, logout } = useApp();

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-[var(--border)] glass sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative flex-1 max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder={t("search")}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-[var(--border)] text-sm focus:outline-none focus:border-accent-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-4">
        <motion.div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent-primary/10 border border-accent-primary/20"
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-xs text-accent-primary font-bold">LVL {level}</span>
          <div className="w-16 h-1.5 rounded-full bg-surface-card overflow-hidden">
            <motion.div
              className="h-full bg-accent-gradient"
              initial={{ width: 0 }}
              animate={{ width: `${(xp % 500) / 5}%` }}
            />
          </div>
          <span className="text-xs text-muted">{xp} XP</span>
        </motion.div>

        <motion.div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warning/10 border border-warning/20"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Flame className="w-4 h-4 text-warning fire-animate" />
          <span className="text-sm font-bold text-warning">{streak}</span>
        </motion.div>

        <motion.button
          className="relative p-2 rounded-xl hover:bg-white/5"
          whileHover={{ scale: 1.05 }}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
        </motion.button>

        <button
          onClick={logout}
          className="p-2 rounded-xl hover:bg-white/5"
          title={t("logout")}
        >
          <LogOut className="w-5 h-5" />
        </button>

        <div className="w-9 h-9 rounded-full bg-accent-gradient flex items-center justify-center text-sm font-bold">
          {userName[0]}
        </div>
      </div>
    </header>
  );
}
