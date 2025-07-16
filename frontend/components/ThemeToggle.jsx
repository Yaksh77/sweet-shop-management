import { useEffect, useState } from "react";

export default function ToggleTheme() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.body;
    if (isDark) {
      root.classList.add("dark-theme");
      root.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button onClick={() => setIsDark(!isDark)} className="theme-toggle-btn">
      {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
