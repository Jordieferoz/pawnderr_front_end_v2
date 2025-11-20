import { images } from "@/utils/images";
import Link from "next/link";
import { FC } from "react";

const MobileHeader: FC = () => {
  return (
    <header className="fixed py-3 w-full left-0 top-0 z-50 bg-white">
      <nav className="container mx-auto common_container flex items-center justify-between gap-4">
        <Link href={"/"}>
          <img src={images.logo.src} alt="logo" className="w-[86px]" />
        </Link>
        <Link
          href={"/profile"}
          className="rounded-full bg-light-grey w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          <img
            src={images.doggoProfilePlaceholder.src}
            className="rounded-full w-9 h-9 object-cover"
          />
        </Link>
      </nav>
    </header>
  );
};

export default MobileHeader;
