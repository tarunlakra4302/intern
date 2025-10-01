import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// Available DaisyUI themes
const AVAILABLE_THEMES = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter'
];

export function ThemeProvider({ children, defaultTheme = "light" }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return AVAILABLE_THEMES.includes(savedTheme) ? savedTheme : defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme classes
    AVAILABLE_THEMES.forEach(themeName => {
      root.classList.remove(themeName);
    });

    // Add current theme
    root.classList.add(theme);
    root.setAttribute("data-theme", theme);

    // Update localStorage
    localStorage.setItem("theme", theme);

    // Update CSS custom properties for better integration
    const isDark = ['dark', 'synthwave', 'halloween', 'forest', 'black', 'luxury', 'dracula', 'night', 'coffee'].includes(theme);
    root.classList.toggle('dark', isDark);

  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setThemeByName = (themeName) => {
    if (AVAILABLE_THEMES.includes(themeName)) {
      setTheme(themeName);
    }
  };

  const value = {
    theme,
    setTheme: setThemeByName,
    toggleTheme,
    themes: AVAILABLE_THEMES,
    isDark: ['dark', 'synthwave', 'halloween', 'forest', 'black', 'luxury', 'dracula', 'night', 'coffee'].includes(theme)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}