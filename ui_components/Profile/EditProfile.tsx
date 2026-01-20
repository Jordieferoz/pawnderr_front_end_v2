"use client";

import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MatchPreferences,
  PetInformation,
  ProfileHeader,
  UpdateGallery
} from ".";

import { RootState } from "@/store";
import { setStep } from "@/store/profileInfoSlice";
import { fetchPetRegistrationData } from "@/utils/api";
import { images } from "@/utils/images";

import { RegistrationMetadata } from "../Register/types";
import Loader from "../Shared/Loader";
import { showToast } from "../Shared/ToastMessage";
import PersonalInfo from "./PersonalInfo";
import { IPetData } from "./types";

interface EditProfileProps {
  petData?: IPetData | null;
  loading?: boolean;
}

const stepTitles: Record<number, string> = {
  0: "Edit Profile",
  1: "Personal Information",
  2: "Pet Information",
  3: "Update Gallery",
  4: "Match Preferences"
};

const EditProfile: FC<EditProfileProps> = ({ petData, loading = false }) => {
  const dispatch = useDispatch();
  const step = useSelector((state: RootState) => state.profileInfo.step);

  const [metadata, setMetadata] = useState<RegistrationMetadata | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  const stepDescriptions: Record<number, string> = {
    3: "Drag photos to change their order"
  };

  // Fetch metadata on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      setIsLoadingMetadata(true);
      try {
        const metadataResponse = await fetchPetRegistrationData();
        if (metadataResponse.statusCode === 200 && metadataResponse.data) {
          setMetadata(metadataResponse.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
        showToast({
          type: "error",
          message: "Failed to load form data. Please refresh the page."
        });
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, []);

  // Set first item as default on desktop
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768; // md breakpoint
    if (isDesktop && step === 0) {
      dispatch(setStep(1));
    }
  }, [step, dispatch]);

  const currentTitle = stepTitles[step] || "Edit Profile";
  const currentDesc = stepDescriptions[step];

  // Show loading state if metadata is loading
  if (isLoadingMetadata) {
    return (
      <div className="edit_profile_wrapper common_container">
        <div className="mb-7">
          <ProfileHeader title="Edit Profile" />
          <div className="flex items-center justify-center min-h-[400px] mt-16">
            <Loader size={40} text="Loading form data..." />
          </div>
        </div>
      </div>
    );
  }

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
          desc={currentDesc}
        />

        {/* Desktop: Grid layout with sidebar and content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-16">
          {/* Left Sidebar Navigation - Always visible on desktop, only when step=0 on mobile */}
          <div
            className={`md:col-span-4 ${step === 0 ? "block" : "hidden md:block"}`}
          >
            <ul className="py-5 px-6 md:px-5 bg-white shadow-[0px_4px_16.4px_0px_#0000001A] rounded-lg md:rounded-[40px]">
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
                <p className="body_large_medium">Update Gallery</p>
                <img
                  src={images.chevronRight.src}
                  className="w-2 block md:hidden"
                  alt="Navigate"
                />
              </li>
              <li
                className={`py-4 px-5 border-b md:border-0 md:rounded-full last:border-0 border-grey-700 flex items-center justify-between cursor-pointer transition-colors ${
                  step === 4
                    ? "md:bg-[#DBEAFF] md:text-blue"
                    : "text-light-grey2"
                }`}
                onClick={() => dispatch(setStep(4))}
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
            {step === 2 && (
              <PetInformation
                petData={petData}
                loading={loading}
                metadata={metadata}
              />
            )}
            {step === 3 && (
              <UpdateGallery petData={petData} loading={loading} />
            )}
            {step === 4 && (
              <MatchPreferences
                petData={petData}
                loading={loading}
                metadata={metadata}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
