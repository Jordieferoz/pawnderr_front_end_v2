"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { isGuestOnlyRoute } from "@/constants/authRoutes";
import { forcedSignOutFlag } from "@/utils/auth-storage";

// Middleware handles the other guest-only routes, but next-auth's `withAuth`
// skips the page configured as `pages.signIn`, so /sign-in has to be guarded here.
export default function LoginLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      forcedSignOutFlag.clear();
      return;
    }

    if (
      status !== "authenticated" ||
      !isGuestOnlyRoute(pathname ?? "") ||
      forcedSignOutFlag.exists()
    ) {
      return;
    }

    setIsRedirecting(true);
    router.replace("/discover");
  }, [status, pathname, router]);

  if (isRedirecting) {
    return null;
  }

  return children;
}
