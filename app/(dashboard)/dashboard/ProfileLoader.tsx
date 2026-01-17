"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { setMetadata, updateStepData } from "@/store/registrationSlice";
import { setUser } from "@/store/userSlice";
import {
  fetchMyPetsCollection,
  fetchPetRegistrationData,
  fetchUserProfile
} from "@/utils/api";
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
  const router = useRouter();
  const isLoadingRef = useRef(false);
  const lastFetchRef = useRef<{ user: number; pets: number }>({
    user: 0,
    pets: 0
  });

  useEffect(() => {
    // Wait for pathname to be available
    if (!pathname) {
      return;
    }

    // Skip on edit profile page - it doesn't need user profile refresh
    if (pathname.startsWith("/profile/edit")) {
      return;
    }

    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      return;
    }

    const loadProfile = async () => {
      // Only run if authenticated and we have an access token
      if (
        status === "authenticated" &&
        session &&
        (session as any)?.accessToken
      ) {
        isLoadingRef.current = true;
        const now = Date.now();
        const timeSinceLastFetch = now - lastFetchRef.current.user;

        // Throttle: Don't fetch if we fetched less than 2 seconds ago
        if (timeSinceLastFetch < 2000) {
          isLoadingRef.current = false;
          return;
        }

        try {
          const response = await fetchUserProfile();
          lastFetchRef.current.user = Date.now();
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
          }
        } catch (error) {
          console.error("❌ Failed to load user profile:", error);
        }

        // Fetch pets data with throttling
        const timeSinceLastPetsFetch = now - lastFetchRef.current.pets;
        if (timeSinceLastPetsFetch >= 2000) {
          try {
            const petsResponse = await fetchMyPetsCollection();
            lastFetchRef.current.pets = Date.now();
            const petsPayload = petsResponse?.data ?? petsResponse;

            if (petsPayload) {
              petsStorage.set(petsPayload);
            }

            const myPets = petsPayload?.my_pets ?? [];
            const incompletePets = petsPayload?.incomplete_pets ?? [];
            const hasNoPets =
              myPets.length === 0 && incompletePets.length === 0;
            console.log(hasNoPets, "hasNoPets");
            if (hasNoPets) {
              try {
                const registrationResponse = await fetchPetRegistrationData();
                const registrationPayload =
                  registrationResponse?.data?.data ??
                  registrationResponse?.data ??
                  registrationResponse;
                const metadata =
                  registrationPayload?.metadata ?? registrationPayload;

                if (metadata) {
                  console.log(metadata, "metadata");
                  dispatch(setMetadata(metadata));
                  dispatch(updateStepData({ step: 3 }));
                  router.push("/register");
                }
              } catch (error) {
                console.error(
                  "❌ Failed to load pet registration metadata:",
                  error
                );
              }
            }
          } catch (error) {
            console.error("❌ Failed to load user pets:", error);
          }
        }

        isLoadingRef.current = false;
      }
    };

    // Only run after session is loaded
    if (status !== "loading") {
      loadProfile();
    }
  }, [session, status, dispatch, pathname, router]);

  return null; // This component doesn't render anything
}
