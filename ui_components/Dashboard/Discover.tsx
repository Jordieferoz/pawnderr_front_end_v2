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
      <div className="my-3 flex items-center gap-4">
        <img
          className="cursor-pointer w-10"
          src={images.filterIcon.src}
          onClick={handleOpenFilter}
        />
        <div className="grid grid-cols-4 gap-4 items-center justify-center">
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
        </div>
      </div>
      <SwipingCards />
      <FilterModal />
    </div>
  );
};

export default Discover;
