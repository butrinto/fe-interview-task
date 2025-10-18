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

  const iconSrc = theme === "light" ? "/moon-dark.svg" : "/sun-light.svg";
  const altText =
    theme === "light" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      className="icon-btn"
      aria-label={altText}
      onClick={() => setTheme(next)}
      title={altText}
    >
      <img
        src={iconSrc}
        alt=""
        aria-hidden="true"
        style={{ width: 22, height: 22 }}
      />
    </button>
  );
}
