"use client";

import { openFilterModal } from "@/store/modalSlice";
import SwipingCards from "@/ui_components/Dashboard/SwipingCards";
import { CustomAvatar } from "@/ui_components/Shared";
import { images } from "@/utils/images";
import { useDispatch } from "react-redux";

const Discover = () => {
  const dispatch = useDispatch();
  const handleOpenFilter = () => {
    dispatch(openFilterModal());
  };
  return (
    <div className="discover_wrapper">
      <h1 className="display3 my-4">Discover</h1>
      <div className="flex items-center gap-4 mb-16">
        <div className="cursor-pointer" onClick={handleOpenFilter}>
          <img src={images.filterIcon.src} />
        </div>

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

      <SwipingCards />
    </div>
  );
};

export default Discover;
