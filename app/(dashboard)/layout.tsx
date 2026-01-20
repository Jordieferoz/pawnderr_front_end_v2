import { MobileHeader } from "@/ui_components/Dashboard";
import { Header } from "@/ui_components/Shared";
import ProfileLoader from "./dashboard/ProfileLoader";

export const metadata = {
  title: "Pawnderr - Dashboard",
  description: "Pawnderr - Dashboard"
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProfileLoader />
      <Header />
      <MobileHeader />
      <main className="relative pt-22.5 min-h-[calc(100vh-0px)]">
        {children}
      </main>
    </>
  );
}
