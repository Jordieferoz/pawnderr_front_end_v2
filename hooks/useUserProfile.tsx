// hooks/useUserProfile.ts

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { fetchUserProfile } from "@/utils/api";

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
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchUserProfile();

      if (response.data) {
        setUserProfile(response.data);
      }
    } catch (err: any) {
      console.error("❌ Failed to fetch user profile:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch profile")
      );

      if (err.response?.status === 401) {
        console.warn("🔒 Session expired or invalid");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [session, status]);

  return {
    userProfile,
    isLoading,
    error,
    refetch: fetchProfile
  };
};
