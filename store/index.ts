import { configureStore } from "@reduxjs/toolkit";
import registrationReducer from "./registrationSlice";

export const store = configureStore({
  reducer: {
    registration: registrationReducer,
  },
  // (Optional) Enable Redux DevTools in production for easier debugging
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
