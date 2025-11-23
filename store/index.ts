import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";
import profileReducer from "./profileInfoSlice";
import registrationReducer from "./registrationSlice";

export const store = configureStore({
  reducer: {
    registration: registrationReducer,
    profileInfo: profileReducer,
    modal: modalReducer,
  },
  // (Optional) Enable Redux DevTools in production for easier debugging
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
