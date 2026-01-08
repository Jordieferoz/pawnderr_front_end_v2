// hooks/useUserProfile.ts

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { fetchUserProfile } from "@/utils/api";
import { userStorage } from "@/utils/user-storage";

export interface UserProfile {
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

interface UseUserProfileReturn {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated" || !(session as any)?.accessToken) {
      // Clear localStorage if user is not authenticated
      userStorage.clear();
      setUserProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First, try to get from localStorage
      const cachedProfile = userStorage.get();
      if (cachedProfile) {
        setUserProfile(cachedProfile);
        setIsLoading(false);
      }

      // Always fetch fresh data from API
      const response = await fetchUserProfile();
      // API response structure: { data: { data: {...user data...}, message, status }, statusCode, message }
      const userData = response.data?.data || response.data;

      if (userData && userData.id) {
        setUserProfile(userData);
        // Store only user data in localStorage (exclude message and status)
        userStorage.set(userData);
      }
    } catch (err: any) {
      console.error("❌ Failed to fetch user profile:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch profile")
      );

      if (err.response?.status === 401) {
        console.warn("🔒 Session expired or invalid");
        // Clear localStorage on 401
        userStorage.clear();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize from localStorage if available
    const cachedProfile = userStorage.get();
    if (cachedProfile && status !== "loading") {
      setUserProfile(cachedProfile);
      setIsLoading(false);
    }

    fetchProfile();
  }, [session, status]);

  return {
    userProfile,
    isLoading,
    error,
    refetch: fetchProfile
  };
};
