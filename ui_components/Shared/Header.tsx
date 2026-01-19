// components/Header.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { headerMenuItems } from "@/constants";
import { useUserProfileFromStorage } from "@/hooks";
import { images } from "@/utils/images";

import { useDispatch, useSelector } from "react-redux";
import { openNotificationModal } from "@/store/modalSlice";
import { Notifications } from "./Notifications";
import { DropdownMenu } from "../Dashboard";
import { RootState } from "@/store";
import { getMatchIndicators } from "@/store/matchSlice";

const Header: FC = () => {
  const dispatch = useDispatch<any>();
  const pathname = usePathname();
  const { userProfile, isLoading } = useUserProfileFromStorage();
  const unseenMatchCount = useSelector(
    (state: RootState) => state.match.unseenMatchCount
  );
  const whoLikesMeCount = useSelector(
    (state: RootState) => state.match.whoLikesMeCount
  );

  console.log(unseenMatchCount, "unseenMatchCount");
  useEffect(() => {
    dispatch(getMatchIndicators());
  }, [dispatch]);

  const isItemActive = (itemHref: string, itemKey: string) => {
    if (itemKey === "discover") {
      return (
        pathname === "/dashboard" ||
        pathname === "/profile" ||
        pathname.startsWith("/dashboard/") ||
        pathname.startsWith("/profile/")
      );
    }
    return pathname === itemHref || pathname.startsWith(`${itemHref}/`);
  };

  return (
    <>
      <header className="fixed py-4 w-full left-0 top-0 z-50 bg-white border-b border-blue/10 shadow-[0px_4px_16.4px_0px_#0000000F] hidden md:block">
        <nav className="container mx-auto common_container flex items-center justify-between gap-4">
          <Link href={"/dashboard"}>
            <img
              src={images.logoHorizontal.src}
              alt="logo"
              className="w-[220px]"
            />
          </Link>

          <ul className="flex gap-6 items-center">
            {headerMenuItems.map((item) => {
              const active = isItemActive(item.href, item.key);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex-1 text-center no-underline select-none ${active ? "text-neutral-900" : "text-gray-400"
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
                        <span className="absolute top-1 -right-2 w-2.5 h-2.5 bg-secondary-600 rounded-full"></span>
                      )}
                      {item.key === "activities" && whoLikesMeCount > 0 && (
                        <span className="absolute top-1 -right-2 w-2.5 h-2.5 bg-secondary-600 rounded-full"></span>
                      )}
                    </div>

                    <p
                      className={`tp_small_medium mt-1 ${active ? "text-accent-500" : "text-neutral-white"
                        }`}
                    >
                      {item.label}
                    </p>
                  </div>
                </Link>
              );
            })}

            {/* Notification Bell */}
            {/* <button
              className="relative p-2 cursor-pointer flex-1"
              onClick={() => dispatch(openNotificationModal())}
            >
              <img
                src={images.bellIcon.src}
                alt="bell"
                className="w-[22px] grow-1 shrink-0"
              />

              <span className="absolute top-1 right-0 w-2.5 h-2.5 bg-secondary-600 rounded-full"></span>
            </button> */}

            <DropdownMenu userProfile={userProfile} isLoading={isLoading} />
            <Link href={"/upgrade"} className="cursor-pointer">
              <Button>
                <img src={images.pawnderBlack.src} alt="pawnderr+" /> PAWnderr+
              </Button>
            </Link>
          </ul>
        </nav>
      </header>
      <Notifications />
    </>
  );
};

export default Header;
