"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Locale, translations, TranslationKey } from "@/lib/i18n";

export interface GradeEntry {
  id?: string;
  subject: string;
  score: number;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  subject: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  targetGrade: number;
  subject: string;
  deadline: string;
  progress: number;
  createdAt: string;
}

export interface StudySession {
  id: string;
  subject: string;
  duration: number; // in minutes
  date: string;
  focusLevel: number; // 0-100
}

export interface UserProfile {
  id?: string;
  fullName: string;
  nickname: string;
  email: string;
  birthDate: string;
  grade: string;
  role?: string;
  xp?: number;
  streak?: number;
  theme?: "light" | "dark";
  locale?: Locale;
  aiPersonality?: string;
}

interface AppContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  xp: number;
  streak: number;
  level: number;
  lastActiveDate: string | null;
  grades: GradeEntry[];
  tasks: Task[];
  goals: Goal[];
  sessions: StudySession[];
  showOnboarding: boolean;
  setShowOnboarding: (v: boolean) => void;
  addXp: (amount: number) => void;
  addGrade: (grade: GradeEntry) => Promise<boolean>;
  addTask: (task: Omit<Task, "id" | "createdAt" | "completed">) => Promise<boolean>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "progress">) => Promise<boolean>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<boolean>;
  deleteGoal: (id: string) => Promise<boolean>;
  addSession: (session: Omit<StudySession, "id">) => Promise<boolean>;
  userName: string;
  setUserName: (n: string) => void;
  isAuthenticated: boolean;
  authLoaded: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  googleLogin: (idToken: string) => Promise<boolean>;
  signup: (profile: UserProfile, password: string) => Promise<boolean>;
  logout: () => void;
  userProfile: UserProfile | null;
  updateProfileAndSettings: (updates: Partial<UserProfile> & { currentPassword?: string; newPassword?: string }) => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [theme, setThemeState] = useState<"light" | "dark">("dark");
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userName, setUserName] = useState("Ahmed");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);

  const level = Math.floor(xp / 500) + 1;

  // 1. Fetch current authenticated session on mount
  const refreshUserData = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUserProfile(data.user);
          setUserName(data.user.nickname || data.user.fullName);
          setXp(data.user.xp ?? 0);
          setStreak(data.user.streak ?? 0);
          setLocaleState(data.user.locale ?? "en");
          setThemeState(data.user.theme ?? "dark");
          
          // Set direction & html attributes
          document.documentElement.lang = data.user.locale ?? "en";
          document.documentElement.dir = (data.user.locale ?? "en") === "ar" ? "rtl" : "ltr";
          document.documentElement.setAttribute("data-theme", data.user.theme ?? "dark");

          // Bind progress lists
          setGrades(data.progress.grades ?? []);
          setTasks(data.progress.tasks ?? []);
          setGoals(data.progress.goals ?? []);
          setSessions(data.progress.sessions ?? []);
          setIsAuthenticated(true);
        }
      }
    } catch (err) {
      console.error("Failed to load user session:", err);
    } finally {
      setAuthLoaded(true);
    }
  }, []);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  // Handle local document directions on locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  // Handle theme classes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setLocale = useCallback(async (l: Locale) => {
    setLocaleState(l);
    if (isAuthenticated && userProfile) {
      try {
        await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale: l }),
        });
      } catch (err) {
        console.error("Failed to save locale:", err);
      }
    }
  }, [isAuthenticated, userProfile]);

  const setTheme = useCallback(async (t: "light" | "dark") => {
    setThemeState(t);
    if (isAuthenticated && userProfile) {
      try {
        await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: t }),
        });
      } catch (err) {
        console.error("Failed to save theme:", err);
      }
    }
  }, [isAuthenticated, userProfile]);

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key] ?? key,
    [locale]
  );

  const addXp = useCallback(async (amount: number) => {
    setXp((prev) => prev + amount);
    if (isAuthenticated && userProfile?.email !== "guest@edupulse.ai") {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: xp + amount }),
      });
    }
  }, [isAuthenticated, userProfile, xp]);

  // 2. Database Sync Helper Functions
  const addGrade = useCallback(async (grade: GradeEntry) => {
    if (!isAuthenticated) {
      console.warn("Not authenticated - cannot add grade");
      return false;
    }

    try {
      const res = await fetch("/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grade),
      });
      if (res.ok) {
        const newGrade = await res.json();
        setGrades((prev) => [...prev, newGrade]);
        // XP is calculated server-side, refetch user data to get updated XP
        await refreshUserData();
        return true;
      }
    } catch (err) {
      console.error("Failed to add grade:", err);
    }
    return false;
  }, [isAuthenticated, refreshUserData]);

  const addTask = useCallback(async (task: Omit<Task, "id" | "createdAt" | "completed">) => {
    if (!isAuthenticated) {
      console.warn("Not authenticated - cannot add task");
      return false;
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks((prev) => [newTask, ...prev]);
        return true;
      }
    } catch (err) {
      console.error("Failed to add task:", err);
    }
    return false;
  }, [isAuthenticated]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    if (!isAuthenticated) {
      console.warn("Not authenticated - cannot update task");
      return false;
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updated : task))
        );
        return true;
      }
    } catch (err) {
      console.error("Failed to update task:", err);
    }
    return false;
  }, [isAuthenticated]);

  const deleteTask = useCallback(async (id: string) => {
    if (!isAuthenticated) {
      console.warn("Not authenticated - cannot delete task");
      return false;
    }

    try {
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
        return true;
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
    return false;
  }, [isAuthenticated]);

  const addGoal = useCallback(async (goal: Omit<Goal, "id" | "createdAt" | "progress">) => {
    if (!isAuthenticated) {
      console.warn("Not authenticated - cannot add goal");
      return false;
    }

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goal),
      });
      if (res.ok) {
        const newGoal = await res.json();
        setGoals((prev) => [newGoal, ...prev]);
        return true;
      }
    } catch (err) {
      console.error("Failed to add goal:", err);
    }
    return false;
  }, [isAuthenticated]);

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    if (!isAuthenticated) {
      console.warn("Not authenticated - cannot update goal");
      return false;
    }

    try {
      const res = await fetch("/api/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        const updated = await res.json();
        setGoals((prev) =>
          prev.map((goal) => (goal.id === id ? updated : goal))
        );
        return true;
      }
    } catch (err) {
      console.error("Failed to update goal:", err);
    }
    return false;
  }, [isAuthenticated]);

  const deleteGoal = useCallback(async (id: string) => {
    if (!isAuthenticated) {
      console.warn("Not authenticated - cannot delete goal");
      return false;
    }

    try {
      const res = await fetch(`/api/goals?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setGoals((prev) => prev.filter((goal) => goal.id !== id));
        return true;
      }
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
    return false;
  }, [isAuthenticated]);

  const addSession = useCallback(async (session: Omit<StudySession, "id">) => {
    if (!isAuthenticated) {
      console.warn("Not authenticated - cannot add study session");
      return false;
    }

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      });
      if (res.ok) {
        const newSession = await res.json();
        setSessions((prev) => [newSession, ...prev]);
        // Refetch user data to get updated XP
        await refreshUserData();
        return true;
      }
    } catch (err) {
      console.error("Failed to add session:", err);
    }
    return false;
  }, [isAuthenticated, refreshUserData]);

  // 3. User Authentication Sync Functions
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (res.ok) {
        await refreshUserData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  }, [refreshUserData]);

  const googleLogin = useCallback(async (idToken: string) => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      
      if (res.ok) {
        await refreshUserData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  }, [refreshUserData]);

  const loginAsGuest = useCallback(() => {
    console.warn("Guest login is no longer supported - use email/password or Google OAuth");
    return;
  }, []);

  const signup = useCallback(async (profile: UserProfile, password: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, password }),
      });
      
      if (res.ok) {
        await refreshUserData();
        return true;
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
    return false;
  }, [refreshUserData]);

  const updateProfileAndSettings = useCallback(async (updates: Partial<UserProfile> & { currentPassword?: string; newPassword?: string }) => {
    if (!isAuthenticated) {
      console.warn("Not authenticated - cannot update profile");
      return false;
    }

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUserProfile(data.user);
          setUserName(data.user.nickname || data.user.fullName);
          setThemeState(data.user.theme);
          setLocaleState(data.user.locale);
          return true;
        }
      }
    } catch (err) {
      console.error("Profile update error:", err);
    }
    return false;
  }, [isAuthenticated]);

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        t,
        theme,
        setTheme,
        xp,
        streak,
        level,
        lastActiveDate,
        grades,
        tasks,
        goals,
        sessions,
        showOnboarding,
        setShowOnboarding,
        addXp,
        addGrade,
        addTask,
        updateTask,
        deleteTask,
        addGoal,
        updateGoal,
        deleteGoal,
        addSession,
        userName,
        setUserName,
        isAuthenticated,
        authLoaded,
        login,
        googleLogin,
        loginAsGuest,
        signup,
        logout,
        userProfile,
        updateProfileAndSettings,
        refreshUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
