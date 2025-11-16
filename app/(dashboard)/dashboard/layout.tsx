"use client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="h-[calc(100vh-200px)] py-24 px-8">{children}</main>;
}
