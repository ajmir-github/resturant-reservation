import { useState } from "react";
import { THEMES } from "../utils";

function getLocalTheme(defaultTheme) {
  return localStorage.getItem("theme-index") || defaultTheme;
}
function setLocalTheme(index) {
  localStorage.setItem("theme-index", index);
}
export function useThemes(defaultTheme = 0) {
  const [themeIndex, setThemeIndex] = useState(getLocalTheme(defaultTheme));
  const setTheme = (index) => {
    setThemeIndex(index);
    setLocalTheme(index);
  };
  const toggleTheme = (props) => {
    console.log(props);
    if (!THEMES[themeIndex + 1]) return setTheme(defaultTheme);
    setTheme(themeIndex + 1);
  };

  return [THEMES[themeIndex], toggleTheme];
}
