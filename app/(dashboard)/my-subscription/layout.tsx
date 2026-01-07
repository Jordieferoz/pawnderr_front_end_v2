import { images } from "@/utils/images";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full">
      <div className="container mx-auto py-20 md:pt-[104px] md:pb-0 h-full">
        {children}
      </div>
      <img
        className="absolute w-full left-0 top-0 hidden md:flex pointer-events-none z-[-1]"
        src={images.discoverBg.src}
        alt="profile_pattern"
      />
    </div>
  );
}
