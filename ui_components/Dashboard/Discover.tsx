"use client";

import SwipingCards from "@/ui_components/Dashboard/SwipingCards";
import { CustomAvatar } from "@/ui_components/Shared";
import { images } from "@/utils/images";

import { FilterModal } from "../Modals";

const Discover = () => {
  return (
    <div className="discover_wrapper pb-10 common_container">
      <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:px-5 md:py-5 md:rounded-2xl md:w-[700px] md:mx-auto">
        <div className="items-center justify-between  mb-4">
          <div className="flex my-3 gap-4 items-center overflow-x-auto hide-scrollbar">
            <CustomAvatar
              src={images.doggo1.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />

            <CustomAvatar
              src={images.doggo2.src}
              size={64}
              type="countdown"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />

            <CustomAvatar
              src={images.doggo3.src}
              size={64}
              gender="male"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />

            <CustomAvatar
              src={images.doggo4.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />
            <CustomAvatar
              src={images.doggo4.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />
            <CustomAvatar
              src={images.doggo4.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />
            <CustomAvatar
              src={images.doggo4.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />
            <CustomAvatar
              src={images.doggo4.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />
            <CustomAvatar
              src={images.doggo4.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />
            <CustomAvatar
              src={images.doggo4.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />
          </div>
        </div>

        <SwipingCards />
      </div>
      <FilterModal />
    </div>
  );
};

export default Discover;
