"use client";

import Link from "next/link";
import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { setStep } from "@/store/profileInfoSlice";
import { images } from "@/utils/images";

const CurrentPlan: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setStep(1));
  }, [dispatch]);

  return (
    <div className="bg-white shadow-[0px_4px_16.4px_0px_#0000001A] px-5 py-5 md:px-10 md:py-10 md:rounded-[40px] rounded-lg mt-10 md:mt-0">
      <div className="flex items-center justify-between gap-3 pb-7 border-b border-grey-700">
        <img src={images.pawYellowBlueBg.src} alt="plan" className="w-20" />
        <div>
          <p className="text-lg font-medium text-accent-900 font_fredoka">
            Annual Plan
          </p>
          <p>₹999/Year</p>
        </div>
      </div>
      <ul className="mt-4 mb-8 flex flex-col gap-4">
        <li className="flex items-center gap-2 justify-between heading4_medium text-accent-900">
          Last Subscription:{" "}
          <span className="text-neutral-white">November 04, 2025</span>
        </li>
        <li className="flex items-center gap-2 justify-between heading4_medium text-accent-900">
          Subscription Due:
          <span className="text-neutral-white">December 04, 2025</span>
        </li>
      </ul>
      <Button className="w-full md:w-auto mb-3 md:mx-auto block md:px-20">
        Cancel Subscription
      </Button>
      <Link
        href={"/"}
        className="heading4_medium underline text-neutral-white block text-center"
      >
        Manage Subscription
      </Link>
    </div>
  );
};

export default CurrentPlan;
