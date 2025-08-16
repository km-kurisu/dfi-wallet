"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // undefined while initializing to avoid wrong icon during SSR/hydration
  const [isDark, setIsDark] = useState(undefined);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldUseDark = saved === "dark" ? true : saved === "light" ? false : prefersDark;

      if (shouldUseDark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");

      setIsDark(shouldUseDark);
    } catch (e) {
      // In case of any error, default to light
      setIsDark(false);
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    if (next) {
      document.documentElement.classList.add("dark");
      try { localStorage.setItem("theme", "dark"); } catch(e) {}
    } else {
      document.documentElement.classList.remove("dark");
      try { localStorage.setItem("theme", "light"); } catch(e) {}
    }
    setIsDark(next);
  // Remove debug console
  };

  // Stable Tailwind-styled button. Icon indicates current mode (moon = dark, sun = light)
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!!isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1"
    >
      {/* show sun when dark (so clicking will switch to light), moon when light */}
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1.5M12 19.5V21M4.219 4.219l1.061 1.061M17.657 17.657l1.061 1.061M3 12h1.5M19.5 12H21M4.219 19.781l1.061-1.061M17.657 6.343l1.061-1.061" />
          <circle cx="12" cy="12" r="3.5" strokeWidth="1.5" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
      )}
      <span className="text-sm">Dark Mode</span>
    </button>
  );
}
