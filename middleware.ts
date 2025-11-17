import { NextRequest, NextResponse } from "next/server";

const LOGIN_PATH = "/sign-in";
const DASHBOARD_PATH = "/dashboard";
const REGISTER_PATH = "/register";

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

  // Protect dashboard - require authentication
  if (pathname.startsWith(DASHBOARD_PATH) && !isAuthenticated) {
    return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
  }

  // Protect register route - require authentication
  if (pathname === REGISTER_PATH && !isAuthenticated) {
    return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
  }

  // Redirect authenticated users away from sign-in/sign-up pages
  if ((pathname === LOGIN_PATH || pathname === "/sign-up") && isAuthenticated) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/sign-in", "/sign-up", "/register"],
};
