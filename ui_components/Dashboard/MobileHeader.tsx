"use client";

import Link from "next/link";
import { FC } from "react";

import { useUserProfileFromStorage } from "@/hooks";
import { images } from "@/utils/images";

import { Bell } from "lucide-react";
import { useDispatch } from "react-redux";
import { openNotificationModal } from "@/store/modalSlice";
import { DropdownMenu } from ".";
import { Notifications } from "../Shared/Notifications";

const MobileHeader: FC = () => {
  const dispatch = useDispatch();
  const { userProfile, isLoading } = useUserProfileFromStorage();

  return (
    <>
      <header className="fixed py-4 w-full left-0 top-0 z-50 bg-white md:hidden">
        <nav className="container mx-auto common_container flex items-center justify-between gap-4">
          <Link href={"/dashboard"}>
            <img
              src={images.logoHorizontal.src}
              alt="logo"
              className="w-[168px]"
            />
          </Link>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            {/* <button
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => dispatch(openNotificationModal())}
            >
              <img src={images.bellIcon.src} alt="bell" />
              
              <span className="absolute top-1 right-0 w-2.5 h-2.5 bg-secondary-600 rounded-full"></span>
            </button> */}
            <DropdownMenu userProfile={userProfile} isLoading={isLoading} />
          </div>
        </nav>
      </header>
      <Notifications />
    </>
  );
};

export default MobileHeader;
