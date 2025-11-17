"use client";

import { Fredoka, Source_Sans_3 } from "next/font/google";
import { usePathname } from "next/navigation";

import { ReduxProvider } from "@/store/Provider";
import { Footer } from "@/ui_components/Shared";
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
  const hideFooterRoutes = ["/sign-up", "/sign-in", "/register"];
  const shouldHideFooter = hideFooterRoutes.includes(pathname);

  return (
    <html lang="en" className={`${fredoka.className} ${sourceSans3.className}`}>
      <body>
        <ReduxProvider>
          {children}
          {!shouldHideFooter && <Footer />}
        </ReduxProvider>
      </body>
    </html>
  );
}
