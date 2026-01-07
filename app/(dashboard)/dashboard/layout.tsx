import { images } from "@/utils/images";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="container mx-auto h-full">{children}</div>
      <div
        className="absolute w-full left-0 top-0 hidden md:block pointer-events-none z-[-1] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${images.discoverBg.src})` }}
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
