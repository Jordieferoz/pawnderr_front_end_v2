"use client";

import { RootState } from "@/store";
import { setStep } from "@/store/profileInfoSlice";
import { images } from "@/utils/images";
import { useRouter } from "next/navigation";
import { FC } from "react";
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

  const currentTitle = stepTitles[step] || "Edit Profile";

  return (
    <div className="edit_profile_wrapper common_container">
      <div className="mb-7">
        <ProfileHeader title={currentTitle} />

        {step === 0 && (
          <ul className="py-5 px-6 bg-white shadow-[0px_4px_16.4px_0px_#0000001A] rounded-xl">
            <li
              className="py-4 px-5 border-b last:border-0 border-grey-500 flex items-center justify-between cursor-pointer"
              onClick={() => dispatch(setStep(1))}
            >
              <p className="body_large_medium">Personal Information</p>
              <img src={images.chevronRight.src} className="w-2" />
            </li>
            <li
              className="py-4 px-5 border-b last:border-0 border-grey-500 flex items-center justify-between cursor-pointer"
              onClick={() => dispatch(setStep(2))}
            >
              <p className="body_large_medium">Pet Information</p>
              <img src={images.chevronRight.src} className="w-2" />
            </li>
            <li
              className="py-4 px-5 border-b last:border-0 border-grey-500 flex items-center justify-between cursor-pointer"
              onClick={() => dispatch(setStep(3))}
            >
              <p className="body_large_medium">Match Preferences</p>
              <img src={images.chevronRight.src} className="w-2" />
            </li>
          </ul>
        )}

        {step === 1 && <PersonalInfo />}
        {step === 2 && <PetInformation />}
        {step === 3 && <MatchPreferences />}
      </div>
    </div>
  );
};

export default EditProfile;
