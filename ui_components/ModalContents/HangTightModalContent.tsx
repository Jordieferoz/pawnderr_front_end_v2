"use client";

import { FC } from "react";

import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";
import { GenderCard } from "../Shared";

const HangTightModalContent: FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl">
      <img
        src={images.pawYellow.src}
        alt="hang tight"
        className="w-20 mx-auto mb-2"
      />
      <h4 className="display4_medium text-dark-brown text-center mb-3">
        Hang Tight
      </h4>
      <p className="text-light-grey2 text-center body_large_medium mb-6">
        You've matched. Now it's her move. Once she starts the conversation,
        you'll be notified instantly.
      </p>
      <div className="relative py-8 flex ml-4">
        <GenderCard
          imageSrc={images.doggo1.src}
          gender="male"
          className="mx-auto -rotate-2"
        />
        <GenderCard
          imageSrc={images.doggo1.src}
          gender="female"
          className="mx-auto translate-y-[40px] rotate-2 relative translate-x-[-40px]"
        />
      </div>
      <div className="mt-15">
        <Button className="w-full">Or Go Premium</Button>
      </div>
    </div>
  );
};

export default HangTightModalContent;
