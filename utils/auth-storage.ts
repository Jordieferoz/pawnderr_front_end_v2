// utils/auth-storage.ts
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
  },
};
