import type { Metadata, Viewport } from "next";
import { Fredoka, Source_Sans_3 } from "next/font/google";

import { ReduxProvider } from "@/store/Provider";
import { Footer } from "@/ui_components/Shared";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Pawnderr",
  description: "Pawnderr",
};

export const viewport: Viewport = { maximumScale: 1 };

const fredoka = Fredoka({ subsets: ["latin"], display: "swap" });
const sourceSans3 = Source_Sans_3({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.className} ${sourceSans3.className}`}>
      <body className="min-h-[100dvh]">
        {" "}
        <ReduxProvider>
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
