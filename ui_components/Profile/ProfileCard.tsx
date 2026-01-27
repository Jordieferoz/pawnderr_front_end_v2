import { FC } from "react";

import { IProfileCardProps } from "./types";
import { images } from "@/utils/images";

const ProfileCard: FC<IProfileCardProps> = ({
  name,
  gender,
  age,
  breed,
  location,
  image,
  isVerified,
  isPremium,
  showActions,
  onLike,
  onDislike
}) => {
  return (
    <div className="bg-white p-4 shadow-[0px_4px_10.6px_0px_#0000001A] rounded-xl relative">
      <img src={image} className="w-full rounded-xl mb-4" alt="image" />
      {isPremium && (
        <img
          src={images.premiumBadge.src}
          className="absolute top-10 left-10"
          alt="image"
        />
      )}
      <div className="flex items-center justify-between">
        <h3 className="text-[32px] font_fredoka font-medium text-dark-grey2 flex items-baseline gap-2">
          {name}{" "}
          <div className="flex items-center gap-2">
            <span className="body_large_medium capitalize block">
              {gender}, {age} Years
            </span>
            {isVerified && <img src={images.verified.src} alt="verified" />}
          </div>
        </h3>
        <p className="text-grey-500 text-base font_fredoka leading-snug">
          {breed}, {location}
        </p>
      </div>
      {showActions && (
        <div className="flex justify-center items-center gap-5 mt-6">
          <button
            onClick={onDislike}
            className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            <img src={images.dislike.src} alt="Dislike" className="w-5 h-5" />
          </button>
          <button className="bg-primary-500 rounded-full w-[68px] h-[68px] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform">
            <img
              src={images.pawYellow.src}
              alt="Super like"
              className="h-[36px]"
            />
          </button>
          <button
            onClick={onLike}
            className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            <img src={images.like.src} alt="Like" className="w-[28px]" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
