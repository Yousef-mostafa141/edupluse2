"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Locale, translations, TranslationKey } from "@/lib/i18n";

export interface UserProfile {
  fullName: string;
  nickname: string;
  email: string;
  birthDate: string;
  grade: string;
}

interface AppContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
  xp: number;
  streak: number;
  level: number;
  showOnboarding: boolean;
  setShowOnboarding: (v: boolean) => void;
  addXp: (amount: number) => void;
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [xp, setXp] = useState(1250);
  const [streak, setStreak] = useState(7);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userName, setUserName] = useState("Ahmed");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const level = Math.floor(xp / 500) + 1;

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          userProfile: UserProfile;
          xp: number;
          streak: number;
          locale: Locale;
        };
        setUserProfile(parsed.userProfile);
        setUserName(parsed.userProfile.nickname || parsed.userProfile.fullName);
        setXp(parsed.xp ?? 1250);
        setStreak(parsed.streak ?? 7);
        setLocaleState(parsed.locale ?? "en");
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
        JSON.stringify({ userProfile, xp, streak, locale })
      );
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [authLoaded, isAuthenticated, userProfile, xp, streak, locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key] ?? key,
    [locale]
  );

  const addXp = useCallback((amount: number) => {
    setXp((prev) => prev + amount);
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem(CREDENTIAL_KEY);
    if (!stored) return false;
    try {
      const parsed = JSON.parse(stored) as { profile: UserProfile; password: string };
      if (parsed.profile.email === email.trim() && parsed.password === password) {
        setUserProfile(parsed.profile);
        setUserName(parsed.profile.nickname || parsed.profile.fullName);
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
    setIsAuthenticated(true);
    setShowOnboarding(true);
  }, []);

  const signup = useCallback((profile: UserProfile, password: string) => {
    if (typeof window === "undefined" || !profile.email || !password) return false;
    window.localStorage.setItem(
      CREDENTIAL_KEY,
      JSON.stringify({ profile, password })
    );
    setUserProfile(profile);
    setUserName(profile.nickname || profile.fullName);
    setIsAuthenticated(true);
    setShowOnboarding(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setUserName("Ahmed");
    setXp(1250);
    setStreak(7);
    setShowOnboarding(false);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        t,
        xp,
        streak,
        level,
        showOnboarding,
        setShowOnboarding,
        addXp,
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
