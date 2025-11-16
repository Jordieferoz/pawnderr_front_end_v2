"use client";

import { Header } from "@/ui_components/Dashboard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen">
      <Header />
      {children}
    </section>
  );
}
