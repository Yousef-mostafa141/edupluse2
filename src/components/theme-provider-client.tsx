"use client";

import React from "react";
import { ThemeProvider } from "next-themes";

export default function ThemeProviderClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem
      storageKey="edupulse-theme"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
