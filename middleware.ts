import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

import { isAuthRoute, isGuestOnlyRoute } from "./constants/authRoutes";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;
    const isGuestOnlyPage = isGuestOnlyRoute(pathname);
    const isPublicPage =
      pathname.startsWith("/faqs") ||
      pathname.startsWith("/privacy-policy") ||
      pathname.startsWith("/terms-of-service");
    const isLandingPage = pathname === "/";

    if (isGuestOnlyPage && isAuth) {
      return NextResponse.redirect(new URL("/discover", req.url));
    }

    if (isLandingPage && isAuth) {
      return NextResponse.redirect(new URL("/discover", req.url));
    }

    if (isPublicPage) {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;
        const isAuthPage = isAuthRoute(pathname);
        const isPublicPage =
          pathname.startsWith("/faqs") ||
          pathname.startsWith("/privacy-policy") ||
          pathname.startsWith("/terms-of-service");
        const isLandingPage = pathname === "/";

        if (isAuthPage || isLandingPage || isPublicPage) {
          return true;
        }

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
