import { images } from "@/utils/images";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full min-h-screen">
      <div className="container mx-auto py-20 md:py-[104px] h-full md:mt-10">
        {children}
      </div>
      <img
        className="absolute w-full left-0 top-0 hidden md:flex pointer-events-none z-[-1]"
        src={images.discoverBg.src}
        alt="pattern1"
      />
      <img
        className="absolute left-0 top-0 hidden md:flex pointer-events-none z-[-1]"
        src={images.discoverLeftPattern.src}
        alt="pattern2"
      />
      <img
        className="absolute right-0 bottom-0 hidden md:flex pointer-events-none z-[-1]"
        src={images.discoverRightPattern.src}
        alt="pattern3"
      />
    </div>
  );
}
