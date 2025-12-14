// middleware.ts

import { NextResponse } from "next/server";

// 🚧 DEV MODE: All routes are currently accessible without authentication
// TODO: Uncomment the code below to re-enable route protection

/*
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up") ||
      req.nextUrl.pathname.startsWith("/register");

    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // For all other pages, let withAuth handle it
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const isAuthPage =
          req.nextUrl.pathname.startsWith("/sign-in") ||
          req.nextUrl.pathname.startsWith("/sign-up") ||
          req.nextUrl.pathname.startsWith("/forgot-password") ||
          req.nextUrl.pathname.startsWith("/register");

        // Allow access to auth pages without token
        if (isAuthPage) {
          return true;
        }

        // For protected pages, require token
        return !!token;
      },
    },
    pages: {
      signIn: "/sign-in",
    },
  }
);

// Configure which routes to protect
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
*/

// 🚧 TEMPORARY: Allow all routes during development
export function middleware(req: any) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
