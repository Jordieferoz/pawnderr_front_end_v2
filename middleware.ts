// // middleware.ts

import { NextRequest, NextResponse } from "next/server";

// import { getToken } from "next-auth/jwt";
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// const LOGIN_PATH = "/sign-in"; // since (login)/sign-in is rendered at /sign-in
// const DASHBOARD_PATH = "/dashboard"; // (dashboard)/dashboard is at /dashboard
// const ONBOARDING_PATH = "/onboarding"; // assuming onboarding page at /onboarding

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const token = await getToken({ req });

//   if (pathname === "/") {
//     if (!token) {
//       return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
//     }
//     if (token.onboarded === false) {
//       return NextResponse.redirect(new URL(ONBOARDING_PATH, req.url));
//     }
//     return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
//   }

//   // Add guard for dashboard routes — if unauthenticated, redirect to login
//   if (pathname.startsWith(DASHBOARD_PATH) && !token) {
//     return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
//   }

//   // If authenticated user attempts to access login pages, redirect to dashboard
//   if ((pathname === LOGIN_PATH || pathname === "/sign-up") && token) {
//     if (token.onboarded === false) {
//       return NextResponse.redirect(new URL(ONBOARDING_PATH, req.url));
//     }
//     return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/", "/dashboard/:path*", "/sign-in", "/sign-up"],
// };

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Temporarily disable token checks for testing
  if (pathname === "/" || pathname.startsWith("/dashboard")) {
    // Always allow and redirect to dashboard
    if (pathname !== "/dashboard") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // You can also disable login redirects for sign-in pages during test
  if (pathname === "/sign-in" || pathname === "/sign-up") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
