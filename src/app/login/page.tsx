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
    router.push("/signup?method=google");
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
              <span className="inline-flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {t("continueGoogle")}
              </span>
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
