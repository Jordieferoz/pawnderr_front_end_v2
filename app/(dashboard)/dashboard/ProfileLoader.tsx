"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setUser } from "@/store/userSlice";
import { fetchMyPetsCollection, fetchUserProfile } from "@/utils/api";
import { petsStorage } from "@/utils/pets-storage";
import { userStorage } from "@/utils/user-storage";

/**
 * Client component to ensure user profile is fetched and stored in localStorage
 * after login (handles OAuth redirects that bypass the login component)
 */
export default function ProfileLoader() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for pathname to be available
    if (!pathname) {
      return;
    }

    // Skip on edit profile page - it doesn't need user profile refresh
    if (pathname.startsWith("/profile/edit")) {
      console.log("⏭️ Skipping ProfileLoader on edit profile page:", pathname);
      return;
    }

    const loadProfile = async () => {
      // Only run if authenticated and we have an access token
      if (
        status === "authenticated" &&
        session &&
        (session as any)?.accessToken
      ) {
        // Always fetch fresh profile data on dashboard load
        try {
          const response = await fetchUserProfile();
          // API response structure: { data: { data: {...user data...}, message, status }, statusCode, message }
          const userData = response.data?.data || response.data;
          if (userData && userData.id) {
            // Store only user data in localStorage (exclude message and status)
            userStorage.set(userData);

            // Sync with Redux state (map API response to Redux UserData format)
            const reduxUserData = {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              phone: userData.phone,
              gender: userData.gender,
              isActive: userData.is_active,
              isVerified: userData.is_verified,
              profileCompletionPercentage:
                userData.profile_completion_percentage,
              lastLoginAt: userData.last_login_at,
              loginCount: userData.login_count
            };
            dispatch(setUser(reduxUserData));

            console.log(
              "✅ User profile loaded and stored in localStorage and Redux"
            );
          }
        } catch (error) {
          console.error("❌ Failed to load user profile:", error);
        }

        // Always fetch fresh pets data on dashboard load
        try {
          const petsResponse = await fetchMyPetsCollection();
          if (petsResponse.data) {
            petsStorage.set(petsResponse.data);
            console.log("✅ User pets loaded and stored in localStorage");
          }
        } catch (error) {
          console.error("❌ Failed to load user pets:", error);
        }
      }
    };

    // Only run after session is loaded
    if (status !== "loading") {
      loadProfile();
    }
  }, [session, status, dispatch, pathname]);

  return null; // This component doesn't render anything
}
