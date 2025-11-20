import { MobileHeader } from "@/ui_components/Dashboard";

export const metadata = {
  title: "Pawnderr - Dashboard",
  description: "Pawnderr - Dashboard",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen overflow-clip">
      <MobileHeader />
      <main className="container mx-auto py-20">{children}</main>
    </section>
  );
}
