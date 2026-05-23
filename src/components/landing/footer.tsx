"use client";

import Link from "next/link";
import { Sparkles, Twitter, Github, Linkedin, Mail } from "lucide-react";
import { useApp } from "@/context/app-context";

export function Footer() {
  const { t } = useApp();

  return (
    <footer className="border-t border-[var(--border)] py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold">EduPulse AI</span>
        </div>

        <div className="flex gap-6 text-sm text-muted">
          <Link href="#" className="hover:text-white transition-colors">{t("footerAbout")}</Link>
          <Link href="#" className="hover:text-white transition-colors">{t("footerContact")}</Link>
          <Link href="#" className="hover:text-white transition-colors">{t("footerPrivacy")}</Link>
          <Link href="#" className="hover:text-white transition-colors">{t("footerTerms")}</Link>
        </div>

        <div className="flex gap-4">
          {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
            <Link
              key={i}
              href="#"
              className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:border-accent-primary/50 transition-all hover:shadow-glow"
            >
              <Icon className="w-4 h-4" />
            </Link>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-muted mt-8">
        © 2026 EduPulse AI. All rights reserved.
      </p>
    </footer>
  );
}
