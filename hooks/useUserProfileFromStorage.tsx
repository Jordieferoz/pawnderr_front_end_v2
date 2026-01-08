// hooks/useUserProfileFromStorage.tsx
// Hook to read user profile from localStorage only (no API calls)
// Use this in components like headers where we don't want to trigger API calls

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { userStorage } from "@/utils/user-storage";
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

      if (status === "unauthenticated") {
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      // Read from localStorage
      const cachedProfile = userStorage.get();
      setUserProfile(cachedProfile);
      setIsLoading(false);
    }, [status]);

    return {
      userProfile,
      isLoading
    };
  };
