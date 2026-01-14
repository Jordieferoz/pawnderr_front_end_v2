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

// Custom event name used to notify when the stored user profile changes.
export const USER_PROFILE_STORAGE_EVENT = "userProfileStorageChanged";

const dispatchUserProfileEvent = () => {
  if (typeof window === "undefined") return;

  try {
    window.dispatchEvent(new Event(USER_PROFILE_STORAGE_EVENT));
  } catch {
    // Ignore event dispatch errors in non-browser-like environments
  }
};

export const userStorage = {
  get: (): UserData | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem("userProfile");
    return data ? JSON.parse(data) : null;
  },

  set: (userData: UserData) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("userProfile", JSON.stringify(userData));
    dispatchUserProfileEvent();
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
    dispatchUserProfileEvent();
  }
};
