import { useState } from "react";

function getLocalTheme(defaultTheme) {
  return localStorage.getItem("theme-dark") || defaultTheme;
}
function setLocalTheme(index) {
  localStorage.setItem("theme-dark", index);
}
export function useThemes(defaultTheme = false) {
  const [theme, setTheme] = useState(getLocalTheme(defaultTheme));

  const toggleTheme = (e) => {
    const darkMode = e.target.checked;
    setLocalTheme(darkMode);
    setTheme(darkMode ? "dark" : "light");
  };

  return [theme, toggleTheme];
}
