"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Globe, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";

export function Navbar() {
  const { t, locale, setLocale } = useApp();
  const { theme, setTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-accent-gradient flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold hidden sm:block">EduPulse AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted">
          <a href="#features" className="hover:text-white transition-colors">{t("features")}</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">{t("howItWorks")}</a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="p-2 rounded-xl hover:bg-white/5 flex items-center gap-1 text-sm"
          >
            <Globe className="w-4 h-4" />
            {locale === "en" ? "AR" : "EN"}
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl hover:bg-white/5"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Button href="/login" variant="ghost" size="sm">{t("login")}</Button>
          <Button href="/signup" size="sm">{t("getStarted")}</Button>
        </div>
      </div>
    </motion.nav>
  );
}
