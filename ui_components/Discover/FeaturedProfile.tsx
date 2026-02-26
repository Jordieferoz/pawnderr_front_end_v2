"use client";

import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { NearbyPet } from "./types";

interface FeaturedProfileProps {
  pet?: NearbyPet;
}

const FeaturedProfile: FC<FeaturedProfileProps> = ({ pet }) => {
  const router = useRouter();

  if (!pet) {
    return (
      <div className="bg-white rounded-2xl shadow-[0px_4px_16.4px_0px_#0000001A] p-4 w-full h-[520px] md:h-[560px] flex items-center justify-center">
        <p className="text-gray-500">No featured profile available</p>
      </div>
    );
  }

  const imageUrl = pet.primary_image?.image_url || images.doggo1.src;

  let genderDisplay = pet.gender;
  if (pet.gender === "male") {
    genderDisplay = "Male";
  } else if (pet.gender === "female") {
    genderDisplay = "Female";
  }

  let ageText = `${pet.age} Years`;
  if (pet.age === 0) {
    ageText = "Less than 1 Year";
  } else if (pet.age === 1) {
    ageText = "1 Year";
  }

  const breedText = (pet as any).breed || "Mixed Breed";

  return (
    <div className="bg-white rounded-[24px] shadow-[0px_4px_16.4px_0px_#0000001A] p-4 w-full flex flex-col h-[520px] md:h-[560px]">
      <div
        className="relative w-full h-[280px] rounded-xl overflow-hidden mb-4 shadow-sm shrink-0 cursor-pointer"
        onClick={() => router.push(`/profile/${pet.id}?action=true`)}
      >
        <img
          src={imageUrl}
          alt={pet.name}
          className="w-full h-full object-cover"
        />
        {pet.is_founding_dog && (
          <img
            src={images.isFoundingDog.src}
            alt="Founding Dog"
            className="w-12 h-12 absolute top-3 left-3 z-10"
          />
        )}
        {pet.is_premium_user && (
          <img
            src={images.crownYellowBg.src}
            alt="Premium"
            className="w-9 h-9 absolute top-3 right-3 z-10"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col px-2">
        <div className="flex items-center flex-wrap gap-2 mb-1">
          <h2
            className="text-2xl font-bold text-gray-900 cursor-pointer"
            onClick={() => router.push(`/profile/${pet.id}?action=true`)}
          >
            {pet.name}
          </h2>
          <span className="text-sm text-gray-600 font-medium">
            {genderDisplay}, {ageText}
          </span>
          {pet.is_verified && (
            <img
              src={images.verified.src}
              alt="Verified"
              className="w-5 h-5 flex-shrink-0"
            />
          )}
        </div>
        <p className="text-gray-400 text-sm mb-4">{breedText}</p>

        <p className="text-gray-600 text-[15px] leading-snug line-clamp-3 overflow-hidden text-ellipsis italic">
          {pet.bark_o_graphy ||
            `${pet.name} is a lovely ${breedText} looking for friends!`}
        </p>
      </div>

      <div className="mt-auto pt-4 flex-shrink-0">
        <Button
          onClick={() => router.push(`/profile/${pet.id}?action=true`)}
          className="w-full bg-primary-500 hover:bg-primary-600 text-black font-semibold py-6 rounded-2xl shadow-md text-lg"
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default FeaturedProfile;
