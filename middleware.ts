import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up") ||
      req.nextUrl.pathname.startsWith("/forgot-password");
    const isPublicPage =
      req.nextUrl.pathname.startsWith("/faqs") ||
      req.nextUrl.pathname.startsWith("/privacy-policy") ||
      req.nextUrl.pathname.startsWith("/terms-of-service");
    const isLandingPage = req.nextUrl.pathname === "/";

    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/discover", req.url));
    }

    // If user is authenticated and tries to access landing page, redirect to dashboard
    if (isLandingPage && isAuth) {
      return NextResponse.redirect(new URL("/discover", req.url));
    }

    // Allow public pages without redirect
    if (isPublicPage) {
      return NextResponse.next();
    }

    // For all other cases, continue
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

        const isPublicPage =
          req.nextUrl.pathname.startsWith("/faqs") ||
          req.nextUrl.pathname.startsWith("/privacy-policy") ||
          req.nextUrl.pathname.startsWith("/terms-of-service");

        // Allow access to root landing page
        const isLandingPage = req.nextUrl.pathname === "/";

        // Allow access to auth pages without token (middleware will handle redirect if authenticated)
        if (isAuthPage || isLandingPage || isPublicPage) {
          return true;
        }

        // For protected pages, require token
        return !!token;
      }
    },
    pages: {
      signIn: "/sign-in"
    }
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
