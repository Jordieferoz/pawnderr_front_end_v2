"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { mobileMenuItems } from "@/constants";
import { RootState } from "@/store";

const MobileMenu: FC = () => {
  const pathname = usePathname();

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const unseenMatchCount = useSelector(
    (state: RootState) => state.match.unseenMatchCount
  );
  const whoLikesMeCount = useSelector(
    (state: RootState) => state.match.whoLikesMeCount
  );
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Hide footer on authentication pages
  const hiddenRoutes = [
    "/sign-in",
    "/sign-up",
    "/register",
    "/forgot-password"
  ];
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  // Helper to decide which menuItem is active for indicator & styles
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

  useEffect(() => {
    const activeIndex = mobileMenuItems.findIndex((item) =>
      isItemActive(item.href, item.key)
    );
    if (activeIndex === -1) return;

    const navRect = navRef.current?.getBoundingClientRect();
    const activeRect = itemRefs.current[activeIndex]?.getBoundingClientRect();

    if (navRect && activeRect) {
      setIndicatorStyle({
        left: activeRect.left - navRect.left,
        width: activeRect.width
      });
    }
  }, [pathname]);

  return (
    <footer className="fixed left-0 bottom-0 w-full bg-white border-t border-gray-100 z-50 md:hidden">
      <nav
        ref={navRef}
        className="relative flex justify-between max-w-[520px] mx-auto py-4 px-0"
      >
        <span
          className="absolute top-0 h-1 bg-accent-500 rounded transition-all duration-300"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width
          }}
        />

        {mobileMenuItems.map((item, index) => {
          const active = isItemActive(item.href, item.key);

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
                <div className="flex justify-center items-center h-[40px] relative">
                  <img
                    src={active ? item.imgActive : item.img}
                    alt={item.label}
                    style={{ width: item.imgWidth }}
                    className="block"
                  />
                  {item.key === "matches" && unseenMatchCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-secondary-600 rounded-full"></span>
                  )}
                  {item.key === "activities" && whoLikesMeCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-secondary-600 rounded-full"></span>
                  )}
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
