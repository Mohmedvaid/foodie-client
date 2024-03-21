// frontend/src/hooks/useSystemTheme.jsx

import { useEffect, useState } from "react";

const useSystemTheme = () => {
  const [theme, setTheme] = useState("light"); // Default theme is light

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Update theme based on system preference
    const handleThemeChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    // Listen for changes
    mediaQuery.addEventListener("change", handleThemeChange);

    // Set initial theme based on system preference
    handleThemeChange(mediaQuery);

    // Cleanup listener on component unmount
    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  return theme;
};

export default useSystemTheme;
