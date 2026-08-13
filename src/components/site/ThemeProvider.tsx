"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("mfb-theme") as Theme | null;

    if (saved === "dark" || saved === "light") {
      setTheme(saved);
    } else {
      // Determine initial theme based on system preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setTheme(mediaQuery.matches ? "dark" : "light");

      // Listen for system theme changes if no explicit user preference is set
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem("mfb-theme")) {
          setTheme(e.matches ? "dark" : "light");
        }
      };

      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggle = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("mfb-theme", nextTheme);
  };

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
