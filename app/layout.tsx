// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Fredoka } from 'next/font/google';
import localFont from 'next/font/local';

import './styles/globals.css';

export const metadata: Metadata = {
  title: 'Pawnderr',
  description: 'Pawnderr',
};

export const viewport: Viewport = { maximumScale: 1 };

const fredoka = Fredoka({ subsets: ['latin'], display: 'swap' });

const sourceSansPro = localFont({
  src: [
    {
      path: './fonts/SourceSansPro-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/SourceSansPro-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/SourceSansPro-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-source-sans',
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fredoka.className} ${sourceSansPro.variable}`}
    >
      <body className="min-h-[100dvh]">{children}</body>
    </html>
  );
}
