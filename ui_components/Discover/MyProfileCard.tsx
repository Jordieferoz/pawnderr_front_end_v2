"use client";

import { FC } from "react";

import { Button } from "@/components/ui/button";
import { formatAgeText } from "@/utils";
import { images } from "@/utils/images";
import { useRouter } from "next/navigation";
import { IMyProfileCardProps } from "../Profile/types";

const MyProfileCard: FC<IMyProfileCardProps> = ({
  name,
  gender,
  age,
  breed,
  location,
  barkoGraphy,
  funFactOrHabit,
  image,
  isVerified,
  isFoundingDog,
  isPremium,
  petId,
  borderColor
}) => {
  const router = useRouter();
  return (
    <div
      className="bg-white hidden min-h-[589px] lg:block w-[320px] shrink-0 p-4 shadow-[0px_4px_10.6px_0px_#0000001A] rounded-xl relative border-2"
      style={{ borderColor }}
    >
      <div className="relative">
        <img
          src={image}
          className="w-[284px] h-[284px] rounded-xl mb-4 object-cover"
          alt="image"
        />
        {isFoundingDog && (
          <img
            src={images.isFoundingDog.src}
            alt="foundingDog"
            className="w-14 h-14 absolute top-4.5 left-5 z-20"
          />
        )}
        {isPremium && (
          <img
            src={images.crownYellowBg.src}
            alt="premium"
            className="w-10 h-10 absolute top-4.5 right-5 z-20"
          />
        )}
      </div>
      <div className="flex items-start justify-between flex-col pb-3.5 border-grey-600 border-b border-dashed">
        <h3 className="text-[32px] font_fredoka font-medium text-dark-grey2 flex items-baseline gap-2">
          {name}{" "}
          <div className="flex items-center gap-2">
            <span className="body_large_medium capitalize block">
              {formatAgeText(gender ?? "", age ?? 0)}
            </span>
            {isVerified && <img src={images.verified.src} alt="verified" />}
          </div>
        </h3>
        <p className="text-grey-500 text-base font_fredoka leading-snug">
          {breed}, {location}
        </p>
      </div>
      <h5 className="font-medium text-xl font_fredoka text-dark-grey line-clamp-2 text-ellipsis overflow-hidden my-3.5">
        {barkoGraphy ?? funFactOrHabit}
      </h5>
      <div className="mt-auto pt-6 pb-3">
        <Button
          onClick={() => router.push(`/profile/${petId}`)}
          className="font_fredoka font-medium w-full"
        >
          View Your Profile
        </Button>
      </div>
    </div>
  );
};

export default MyProfileCard;
