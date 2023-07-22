function getLocalTheme(defaultTheme) {
  return localStorage.getItem("theme-dark") || defaultTheme;
}
function setLocalTheme(theme) {
  localStorage.setItem("theme-dark", theme);
}

export const initialSettings = {
  theme: getLocalTheme("light"),
  expiresIn: 5,
  notifyBefore: -15,
};

export const settingsActions = {
  turnLightTheme: "TURN_LIGHT_THEME",
  turnDarkTheme: "TURN_DARK_THEME",
  setNotifyBefore: "SET_NOTIFY_BEFORE",
  setExpiresIn: "SET_EXPIRES_IN",
};

export function settingsReducer(state = initialSettings, { type, payload }) {
  switch (type) {
    // THEME
    case settingsActions.turnDarkTheme:
      setLocalTheme("dark");
      return { ...state, theme: "dark" };

    case settingsActions.turnLightTheme:
      setLocalTheme("light");
      return { ...state, theme: "light" };

    // GLOBAL
    case settingsActions.setExpiresIn:
      return { ...state, expiresIn: payload };

    case settingsActions.setNotifyBefore:
      return { ...state, notifyBefore: payload };

    default:
      return state;
  }
}
