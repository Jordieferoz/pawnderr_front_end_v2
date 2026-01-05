"use client";

import { SessionProvider } from "next-auth/react";
import { Fredoka, Source_Sans_3 } from "next/font/google";
import { usePathname } from "next/navigation";
import Script from "next/script";

import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/store/Provider";
import { Footer, Header } from "@/ui_components/Home";
import { MobileMenu } from "@/ui_components/Shared";

import "./styles/globals.css";

const fredoka = Fredoka({ subsets: ["latin"], display: "swap" });
const sourceSans3 = Source_Sans_3({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Show Header and Footer only on home route
  const isHomeRoute = pathname === "/";

  // Define routes where MobileMenu should NOT appear
  const hideMobileMenuRoutes = ["/sign-up", "/sign-in", "/register", "/"];
  const shouldHideMobileMenu = hideMobileMenuRoutes.includes(pathname);

  return (
    <html lang="en" className={`${fredoka.className} ${sourceSans3.className}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <SessionProvider>
          <ReduxProvider>
            {isHomeRoute && <Header />}

            {children}
            {!shouldHideMobileMenu && <MobileMenu />}
            {isHomeRoute && <Footer />}
          </ReduxProvider>
        </SessionProvider>
        <Toaster theme="dark" duration={3000} />

        {/* Razorpay Script */}
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
