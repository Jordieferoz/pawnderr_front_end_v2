// hooks/useUserProfileRefetch.tsx
// Hook that only provides refetch function without auto-fetching on mount

import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";

import { fetchUserProfile } from "@/utils/api";
import { userStorage } from "@/utils/user-storage";
import { UserProfile } from "./useUserProfile";

interface UseUserProfileRefetchReturn {
  refetch: () => Promise<void>;
}

export const useUserProfileRefetch = (): UseUserProfileRefetchReturn => {
  const { data: session, status } = useSession();

  const refetch = useCallback(async () => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated" || !(session as any)?.accessToken) {
      return;
    }

    try {
      const response = await fetchUserProfile();
      // API response structure: { data: { data: {...user data...}, message, status }, statusCode, message }
      const userData = response.data?.data || response.data;

      if (userData && userData.id) {
        // Store only user data in localStorage (exclude message and status)
        userStorage.set(userData);
      }
    } catch (err: any) {
      console.error("❌ Failed to fetch user profile:", err);
      throw err;
    }
  }, [session, status]);

  return {
    refetch
  };
};
