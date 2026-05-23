"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Particles } from "@/components/ui/particles";
import { AIOrb } from "@/components/ui/ai-orb";
import { Button } from "@/components/ui/button";
import { useApp, UserProfile } from "@/context/app-context";

export default function SignupPage() {
  const { t, signup } = useApp();
  const router = useRouter();
  const [isGoogle, setIsGoogle] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    birthDate: "",
    grade: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsGoogle(params.get("method") === "google");
    }
  }, []);
  const [error, setError] = useState("");

  const handleChange = (key: keyof UserProfile | "password") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.nickname ||
      !formData.birthDate ||
      !formData.grade ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please complete every field before continuing.");
      return;
    }

    const success = signup(
      {
        fullName: formData.fullName,
        nickname: formData.nickname,
        birthDate: formData.birthDate,
        grade: formData.grade,
        email: formData.email,
      },
      formData.password
    );

    if (success) {
      router.push("/dashboard");
    } else {
      setError("Unable to create account. Please try again.");
    }
  };

  const fields = [
    { key: "fullName" as const, type: "text" },
    { key: "nickname" as const, type: "text" },
    { key: "birthDate" as const, type: "date" },
    { key: "grade" as const, type: "text" },
    { key: "email" as const, type: "email" },
    { key: "password" as const, type: "password" },
  ];

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center neural-bg overflow-hidden">
        <Particles count={30} />
        <AIOrb size="lg" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-surface-bg overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md glass-card p-8 rounded-3xl my-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">{isGoogle ? "Google account setup" : t("signup")}</h1>
              {isGoogle && (
                <p className="text-sm text-muted mt-1">
                  Continue with Google by entering your name, birth date, email, and a password.
                </p>
              )}
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSignup}>
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-sm text-muted mb-1 block">{t(f.key)}</label>
                <input
                  value={formData[f.key]}
                  onChange={handleChange(f.key)}
                  type={f.type}
                  placeholder={f.type === "email" ? "yourname@gmail.com" : undefined}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none transition-colors"
                />
              </div>
            ))}
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" className="w-full mt-2">
              {t("getStarted")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-accent-primary hover:underline">
              {t("login")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
