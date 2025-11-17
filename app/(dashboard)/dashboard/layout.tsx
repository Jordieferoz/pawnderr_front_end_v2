"use client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className=" py-24 px-8">{children}</main>;
}
