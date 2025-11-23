"use client";

import { images } from "@/utils/images";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";

const menuItems = [
  {
    key: "matches",
    label: "Matches",
    href: "/matches",
    img: images.matches.src,
    imgActive: images.matchesActive.src,
    imgWidth: 18,
  },
  {
    key: "activities",
    label: "Activities",
    href: "/activities",
    img: images.activities.src,
    imgActive: images.activitiesActive.src,
    imgWidth: 21,
  },
  {
    key: "discover",
    label: "Discover",
    href: "/dashboard",
    img: images.discover.src,
    imgActive: images.discoverActive.src,
    imgWidth: 38,
  },
  {
    key: "messages",
    label: "Messages",
    href: "/messages",
    img: images.messages.src,
    imgActive: images.messagesActive.src,
    imgWidth: 24,
  },
  {
    key: "upgrade",
    label: "Upgrade",
    href: "/upgrade",
    img: images.pawnderr.src,
    imgActive: images.pawnderrActive.src,
    imgWidth: 26,
  },
];

const MobileMenu: FC = () => {
  const pathname = usePathname();

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Hide footer on authentication pages
  const hiddenRoutes = ["/sign-in", "/sign-up", "/register"];
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  useEffect(() => {
    const activeIndex = menuItems.findIndex((item) => item.href === pathname);
    if (activeIndex === -1) return;

    const navRect = navRef.current?.getBoundingClientRect();
    const activeRect = itemRefs.current[activeIndex]?.getBoundingClientRect();

    if (navRect && activeRect) {
      setIndicatorStyle({
        left: activeRect.left - navRect.left,
        width: activeRect.width,
      });
    }
  }, [pathname]);

  return (
    <footer className="fixed left-0 bottom-0 w-full bg-white border-t border-gray-100 z-50">
      <nav
        ref={navRef}
        className="relative flex justify-between max-w-[520px] mx-auto py-4 px-0"
      >
        <span
          className="absolute top-0 h-1 bg-accent-500 rounded transition-all duration-300"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />

        {menuItems.map((item, index) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.key}
              href={item.href}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
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
      </nav>
    </footer>
  );
};

export default MobileMenu;
