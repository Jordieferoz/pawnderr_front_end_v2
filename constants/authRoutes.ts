// Routes reachable without a session.
export const AUTH_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/register",
  "/forgot-password"
] as const;

// Routes a signed-in user must never land on. `/register` is excluded because
// pet registration continues after the session exists.
export const GUEST_ONLY_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password"
] as const;

export const isAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some((route) => pathname.startsWith(route));

export const isGuestOnlyRoute = (pathname: string) =>
  GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route));
