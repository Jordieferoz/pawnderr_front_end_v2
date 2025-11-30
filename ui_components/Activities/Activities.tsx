"use client";

import { openFilterModal } from "@/store/modalSlice";
import { images } from "@/utils/images";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { CustomAvatar } from "../Shared";

const Activities: FC = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const handleOpenFilter = () => {
    dispatch(openFilterModal());
  };

  return (
    <div className="activities_wrapper common_container">
      <div className="flex items-center my-4 justify-between mb-7">
        <div className="flex items-center gap-3">
          <img
            onClick={() => router.back()}
            className="w-10 h-10"
            src={images.backBtn.src}
          />
          <h4 className="display4_medium text-accent-900 flex gap-2">
            Activities <img src={images.pawnderrPlus.src} className="w-8 h-8" />
          </h4>
        </div>
      </div>
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
    </div>
  );
};

export default Activities;
