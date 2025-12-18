// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 Authorization attempt started");

        if (!credentials?.email || !credentials?.password) {
          console.error("❌ Missing credentials");
          throw new Error("Please enter your email and password");
        }

        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`;

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "access-token": "key"
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          console.log("📥 Response status:", response.status);

          const responseText = await response.text();
          let responseData;

          try {
            responseData = JSON.parse(responseText);
          } catch (parseError) {
            console.error("❌ Failed to parse response:", parseError);
            throw new Error("Invalid response from server");
          }

          if (!response.ok) {
            console.error("❌ Response not OK:", responseData);
            throw new Error(responseData?.message || "Invalid credentials");
          }

          // Extract user data from response
          const userData = responseData?.data;

          if (!userData || !userData.accessToken) {
            console.error("❌ No user data or access token");
            throw new Error("Invalid credentials");
          }

          // Return complete user object matching UserData interface
          const user = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            gender: userData.gender,
            isActive: userData.is_active,
            isVerified: userData.is_verified,
            profileCompletionPercentage: userData.profile_completion_percentage,
            lastLoginAt: userData.last_login_at,
            loginCount: userData.login_count,
            accessToken: userData.accessToken,
            refreshToken: userData.refreshToken
          };

          console.log("✅ Authorization successful:", {
            id: user.id,
            email: user.email,
            name: user.name
          });

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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
