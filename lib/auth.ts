// lib/auth.ts

import { NextAuthOptions } from "next-auth/";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * NextAuth Configuration
 *
 * Phone-based login flow:
 * 1. Client calls loginWithPhone API (sends OTP)
 * 2. User verifies OTP in modal
 * 3. OTP verification returns accessToken and refreshToken
 * 4. Client calls NextAuth signIn with accessToken to create server-side session
 *
 * This credentials provider validates the accessToken server-side and creates a session.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        accessToken: { label: "Access Token", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.accessToken) {
          console.error("❌ Missing access token");
          throw new Error("Access token is required");
        }

        try {
          // Validate token and fetch user data from API
          // Use the user profile endpoint which requires the token
          const profileUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}user/profile`;

          const response = await fetch(profileUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "access-token": "key",
              Authorization: `Bearer ${credentials.accessToken}`
            }
          });

          if (!response.ok) {
            // If profile fetch fails, token might be invalid
            console.error("❌ Token validation failed:", response.status);
            throw new Error("Invalid or expired token");
          }

          const responseText = await response.text();
          let responseData;

          try {
            responseData = JSON.parse(responseText);
          } catch (parseError) {
            console.error("❌ Failed to parse response:", parseError);
            throw new Error("Invalid response from server");
          }

          const userData =
            responseData?.data?.data || responseData?.data || responseData;

          if (!userData || !userData.id) {
            console.error("❌ No user data in response");
            throw new Error("Invalid user data");
          }

          // Return user object for NextAuth session
          const user = {
            id: userData.id,
            email: userData.email || "",
            name: userData.name || "",
            phone: userData.phone || "",
            gender: userData.gender || "",
            isActive: userData.is_active ?? false,
            isVerified: userData.is_verified ?? false,
            profileCompletionPercentage:
              userData.profile_completion_percentage ?? 0,
            lastLoginAt: userData.last_login_at || "",
            loginCount: userData.login_count ?? 0,
            accessToken: credentials.accessToken,
            refreshToken: "" // Refresh token can be stored separately if needed
          };

          return user;
        } catch (error: any) {
          console.error("❌ Authorization error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          gender: user.gender,
          isActive: user.isActive,
          isVerified: user.isVerified,
          profileCompletionPercentage: user.profileCompletionPercentage,
          lastLoginAt: user.lastLoginAt,
          loginCount: user.loginCount
        };
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = token.userData;

        // THIS IS THE FIX - Add these two lines:
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    }
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-in",
    error: "/sign-in"
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
};
