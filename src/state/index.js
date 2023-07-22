// Imports
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { settingsActions, settingsReducer } from "./settingsReducer";

// Export Actions
export { settingsActions };

// Reducers
const reducers = {
  settings: settingsReducer,
};

// Store
const store = configureStore({
  reducer: combineReducers(reducers),
});

// inital state

// StoreProvider
export function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
