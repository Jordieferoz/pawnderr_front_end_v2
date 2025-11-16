// // middleware.ts

import { NextRequest, NextResponse } from "next/server";

const LOGIN_PATH = "/sign-in"; // since (login)/sign-in is rendered at /sign-in
const DASHBOARD_PATH = "/dashboard"; // (dashboard)/dashboard is at /dashboard

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check for authentication cookie
  const isAuthenticated = req.cookies.get("isAuthenticated")?.value === "true";

  console.log("Middleware check:", { pathname, isAuthenticated });

  if (pathname === "/") {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
    }
    return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
  }

  if (pathname.startsWith(DASHBOARD_PATH) && !isAuthenticated) {
    return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
  }

  if ((pathname === LOGIN_PATH || pathname === "/sign-up") && isAuthenticated) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/sign-in", "/sign-up"],
};

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Temporarily disable token checks for testing
//   if (pathname === "/" || pathname.startsWith("/dashboard")) {
//     // Always allow and redirect to dashboard
//     if (pathname !== "/dashboard") {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }
//     return NextResponse.next();
//   }

//   // You can also disable login redirects for sign-in pages during test
//   if (pathname === "/sign-in" || pathname === "/sign-up") {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   return NextResponse.next();
// }
