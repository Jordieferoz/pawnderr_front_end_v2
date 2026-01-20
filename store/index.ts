// store/index.ts
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import { combineReducers, configureStore } from "@reduxjs/toolkit";

import modalReducer from "./modalSlice";
import profileReducer from "./profileInfoSlice";
import registrationReducer from "./registrationSlice";
import userReducer from "./userSlice";
import matchReducer from "./matchSlice";

// Persist config for registration slice - persist everything
const registrationPersistConfig = {
  key: "registration",
  storage
  // No whitelist/blacklist - persist all fields
};

// Persist config for profile slice
const profilePersistConfig = {
  key: "profile",
  storage
};

// Persist config for user slice
const userPersistConfig = {
  key: "user",
  storage
  // Persist all user data
};

// Create persisted reducers
const persistedRegistrationReducer = persistReducer(
  registrationPersistConfig,
  registrationReducer
);

const persistedProfileReducer = persistReducer(
  profilePersistConfig,
  profileReducer
);

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Combine reducers
const rootReducer = combineReducers({
  registration: persistedRegistrationReducer,
  profileInfo: persistedProfileReducer,
  user: persistedUserReducer,
  modal: modalReducer,
  match: matchReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types and paths for redux-persist
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["registration.images"] // We'll handle image serialization manually
      }
    }),
  devTools: process.env.NODE_ENV !== "production"
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
