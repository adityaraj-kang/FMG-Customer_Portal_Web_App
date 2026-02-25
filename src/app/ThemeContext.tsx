import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "dc-color-theme";

interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: true,
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialise from localStorage, default to dark
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) return saved === "dark";
    } catch { /* localStorage unavailable */ }
    return true;
  });

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    } catch { /* localStorage unavailable */ }
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((v) => !v), []);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
