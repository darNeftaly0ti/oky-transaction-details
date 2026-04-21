import { useState, useEffect } from "react";

const isBrowser = typeof window !== "undefined";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;
    const stored = localStorage.getItem("oky-dark-mode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored !== null ? stored === "true" : prefersDark;
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleDark = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (isBrowser) {
        localStorage.setItem("oky-dark-mode", String(next));
        document.documentElement.classList.toggle("dark", next);
      }
      return next;
    });
  };

  return { isDark, toggleDark };
}

export default useDarkMode;
