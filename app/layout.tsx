"use client";

import { SessionProvider } from "next-auth/react";
import { Fredoka, Source_Sans_3 } from "next/font/google";
import { usePathname } from "next/navigation";

import { ReduxProvider } from "@/store/Provider";
import { MobileMenu } from "@/ui_components/Shared";
import "./styles/globals.css";

const fredoka = Fredoka({ subsets: ["latin"], display: "swap" });
const sourceSans3 = Source_Sans_3({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define routes where Footer should NOT appear
  const hideMobileMenuRoutes = ["/sign-up", "/sign-in", "/register"];
  const shouldHideMobileMenu = hideMobileMenuRoutes.includes(pathname);

  return (
    <html lang="en" className={`${fredoka.className} ${sourceSans3.className}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <SessionProvider>
          <ReduxProvider>
            {children}
            {!shouldHideMobileMenu && <MobileMenu />}
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
