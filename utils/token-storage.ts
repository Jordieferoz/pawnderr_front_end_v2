// utils/token-storage.ts
export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("accessToken");
  },

  setAccessToken: (token: string) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("accessToken", token);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("refreshToken");
  },

  setRefreshToken: (token: string) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("refreshToken", token);
  },

  getFirebaseToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("firebaseToken");
  },

  setFirebaseToken: (token: string) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("firebaseToken", token);
  },

  clearTokens: () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("firebaseToken");
  },

  hasValidSession: (): boolean => {
    if (typeof window === "undefined") return false;
    const token = sessionStorage.getItem("accessToken");
    return !!token;
  }
};
