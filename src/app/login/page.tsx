"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail } from "lucide-react";
import { Particles } from "@/components/ui/particles";
import { AIOrb } from "@/components/ui/ai-orb";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";

export default function LoginPage() {
  const { t, login, loginAsGuest, isAuthenticated, authLoaded } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoaded && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [authLoaded, isAuthenticated, router]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const success = login(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Login failed. Please check your email and password.");
    }
  };

  const handleGoogle = () => {
    loginAsGuest();
    router.push("/dashboard");
  };

  const handleGuest = () => {
    loginAsGuest();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center neural-bg overflow-hidden">
        <Particles count={30} />
        <div className="relative z-10 text-center px-12">
          <AIOrb size="lg" />
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-xl font-display italic text-muted"
          >
            &ldquo;Every great journey begins with a single step toward knowledge.&rdquo;
          </motion.blockquote>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-surface-bg">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md glass-card p-8 rounded-3xl"
        >
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold">{t("login")}</h1>
          </div>

          <div className="space-y-3 mb-6">
            <Button variant="secondary" className="w-full" onClick={handleGoogle}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t("continueGoogle")}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleGuest}>
              {t("continueGuest")}
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs text-muted">
              <span className="px-2 bg-[var(--bg-card)]">{t("emailLogin")}</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="text-sm text-muted mb-1 block">{t("email")}</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none transition-colors"
                placeholder="student@school.edu"
              />
            </div>
            <div>
              <label className="text-sm text-muted mb-1 block">{t("password")}</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none transition-colors"
              />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" className="w-full">
              <Mail className="w-4 h-4" />
              {t("login")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent-primary hover:underline">
              {t("signup")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
