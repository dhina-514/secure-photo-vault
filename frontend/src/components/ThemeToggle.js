// frontend/src/components/ThemeToggle.js
import React, { useEffect, useState } from "react";

function ThemeToggle() {
  // initial theme from localStorage or default "dark"
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    // 1. persist theme
    localStorage.setItem("theme", theme);

    // 2. set data-theme on <html> so [data-theme="..."] CSS works
    const root = document.documentElement; // <html>
    root.setAttribute("data-theme", theme);

    // 3. (optional) keep body class in sync for any legacy styles
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      type="button"
      className="btn btn-outline-secondary btn-sm"
      onClick={toggle}
    >
      {theme === "dark" ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}

export default ThemeToggle;
