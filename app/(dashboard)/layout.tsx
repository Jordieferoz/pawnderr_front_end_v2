import { MobileHeader } from "@/ui_components/Dashboard";

export const metadata = {
  title: "Pawnderr - Dashboard",
  description: "Pawnderr - Dashboard",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen">
      <MobileHeader />
      {children}
    </section>
  );
}
