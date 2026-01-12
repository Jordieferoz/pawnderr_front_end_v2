// types/next-auth.d.ts

import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      phone?: string;
      gender?: string;
      isActive: boolean;
      isVerified: boolean;
      profileCompletionPercentage: number;
      lastLoginAt: string;
      loginCount: number;
    };
    accessToken: string;
    refreshToken: string;
    firebaseToken: string;
  }

  interface User {
    id: number;
    email: string;
    name: string;
    phone?: string;
    gender?: string;
    isActive: boolean;
    isVerified: boolean;
    profileCompletionPercentage: number;
    lastLoginAt: string;
    loginCount: number;
    accessToken: string;
    refreshToken: string;
    firebaseToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userData: {
      id: number;
      email: string;
      name: string;
      phone?: string;
      gender?: string;
      isActive: boolean;
      isVerified: boolean;
      profileCompletionPercentage: number;
      lastLoginAt: string;
      loginCount: number;
    };
    accessToken: string;
    refreshToken: string;
    firebaseToken: string;
  }
}
