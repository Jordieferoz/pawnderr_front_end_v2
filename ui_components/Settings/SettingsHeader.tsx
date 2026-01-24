"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

import { images } from "@/utils/images";

interface SettingsHeaderProps {
  title: string | { base: string; md: string };
  onBack?: () => void;
}

const SettingsHeader: FC<SettingsHeaderProps> = ({ title, onBack }) => {
  const router = useRouter();
  // const [isDesktop, setIsDesktop] = useState(false);

  // Detect if we're on desktop
  useEffect(() => {
    const checkDesktop = () => {
      // setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  // Check if title is an object with responsive values or a simple string
  const isTitleObject = typeof title === "object" && title !== null;
  const mobileTitle = isTitleObject ? title.base : title;
  const desktopTitle = isTitleObject ? title.md : title;

  return (
    <div className="relative py-4 flex items-start gap-3">
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
      <h4 className="display4_medium text-accent-900 pr-10 md:hidden">
        {mobileTitle}
      </h4>

      {/* Desktop title */}
      <h4 className="display4_medium text-accent-900 pr-16 hidden md:block">
        {desktopTitle}
      </h4>
    </div>
  );
};

export default SettingsHeader;
