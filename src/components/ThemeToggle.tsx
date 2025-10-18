import { useEffect, useState } from "react";

const THEME_KEY = "theme"; // 'light' | 'dark'

function getInitialTheme(): "light" | "dark" {
  const saved = localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const next = theme === "light" ? "dark" : "light";

  return (
    <button
      className="icon-btn"
      aria-label={`Switch to ${next} mode`}
      onClick={() => setTheme(next)}
      title={`Switch to ${next} mode`}
    >
      <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>
        {theme === "light" ? "D" : "L"}
      </span>
    </button>
  );
}
