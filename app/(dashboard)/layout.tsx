import { MobileHeader } from "@/ui_components/Dashboard";
import { Header } from "@/ui_components/Shared";

export const metadata = {
  title: "Pawnderr - Dashboard",
  description: "Pawnderr - Dashboard"
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <MobileHeader />
      <main className="relative py-[90px]">{children}</main>
    </>
  );
}
