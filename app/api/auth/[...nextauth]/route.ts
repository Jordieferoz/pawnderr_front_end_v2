// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        try {
          // ✅ Call your backend API directly with fetch
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "access-token": "key" // Your access key
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password
              })
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Invalid credentials");
          }

          const data = await response.json();

          if (data?.accessToken) {
            return {
              id: data.user?.id || credentials.email,
              email: credentials.email,
              name: data.user?.name || null,
              image: data.user?.image || null,
              accessToken: data.accessToken
            };
          }

          throw new Error("Invalid credentials");
        } catch (error: any) {
          console.error("Authorization error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
      }

      if (account?.provider === "google") {
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.id = token.id;
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
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
