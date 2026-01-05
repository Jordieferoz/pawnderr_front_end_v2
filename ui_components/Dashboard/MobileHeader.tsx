"use client";

import Link from "next/link";
import { FC } from "react";

import { useUserProfile } from "@/hooks";
import { images } from "@/utils/images";

import { DropdownMenu } from ".";

const MobileHeader: FC = () => {
  const { userProfile, isLoading } = useUserProfile();

  return (
    <header className="fixed py-6 w-full left-0 top-0 z-50 bg-white md:hidden">
      <nav className="container mx-auto common_container flex items-center justify-between gap-4">
        <Link href={"/"}>
          <img
            src={images.logoHorizontal.src}
            alt="logo"
            className="w-[168px]"
          />
        </Link>

        <DropdownMenu userProfile={userProfile} isLoading={isLoading} />
      </nav>
    </header>
  );
};

export default MobileHeader;
