"use client";

import { RootState } from "@/store";
import { images } from "@/utils/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IProfileHeaderProps } from "./types";

const ProfileHeader: FC<IProfileHeaderProps> = ({ title }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const step = useSelector((state: RootState) => state.profileInfo.step);

  const handleBackClick = () => {
    if (step !== 0) {
      dispatch({ type: "profile/setStep", payload: 0 });
    } else {
      router.back();
    }
  };

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

      <h4 className="display4_medium  text-accent-900 pr-16">{title}</h4>
    </div>
  );
};

export default ProfileHeader;
