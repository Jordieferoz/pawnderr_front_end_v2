"use client";

import { SessionProvider } from "next-auth/react";
import { Fredoka, Source_Sans_3 } from "next/font/google";
import { usePathname } from "next/navigation";
import Script from "next/script";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  const hideMobileMenuRoutes = [
    "/sign-up",
    "/sign-in",
    "/register",
    "/",
    "/messages"
  ];
  const shouldHideMobileMenu =
    hideMobileMenuRoutes.includes(pathname) || pathname.startsWith("/messages");
  return (
    <html lang="en" className={`${fredoka.className} ${sourceSans3.className}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="facebook-domain-verification"
          content="7uzpkr60kke966b1fdol5469ajno3b"
        />

        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MDRSR5Q5');`
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MDRSR5Q5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <SessionProvider>
          <ReduxProvider>
            <TooltipProvider>
              {isHomeRoute && <Header />}

              {children}
              {!shouldHideMobileMenu && <MobileMenu />}
              {isHomeRoute && <Footer />}
            </TooltipProvider>
          </ReduxProvider>
        </SessionProvider>
        <Toaster theme="dark" duration={3000} />

        {/* Razorpay Script */}
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        {/* Google Identity Services Script */}
        <Script
          id="google-gsi"
          src="https://accounts.google.com/gsi/client"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
