"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User, Shield, Palette, Globe, Bell, Bot, Lock, LogOut,
  Moon, Sun, CheckCircle, AlertTriangle
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { 
    theme, setTheme, 
    locale, setLocale, 
    userProfile, updateProfileAndSettings, logout 
  } = useApp();
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "appearance" | "preferences">("profile");

  // Profile Form States
  const [fullName, setFullName] = useState(userProfile?.fullName || "");
  const [nickname, setNickname] = useState(userProfile?.nickname || "");
  const [birthDate, setBirthDate] = useState(userProfile?.birthDate || "");
  const [grade, setGrade] = useState(userProfile?.grade || "");

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // AI preference
  const [aiPersonality, setAiPersonality] = useState(userProfile?.aiPersonality || "Friendly Tutor");

  // Sync form with loaded profile
  useEffect(() => {
    if (!userProfile) return;
    setFullName(userProfile.fullName || "");
    setNickname(userProfile.nickname || "");
    setBirthDate(userProfile.birthDate || "");
    setGrade(userProfile.grade || "");
    setAiPersonality(userProfile.aiPersonality || "Friendly Tutor");
  }, [userProfile]);

  // Status Alerts
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);

  const showAlert = (msg: string, type: "success" | "error") => {
    setStatusMsg(msg);
    setStatusType(type);
    setTimeout(() => {
      setStatusMsg("");
      setStatusType("");
    }, 4000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await updateProfileAndSettings({
      fullName,
      nickname,
      birthDate,
      grade,
    });
    setLoading(false);
    if (success) {
      showAlert("Profile updated successfully!", "success");
    } else {
      showAlert("Failed to update profile. Please try again.", "error");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert("Please fill in all password fields.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert("New passwords do not match.", "error");
      return;
    }
    setLoading(true);
    const success = await updateProfileAndSettings({
      currentPassword,
      newPassword,
    });
    setLoading(false);
    if (success) {
      showAlert("Password updated successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      showAlert("Incorrect current password or update failed.", "error");
    }
  };

  const handleSavePreferences = async (personality: string) => {
    setLoading(true);
    const success = await updateProfileAndSettings({ aiPersonality: personality });
    setLoading(false);
    if (success) {
      setAiPersonality(personality);
      showAlert(`AI tutor personality updated to: ${personality}`, "success");
    } else {
      showAlert("Failed to update AI personality. Please try again.", "error");
    }
  };

  const handleLogout = async () => {
    logout();
    router.push("/login");
  };

  const menuItems = [
    { id: "profile" as const, label: "Profile", desc: "Name, nickname, school grade", icon: User },
    { id: "account" as const, label: "Security", desc: "Change account password", icon: Shield },
    { id: "appearance" as const, label: "Appearance", desc: "System theme & language", icon: Palette },
    { id: "preferences" as const, label: "AI Preferences", desc: "AI personality settings", icon: Bot },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold">Settings</h1>

      {statusMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 border ${
            statusType === "success" 
              ? "bg-success/15 border-success/30 text-success" 
              : "bg-danger/15 border-danger/30 text-danger"
          }`}
        >
          {statusType === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-sm font-medium">{statusMsg}</span>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="glass-card rounded-2xl p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition text-left ${
                  active ? "bg-accent-primary/20 text-accent-primary" : "hover:bg-white/5 text-muted hover:text-white"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? "bg-accent-primary/20" : "bg-white/5"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-muted/80">{item.desc}</p>
                </div>
              </button>
            );
          })}
          
          <div className="pt-4 border-t border-[var(--border)] mt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-3 rounded-xl text-danger hover:bg-danger/15 transition text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Logout</p>
                <p className="text-xs text-danger/80">End your session</p>
              </div>
            </button>
          </div>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 min-h-[400px]">
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-accent-primary" /> Profile Settings
              </h2>
              
              <div>
                <label className="text-xs text-muted block mb-1">Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">Nickname (Display Name)</label>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none"
                  placeholder="Johnny"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">Email (Unchangeable)</label>
                <input
                  value={userProfile?.email || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] text-muted cursor-not-allowed opacity-50 outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted block mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">School Grade</label>
                  <input
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none"
                    placeholder="Grade 11"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-primary hover:opacity-90 transition rounded-xl text-white font-semibold py-3 mt-4"
              >
                {loading ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </form>
          )}

          {activeTab === "account" && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-accent-primary" /> Security & Password
              </h2>

              {userProfile?.email === "guest@edupulse.ai" && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-xl text-warning text-xs">
                  Password changes are disabled for the guest sandbox account.
                </div>
              )}

              <div>
                <label className="text-xs text-muted block mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={userProfile?.email === "guest@edupulse.ai"}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={userProfile?.email === "guest@edupulse.ai"}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={userProfile?.email === "guest@edupulse.ai"}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] focus:border-accent-primary/50 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || userProfile?.email === "guest@edupulse.ai"}
                className="w-full bg-accent-primary hover:opacity-90 transition rounded-xl text-white font-semibold py-3 mt-4 disabled:opacity-50"
              >
                {loading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-accent-primary" /> Visual Preferences
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl glass border border-[var(--border)]">
                  <div>
                    <p className="font-semibold text-sm">Theme Settings</p>
                    <p className="text-xs text-muted">Switch between dark and light modes</p>
                  </div>
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-[var(--border)] hover:bg-white/10 text-sm transition"
                  >
                    {theme === "dark" ? <Moon className="w-4 h-4 text-warning" /> : <Sun className="w-4 h-4 text-yellow-500" />}
                    {theme === "dark" ? "Dark Mode" : "Light Mode"}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl glass border border-[var(--border)]">
                  <div>
                    <p className="font-semibold text-sm">System Language</p>
                    <p className="text-xs text-muted">اختر لغة واجهة المستخدم المفضلة لديك</p>
                  </div>
                  <button
                    onClick={() => setLocale(locale === "en" ? "ar" : "en")}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-[var(--border)] hover:bg-white/10 text-sm font-semibold transition"
                  >
                    {locale === "en" ? "العربية (RTL)" : "English (LTR)"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-accent-primary" /> AI Companion Tutor
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted block mb-1">AI Tutor Personality</label>
                  <select
                    value={aiPersonality}
                    onChange={(e) => handleSavePreferences(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-[var(--border)] focus:border-accent-primary/50 outline-none text-white text-sm"
                  >
                    <option value="Friendly Tutor">Friendly Tutor (Explains with encouraging, step-by-step guidance)</option>
                    <option value="Strict Coach">Strict Coach (Focuses heavily on core rules and drills)</option>
                    <option value="Calm Mentor">Calm Mentor (Philosophical, relaxing explanation style)</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-accent-primary/5 border border-accent-primary/20 text-xs text-muted leading-relaxed">
                  The selected AI personality alters the system instruction headers sent to Google Gemini, changing how your smart tutor responds to questions, summaries, and quizzes.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
