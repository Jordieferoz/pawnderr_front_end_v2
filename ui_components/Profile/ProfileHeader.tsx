"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { images } from "@/utils/images";

import { IProfileHeaderProps } from "./types";

const ProfileHeader: FC<IProfileHeaderProps> = ({ title, desc }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);

  const step = useSelector((state: RootState) => state.profileInfo.step);
  console.log(step, "step");
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

  // Check if desc is an object with responsive values or a simple string
  const isDescObject = typeof desc === "object" && desc !== null;
  const mobileDesc = isDescObject ? desc.base : desc;
  const desktopDesc = isDescObject ? desc.md : desc;

  return (
    <div className="relative my-4">
      <div className="flex items-center gap-3">
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

        <div className="flex-1 relative">
          {/* Mobile title */}
          <h4 className="display4_medium text-accent-900 md:hidden">
            {mobileTitle}
          </h4>

          {/* Desktop title */}
          <h4 className="display4_medium text-accent-900 pr-16 hidden md:block">
            {desktopTitle}
          </h4>

          {/* Description - show if provided */}
          {desc && (
            <>
              {/* Mobile description */}
              <p className="body_large_medium text-dark-grey mt-2 absolute left-0 md:hidden">
                {mobileDesc}
              </p>

              {/* Desktop description */}
              <p className="body_large_medium text-dark-grey mt-1 absolute left-0 pr-16 hidden md:block">
                {desktopDesc}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
