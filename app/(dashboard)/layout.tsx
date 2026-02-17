import { MobileHeader } from "@/ui_components/Dashboard";
import { Header } from "@/ui_components/Shared";
import { images } from "@/utils/images";
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
      <main className="relative pt-22.5 min-h-[calc(100dvh-0px)]">
        {children}
        <img
          src={images.appPattern.src}
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-[-1]"
          alt="appPattern"
        />
      </main>
    </>
  );
}
