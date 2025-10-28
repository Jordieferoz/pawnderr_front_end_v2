import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";

interface UserWithOnboarded {
  id: string;
  email: string;
  onboarded: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    Facebook({
      clientId: process.env.FB_ID!,
      clientSecret: process.env.FB_SECRET!,
    }),
    Twitter({
      clientId: process.env.TWITTER_ID!,
      clientSecret: process.env.TWITTER_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        // Validate and fetch user; return null if invalid
        // Return user object that includes { id, email, onboarded: boolean }
        return { id: "u1", email: creds?.email as string, onboarded: false };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      // On first sign-in, set onboarded from the user record
      if (user) {
        token.onboarded = (user as UserWithOnboarded).onboarded ?? false;
      }
      // Optionally, refresh this from DB on subsequent calls if needed
      return token;
    },
    async session({ session, token }) {
      // Expose onboarded to the client/session
      if (session.user) {
        (session.user as UserWithOnboarded).onboarded =
          (token.onboarded as boolean) ?? false;
      }
      return session;
    },
  },
  // Optional: custom pages for nicer UX
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
};
