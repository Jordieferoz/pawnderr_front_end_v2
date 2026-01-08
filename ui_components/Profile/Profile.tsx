"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";

import { images } from "@/utils/images";

import { InfoCard, ProfileCard } from ".";
import Loader from "../Shared/Loader";
import { IProfileProps } from "./types";

const Profile: FC<IProfileProps> = ({ petData, loading }) => {
  const router = useRouter();

  const primaryImage = petData?.images?.find(
    (img) => img.display_order === 0
  )?.image_url;

  const profileData = {
    name: petData?.name ?? "",
    gender: petData?.gender ?? "",
    age: petData?.age ?? 0,
    breed: petData?.breed?.name ?? "",
    location: "Gurugram",
    image: primaryImage
  };

  // Dynamically map all attributes for Floof's Story
  const floofStoryList = [
    { left: "Nickname", right: petData?.nickname ?? "" },
    ...(petData?.attributes?.map((attr) => ({
      left: attr.attribute_name,
      right: attr.selected_options?.map((opt) => opt.value).join(", ") || ""
    })) || [])
  ];

  // Dynamically map all preferences for What's Pup looking for
  const preferences = petData?.preferences;
  const pupLookingForList = [
    // Add Age Limit first
    {
      left: "Age Limit",
      right: `${preferences?.min_age || 0} Yrs - ${preferences?.max_age || 0} Yrs`
    },
    // Add Preferred Breeds
    {
      left: "Preferred Breeds",
      right: preferences?.breed_match_type || ""
    },
    // Dynamically map all selections
    ...(preferences?.selections?.map((selection: any) => ({
      left: selection.type_name,
      right: selection.selected_option?.value || ""
    })) || [])
  ];

  if (loading) {
    return (
      <div className="profile_wrapper common_container">
        <div className="flex items-center my-4 justify-between mb-7">
          <div className="flex items-center gap-3">
            <img className="w-10 h-10" src={images.backBtn.src} alt="back" />
            <h4 className="display4_medium text-accent-900">Profile</h4>
          </div>
        </div>

        {/* Loader */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader size="lg" text="Loading profile..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile_wrapper common_container pb-10">
      <div className="flex items-center my-4 justify-between mb-7">
        <div className="flex items-center gap-3">
          <img
            onClick={() => router.back()}
            className="w-10 h-10 cursor-pointer"
            src={images.backBtn.src}
            alt="back"
          />
          <h4 className="display4_medium text-accent-900">Profile</h4>
        </div>
        <img
          className="cursor-pointer"
          onClick={() => {
            if (petData?.id) {
              router.push(`/profile/edit/${petData.id}`);
            }
          }}
          src={images.editIcon.src}
          alt="edit"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-7">
        <div className="md:col-span-4 md:order-2 md:sticky md:top-25">
          <ProfileCard {...profileData} />
        </div>
        <div className="md:col-span-8 md:order-1 flex flex-col gap-7.5">
          <InfoCard
            type="desc"
            title="Bio (aka Bark-o-graphy):"
            image={petData?.images?.[1]?.image_url || images.doggo2.src}
            desc={petData?.bark_o_graphy ?? ""}
            list={[]}
          />
          <InfoCard
            type="list"
            title="Floof's Story:"
            image={petData?.images?.[2]?.image_url || images.doggo3.src}
            list={floofStoryList}
            desc={""}
          />

          <InfoCard
            type="desc"
            title="Fun Fact:"
            image={petData?.images?.[3]?.image_url || images.doggo2.src}
            desc={petData?.fun_fact_or_habit ?? ""}
            list={[]}
          />

          <InfoCard
            type="list"
            title="What's Pup looking for:"
            image={petData?.images?.[4]?.image_url || images.doggo3.src}
            list={pupLookingForList}
            desc={""}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
