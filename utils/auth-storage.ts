// utils/auth-storage.ts

// Set when the API rejects our token and we force the user back to sign-in.
// `GET /api/auth/session` re-issues the session cookie, so a request already in
// flight can restore the session moments after sign-out — this flag stops the
// sign-in page from bouncing such a user back into the app.
export const forcedSignOutFlag = {
  set: () => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("forcedSignOut", "1");
  },

  exists: () => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("forcedSignOut") === "1";
  },

  clear: () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("forcedSignOut");
  }
};

export const signupStorage = {
  set: (email: string, password: string) => {
    sessionStorage.setItem("signupEmail", email);
    sessionStorage.setItem("signupPassword", password);
  },

  get: () => {
    const email = sessionStorage.getItem("signupEmail");
    const password = sessionStorage.getItem("signupPassword");

    if (!email || !password) return null;

    return { email, password };
  },

  clear: () => {
    sessionStorage.removeItem("signupEmail");
    sessionStorage.removeItem("signupPassword");
  },

  exists: () => {
    return !!sessionStorage.getItem("signupEmail");
  }
};
