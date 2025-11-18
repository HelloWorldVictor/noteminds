import { createContext, useContext, useEffect, useState } from "react";
import { themeStorage } from "@/lib/auth-storage";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  contentScript?: boolean;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  contentScript = false,
  defaultTheme = "system",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from browser storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await themeStorage.getValue();
        setTheme(storedTheme || defaultTheme);
      } catch (error) {
        console.error("Failed to load theme from storage:", error);
        setTheme(defaultTheme);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, [defaultTheme]);

  // Watch for theme changes from other contexts (popup, content script, etc.)
  useEffect(() => {
    const unwatch = themeStorage.watch((newTheme: Theme | null) => {
      if (newTheme && newTheme !== theme) {
        setTheme(newTheme);
      }
    });

    return unwatch;
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    if (!isLoaded) return; // Don't apply theme until loaded from storage

    const root = contentScript
      ? document
          .querySelector("noteminds-ui[data-wxt-shadow-root]")
          ?.shadowRoot?.querySelector("html")!
      : window.document.documentElement;
    console.log("Applying theme:", theme, root);
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme, isLoaded]);

  const handleSetTheme = async (newTheme: Theme) => {
    try {
      await themeStorage.setValue(newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error("Failed to save theme to storage:", error);
    }
  };

  const value = {
    theme,
    setTheme: handleSetTheme,
  };

  // Don't render children until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
