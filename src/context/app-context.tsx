"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Locale, translations, TranslationKey } from "@/lib/i18n";

export interface GradeEntry {
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
  fullName: string;
  nickname: string;
  email: string;
  birthDate: string;
  grade: string;
}

interface StoredCredential {
  profile: UserProfile;
  password: string;
  progress: {
    xp: number;
    streak: number;
    lastActiveDate: string | null;
    grades: GradeEntry[];
    tasks: Task[];
    goals: Goal[];
    sessions: StudySession[];
    locale: Locale;
    theme: "light" | "dark";
  };
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
  addGrade: (grade: GradeEntry) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addSession: (session: StudySession) => void;
  userName: string;
  setUserName: (n: string) => void;
  isAuthenticated: boolean;
  authLoaded: boolean;
  login: (email: string, password: string) => boolean;
  loginAsGuest: () => void;
  signup: (profile: UserProfile, password: string) => boolean;
  logout: () => void;
  userProfile: UserProfile | null;
}

const AppContext = createContext<AppContextType | null>(null);
const STORAGE_KEY = "edupulse-auth";
const CREDENTIAL_KEY = "edupulse-user";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function computeStreak(prevDate: string | null | undefined, prevStreak: number) {
  const today = getToday();
  if (prevDate === today) {
    return { date: today, streak: Math.max(0, prevStreak) };
  }

  const yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);
  const yesterdayString = yesterday.toISOString().slice(0, 10);

  if (prevDate === yesterdayString) {
    return { date: today, streak: prevStreak + 1 };
  }

  return { date: today, streak: prevStreak > 0 ? 1 : 0 };
}

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

  useEffect(() => {
    if (typeof window === "undefined") {
      setAuthLoaded(true);
      return;
    }

    // Load theme from localStorage
    const savedTheme = (window.localStorage.getItem("edupulse-theme") as "light" | "dark") || "dark";
    setThemeState(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          userProfile: UserProfile;
          xp: number;
          streak: number;
          locale: Locale;
          lastActiveDate: string | null;
          grades: GradeEntry[];
          tasks: Task[];
          goals: Goal[];
          sessions: StudySession[];
          theme: "light" | "dark";
        };

        const { date, streak: updatedStreak } = computeStreak(parsed.lastActiveDate, parsed.streak);

        setUserProfile(parsed.userProfile);
        setUserName(parsed.userProfile.nickname || parsed.userProfile.fullName);
        setXp(parsed.xp ?? 0);
        setStreak(updatedStreak);
        setLocaleState(parsed.locale ?? "en");
        setThemeState(parsed.theme ?? "dark");
        setLastActiveDate(date);
        setGrades(parsed.grades ?? []);
        setTasks(parsed.tasks ?? []);
        setGoals(parsed.goals ?? []);
        setSessions(parsed.sessions ?? []);
        setIsAuthenticated(true);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setAuthLoaded(true);
  }, []);

  useEffect(() => {
    if (!authLoaded) return;

    if (isAuthenticated && userProfile) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          userProfile,
          xp,
          streak,
          locale,
          theme,
          lastActiveDate,
          grades,
          tasks,
          goals,
          sessions,
        })
      );
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [authLoaded, isAuthenticated, userProfile, xp, streak, locale, theme, lastActiveDate, grades, tasks, goals, sessions]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isAuthenticated && userProfile?.email !== "guest@edupulse.ai") {
      const stored = window.localStorage.getItem(CREDENTIAL_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as StoredCredential;
          if (userProfile && parsed.profile.email === userProfile.email) {
            window.localStorage.setItem(
              CREDENTIAL_KEY,
              JSON.stringify({
                ...parsed,
                progress: {
                  xp,
                  streak,
                  lastActiveDate,
                  grades,
                  locale,
                },
              })
            );
          }
        } catch {
          // ignore invalid credential file
        }
      }
    }
  }, [isAuthenticated, userProfile, xp, streak, lastActiveDate, grades, locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("edupulse-theme", theme);
  }, [theme]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
  }, []);

  const setTheme = useCallback((t: "light" | "dark") => {
    setThemeState(t);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key] ?? key,
    [locale]
  );

  const addXp = useCallback((amount: number) => {
    setXp((prev) => prev + amount);
  }, []);

  const addGrade = useCallback((grade: GradeEntry) => {
    setGrades((prev) => [...prev, grade]);
    setXp((prev) => prev + Math.max(5, Math.round(grade.score / 10)));
  }, []);

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const addGoal = useCallback((goal: Goal) => {
    setGoals((prev) => [...prev, goal]);
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  }, []);

  const addSession = useCallback((session: StudySession) => {
    setSessions((prev) => [...prev, session]);
    setXp((prev) => prev + Math.round(session.duration / 10));
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem(CREDENTIAL_KEY);
    if (!stored) return false;
    try {
      const parsed = JSON.parse(stored) as StoredCredential;
      if (parsed.profile.email === email.trim() && parsed.password === password) {
        const progress = parsed.progress ?? {
          xp: 0,
          streak: 0,
          lastActiveDate: null,
          grades: [],
          tasks: [],
          goals: [],
          sessions: [],
          locale: "en",
          theme: "dark",
        };

        const { date, streak: updatedStreak } = computeStreak(progress.lastActiveDate, progress.streak);

        setUserProfile(parsed.profile);
        setUserName(parsed.profile.nickname || parsed.profile.fullName);
        setXp(progress.xp ?? 0);
        setStreak(updatedStreak);
        setLocaleState(progress.locale ?? "en");
        setThemeState(progress.theme ?? "dark");
        setLastActiveDate(date);
        setGrades(progress.grades ?? []);
        setTasks(progress.tasks ?? []);
        setGoals(progress.goals ?? []);
        setSessions(progress.sessions ?? []);
        setIsAuthenticated(true);
        setShowOnboarding(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const loginAsGuest = useCallback(() => {
    const guestProfile: UserProfile = {
      fullName: "Guest Student",
      nickname: "Guest",
      email: "guest@edupulse.ai",
      birthDate: "",
      grade: "N/A",
    };

    setUserProfile(guestProfile);
    setUserName(guestProfile.nickname);
    setXp(0);
    setStreak(0);
    setLastActiveDate(null);
    setGrades([]);
    setIsAuthenticated(true);
    setShowOnboarding(true);
  }, []);

  const signup = useCallback((profile: UserProfile, password: string) => {
    if (typeof window === "undefined" || !profile.email || !password) return false;

    const progress = {
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      grades: [],
      tasks: [],
      goals: [],
      sessions: [],
      locale,
      theme,
    };

    window.localStorage.setItem(
      CREDENTIAL_KEY,
      JSON.stringify({ profile, password, progress })
    );

    setUserProfile(profile);
    setUserName(profile.nickname || profile.fullName);
    setXp(0);
    setStreak(0);
    setLastActiveDate(null);
    setGrades([]);
    setTasks([]);
    setGoals([]);
    setSessions([]);
    setIsAuthenticated(true);
    setShowOnboarding(true);
    return true;
  }, [locale, theme]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setUserName("Ahmed");
    setXp(0);
    setStreak(0);
    setLastActiveDate(null);
    setGrades([]);
    setShowOnboarding(false);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

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
        loginAsGuest,
        signup,
        logout,
        userProfile,
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
