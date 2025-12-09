import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

import { userLogin } from "@/utils/api";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        try {
          const response = await userLogin({
            email: credentials.email,
            password: credentials.password,
          });

          if (response.data?.accessToken) {
            return {
              id: response.data.user?.id || credentials.email,
              email: credentials.email,
              name: response.data.user?.name || null,
              image: response.data.user?.image || null,
              accessToken: response.data.accessToken,
            };
          }

          throw new Error("Invalid credentials");
        } catch (error: any) {
          console.error("Authorization error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
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
    },
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
