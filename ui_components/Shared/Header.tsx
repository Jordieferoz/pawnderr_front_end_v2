"use client";

import { Button } from "@/components/ui/button";
import { headerMenuItems } from "@/constants";
import { images } from "@/utils/images";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

const Header: FC = () => {
  const pathname = usePathname();

  const isItemActive = (itemHref: string, itemKey: string) => {
    if (itemKey === "discover") {
      // Dashboard tab is active on /dashboard and /profile
      return (
        pathname === "/dashboard" ||
        pathname === "/profile" ||
        pathname.startsWith("/dashboard/") ||
        pathname.startsWith("/profile/")
      );
    }

    // Default behavior for others
    return pathname === itemHref || pathname.startsWith(`${itemHref}/`);
  };
  return (
    <header className="fixed py-6 w-full left-0 top-0 z-50 bg-white/80 border-b border-blue/10 shadow-[0px_4px_16.4px_0px_#0000000F] hidden md:block">
      <nav className="container mx-auto common_container flex items-center justify-between gap-4">
        <Link href={"/"}>
          <img src={images.logoBig.src} alt="logo" className="w-[250px]" />
        </Link>

        <ul className="flex gap-6 items-center">
          {headerMenuItems.map((item, index) => {
            const active = isItemActive(item.href, item.key);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex-1 text-center no-underline select-none ${
                  active ? "text-neutral-900" : "text-gray-400"
                }`}
              >
                <div className="flex flex-col items-center justify-between h-[56px]">
                  <div className="flex justify-center items-center h-[40px]">
                    <img
                      src={active ? item.imgActive : item.img}
                      alt={item.label}
                      style={{ width: item.imgWidth }}
                      className="block"
                    />
                  </div>

                  <p
                    className={`tp_small_medium mt-1 ${
                      active ? "text-accent-500" : "text-neutral-white"
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              </Link>
            );
          })}
          <Link
            href={"/profile"}
            className="rounded-full bg-light-grey w-10 h-10 flex items-center justify-center cursor-pointer"
          >
            <img
              src={images.doggoProfilePlaceholder.src}
              className="rounded-full w-9 h-9 object-cover"
            />
          </Link>
          <Link href={"/upgrade"} className="cursor-pointer">
            <Button>
              <img src={images.pawnderBlack.src} /> PAWnderr+
            </Button>
          </Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
