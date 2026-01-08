// utils/user-storage.ts
export interface UserData {
  id: number;
  email: string;
  name: string;
  phone: string;
  gender: string;
  is_active: boolean;
  is_verified: boolean;
  profile_completion_percentage: number;
  last_login_at: string;
  login_count: number;
  created_at: string;
  updated_at: string;
}

export const userStorage = {
  get: (): UserData | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem("userProfile");
    return data ? JSON.parse(data) : null;
  },

  set: (userData: UserData) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("userProfile", JSON.stringify(userData));
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
    localStorage.removeItem("userProfile");
  }
};
