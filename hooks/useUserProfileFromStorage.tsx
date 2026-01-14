// hooks/useUserProfileFromStorage.tsx
// Hook to read user profile from localStorage only (no API calls)
// Use this in components like headers where we don't want to trigger API calls

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { USER_PROFILE_STORAGE_EVENT, userStorage } from "@/utils/user-storage";
import { UserProfile } from "./useUserProfile";

interface UseUserProfileFromStorageReturn {
  userProfile: UserProfile | null;
  isLoading: boolean;
}

export const useUserProfileFromStorage =
  (): UseUserProfileFromStorageReturn => {
    const { status } = useSession();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Only read from localStorage, no API calls
      if (status === "loading") {
        return;
      }

      if (typeof window === "undefined") {
        return;
      }

      if (status === "unauthenticated") {
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      const loadFromStorage = () => {
        const cachedProfile = userStorage.get();
        setUserProfile(cachedProfile);
        setIsLoading(false);
      };

      // Initial read
      loadFromStorage();

      // Listen for storage updates (e.g. ProfileLoader or other flows calling userStorage.set/clear)
      const handleProfileChange = () => {
        loadFromStorage();
      };

      window.addEventListener(USER_PROFILE_STORAGE_EVENT, handleProfileChange);

      return () => {
        window.removeEventListener(
          USER_PROFILE_STORAGE_EVENT,
          handleProfileChange
        );
      };
    }, [status]);

    return {
      userProfile,
      isLoading
    };
  };
