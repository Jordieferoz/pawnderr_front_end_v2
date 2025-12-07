"use client";

import { RootState } from "@/store";
import { images } from "@/utils/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IProfileHeaderProps } from "./types";

const ProfileHeader: FC<IProfileHeaderProps> = ({ title }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);

  const step = useSelector((state: RootState) => state.profileInfo.step);

  // Detect if we're on desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleBackClick = () => {
    // Desktop: always go back to previous route
    if (isDesktop) {
      router.back();
    } else {
      // Mobile: go back to step 0 if not already there, otherwise go to previous route
      if (step !== 0) {
        dispatch({ type: "profile/setStep", payload: 0 });
      } else {
        router.back();
      }
    }
  };

  // Check if title is an object with responsive values or a simple string
  const isTitleObject = typeof title === "object" && title !== null;
  const mobileTitle = isTitleObject ? title.base : title;
  const desktopTitle = isTitleObject ? title.md : title;

  return (
    <div className="relative my-4 flex items-start gap-3">
      <Image
        src={images.backBtn.src}
        alt="back"
        className="w-10 h-10 rounded-full cursor-pointer"
        width={40}
        height={40}
        role="button"
        aria-label="Go back"
        onClick={handleBackClick}
      />

      {/* Mobile title */}
      <h4 className="display4_medium text-accent-900 pr-16 md:hidden">
        {mobileTitle}
      </h4>

      {/* Desktop title */}
      <h4 className="display4_medium text-accent-900 pr-16 hidden md:block">
        {desktopTitle}
      </h4>
    </div>
  );
};

export default ProfileHeader;
