"use client";

import { RootState } from "@/store";
import { setStep } from "@/store/profileInfoSlice";
import { images } from "@/utils/images";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MatchPreferences, PetInformation, ProfileHeader } from ".";
import PersonalInfo from "./PersonalInfo";

const stepTitles: Record<number, string> = {
  0: "Edit Profile",
  1: "Personal Information",
  2: "Pet Information",
  3: "Match Preferences",
};

const EditProfile: FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const step = useSelector((state: RootState) => state.profileInfo.step);

  // Set first item as default on desktop
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768; // md breakpoint
    if (isDesktop && step === 0) {
      dispatch(setStep(1));
    }
  }, [step, dispatch]);

  const currentTitle = stepTitles[step] || "Edit Profile";

  return (
    <div className="edit_profile_wrapper common_container">
      <div className="mb-7">
        {/* Mobile: Show dynamic title, Desktop: Always show "Edit Profile" */}
        <ProfileHeader
          title={
            step === 0
              ? currentTitle
              : { base: currentTitle, md: "Edit Profile" }
          }
        />

        {/* Desktop: Grid layout with sidebar and content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar Navigation - Always visible on desktop, only when step=0 on mobile */}
          <div
            className={`md:col-span-4 ${step === 0 ? "block" : "hidden md:block"}`}
          >
            <ul className="py-5 px-6 md:px-5 bg-white shadow-[0px_4px_16.4px_0px_#0000001A] rounded-[40px]">
              <li
                className={`py-4 px-5 border-b md:border-0 md:rounded-full last:border-0 border-grey-700 flex items-center justify-between cursor-pointer transition-colors ${
                  step === 1
                    ? "md:bg-[#DBEAFF] md:text-blue"
                    : "text-light-grey2"
                }`}
                onClick={() => dispatch(setStep(1))}
              >
                <p className="body_large_medium">Personal Information</p>
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
                <p className="body_large_medium">Pet Information</p>
                <img
                  src={images.chevronRight.src}
                  className="w-2 block md:hidden"
                  alt="Navigate"
                />
              </li>
              <li
                className={`py-4 px-5 border-b md:border-0 md:rounded-full last:border-0 border-grey-700 flex items-center justify-between cursor-pointer transition-colors ${
                  step === 3
                    ? "md:bg-[#DBEAFF] md:text-blue"
                    : "text-light-grey2"
                }`}
                onClick={() => dispatch(setStep(3))}
              >
                <p className="body_large_medium">Match Preferences</p>
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
            {step === 1 && <PersonalInfo />}
            {step === 2 && <PetInformation />}
            {step === 3 && <MatchPreferences />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
