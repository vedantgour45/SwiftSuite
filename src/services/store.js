import { configureStore, createSlice } from "@reduxjs/toolkit";
import { articleApi } from "./article";

const uiSlice = createSlice({
  name: "ui",
  initialState: { darkMode: false }, // Default back to light mode as requested
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { toggleDarkMode } = uiSlice.actions;

export const store = configureStore({
  reducer: {
    [articleApi.reducerPath]: articleApi.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(articleApi.middleware),
});
