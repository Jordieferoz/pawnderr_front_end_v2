"use client";

import { openFilterModal } from "@/store/modalSlice";
import SwipingCards from "@/ui_components/Dashboard/SwipingCards";
import { CustomAvatar } from "@/ui_components/Shared";
import { images } from "@/utils/images";
import { useDispatch } from "react-redux";
import { FilterModal } from "../Modals";

const Discover = () => {
  const dispatch = useDispatch();
  const handleOpenFilter = () => {
    dispatch(openFilterModal());
  };
  return (
    <div className="discover_wrapper common_container">
      <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:px-8 md:py-9 md:rounded-2xl md:w-[700px] md:mx-auto">
        <div className="items-center justify-between hidden md:flex mb-4">
          <h4 className="display4_medium text-accent-900 font-normal">
            Discover
          </h4>{" "}
          <img
            className="cursor-pointer w-10"
            src={images.filterIcon.src}
            onClick={handleOpenFilter}
          />
        </div>
        <div className="my-3 flex items-center gap-4">
          <img
            className="cursor-pointer w-10 md:hidden"
            src={images.filterIcon.src}
            onClick={handleOpenFilter}
          />
          <div className="flex gap-4 items-center overflow-x-auto hide-scrollbar">
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
