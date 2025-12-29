"use client";

import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { setStep } from "@/store/profileInfoSlice";
import { images } from "@/utils/images";

import { BillingHistory, CurrentPlan, SubscriptionHeader } from ".";

const stepTitles: Record<number, string> = {
  0: "My Subscription",
  1: "Current Plan",
  2: "Billing History"
};

const MySubscription: FC = () => {
  const dispatch = useDispatch();
  const step = useSelector((state: RootState) => state.profileInfo.step);

  // Set first item as default on desktop
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768; // md breakpoint
    if (isDesktop && step === 0) {
      dispatch(setStep(1));
    }
  }, [step, dispatch]);

  const currentTitle = stepTitles[step] || "My Subscription";

  return (
    <div className="my_sub_wrapper common_container">
      <div className="mb-7">
        <SubscriptionHeader
          title={
            step === 0
              ? currentTitle
              : { base: currentTitle, md: "My Subscription" }
          }
        />

        {/* Desktop: Grid layout with sidebar and content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
          {/* Left Sidebar Navigation - Always visible on desktop, only when step=0 on mobile */}
          <div
            className={`md:col-span-4 ${step === 0 ? "block" : "hidden md:block"}`}
          >
            <ul className="py-5 px-6 md:px-5 bg-white shadow-[0px_4px_16.4px_0px_#0000001A] rounded-lg md:rounded-[40px] mt-6 md:mt-0">
              <li
                className={`py-4 px-5 border-b md:border-0 md:rounded-full last:border-0 border-grey-700 flex items-center justify-between cursor-pointer transition-colors ${
                  step === 1
                    ? "md:bg-[#DBEAFF] md:text-blue"
                    : "text-light-grey2"
                }`}
                onClick={() => dispatch(setStep(1))}
              >
                <p className="body_large_medium">Current Plan</p>
                <img
                  src={images.chevronRight.src}
                  className="w-2 block md:hidden"
                  alt="Navigate"
                />
              </li>
              <li
                className={`py-4 px-5 border-b md:border-0 md:rounded-full last:border-0 border-grey-700 flex items-center justify-between cursor-pointer transition-colors ${
                  step === 2
                    ? "md:bg-[#DBEAFF] md:text-blue"
                    : "text-light-grey2"
                }`}
                onClick={() => dispatch(setStep(2))}
              >
                <p className="body_large_medium">Billing History</p>
                <img
                  src={images.chevronRight.src}
                  className="w-2 block md:hidden"
                  alt="Navigate"
                />
              </li>
            </ul>
          </div>

          <div
            className={`md:col-span-8 ${step === 0 ? "hidden md:hidden" : "block"}`}
          >
            {step === 1 && <CurrentPlan />}
            {step === 2 && <BillingHistory />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySubscription;
