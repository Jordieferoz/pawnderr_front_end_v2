import { MobileHeader } from "@/ui_components/Dashboard";
import { Header } from "@/ui_components/Shared";

export const metadata = {
  title: "Pawnderr - Dashboard",
  description: "Pawnderr - Dashboard"
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen overflow-clip">
      <Header />
      <MobileHeader />
      <main className="relative h-screen">{children}</main>
    </section>
  );
}
