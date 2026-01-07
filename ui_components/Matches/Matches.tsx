"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";

import { images } from "@/utils/images";

import { MatchedCard } from ".";
import { CustomAvatar } from "../Shared";

const Matches: FC = () => {
  const router = useRouter();

  return (
    <div className="matches_wrapper common_container">
      <div className="flex items-start my-4 justify-between mb-7">
        <div className="flex items-center gap-3">
          <img
            onClick={() => router.back()}
            className="w-10 h-10"
            src={images.backBtn.src}
            alt="back"
          />
          <h4 className="display4_medium text-accent-900">Matches</h4>
        </div>
        <div className="grid grid-cols-4 gap-4 items-center justify-center">
          <CustomAvatar
            src={images.doggo1.src}
            size={48}
            gender="female"
            name="Frank"
            showPlus
            plusIcon={images.pawnderrPlus.src}
          />

          <CustomAvatar
            src={images.doggo2.src}
            size={48}
            type="countdown"
            name="Frank"
            showPlus
            plusIcon={images.pawnderrPlus.src}
          />

          <CustomAvatar
            src={images.doggo3.src}
            size={48}
            gender="male"
            name="Frank"
            showPlus
            plusIcon={images.pawnderrPlus.src}
          />

          <CustomAvatar
            src={images.doggo4.src}
            size={48}
            gender="female"
            name="Frank"
            showPlus
            plusIcon={images.pawnderrPlus.src}
          />
        </div>
      </div>

      <MatchedCard />
    </div>
  );
};

export default Matches;
