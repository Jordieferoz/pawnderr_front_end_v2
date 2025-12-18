// utils/user-storage.ts
export interface UserData {
  id: number;
  email: string;
  name: string;
  phone: string;
  gender: string;
  isActive: boolean;
  isVerified: boolean;
  profileCompletion: number;
}

export const userStorage = {
  get: (): UserData | null => {
    if (typeof window === "undefined") return null;
    const data = sessionStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  },

  set: (userData: UserData) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("userData", JSON.stringify(userData));
  },

  update: (updates: Partial<UserData>) => {
    if (typeof window === "undefined") return;
    const current = userStorage.get();
    if (current) {
      userStorage.set({ ...current, ...updates });
    }
  },

  clear: () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("userData");
  }
};
