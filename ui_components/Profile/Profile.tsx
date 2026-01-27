"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";

import { images } from "@/utils/images";

import { Button } from "@/components/ui/button";
import { swipePetAction } from "@/utils/api";
import { InfoCard, ProfileCard } from ".";
import Loader from "../Shared/Loader";
import { IProfileProps } from "./types";

const Profile: FC<IProfileProps> = ({ petData, loading, error }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showActions = searchParams.get("action") === "true";

  const handleAction = async (action: "like" | "pass") => {
    if (petData?.id) {
      try {
        await swipePetAction({
          pet_id: petData.id,
          action
        });
        router.back();
      } catch (err) {
        console.error("Error performing action:", err);
      }
    }
  };
  const primaryImage = petData?.images?.find(
    (img) => img.display_order === 0
  )?.image_url;

  const profileData = {
    name: petData?.name ?? "",
    gender: petData?.gender ?? "",
    age: petData?.age ?? 0,
    breed: petData?.breed?.name ?? "",
    location: "Gurugram",
    image: primaryImage,
    isVerified: petData?.is_verified,
    isPremium: petData?.user?.is_premium_user
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
    {
      left: "Age Limit",
      right: `${preferences?.min_age || 0} Yrs - ${preferences?.max_age || 0} Yrs`
    },
    {
      left: "Preferred Breeds",
      right: preferences?.breed_match_type || ""
    },
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

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader size={40} text="Loading profile..." />
          </div>
        </div>
      </div>
    );
  }

  if (error || !petData) {
    return (
      <div className="profile_wrapper common_container">
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
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4 text-center">
            <h3 className="text-2xl font-semibold text-accent-900">
              Profile Not Found
            </h3>
            <Button onClick={() => router.push("/")} className="mt-4 px-6 py-2">
              Back to Home
            </Button>
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
        {petData?.preferences?.preference_id && (
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
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-7">
        {/* Left Column */}
        <div className="flex flex-col gap-7.5 md:col-span-8">
          <ProfileCard
            {...profileData}
            showActions={showActions}
            onLike={() => handleAction("like")}
            onDislike={() => handleAction("pass")}
          />

          <InfoCard
            type="desc"
            title="Bio (aka Bark-o-graphy):"
            image={petData?.images?.[1]?.image_url || images.doggo2.src}
            desc={petData?.bark_o_graphy ?? ""}
            list={[]}
          />

          <InfoCard
            type="desc"
            title="Fun Fact:"
            image={petData?.images?.[3]?.image_url || images.doggo2.src}
            desc={petData?.fun_fact_or_habit ?? ""}
            list={[]}
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-7.5 md:col-span-4">
          <InfoCard
            type="list"
            title="Floof's Story:"
            image={petData?.images?.[2]?.image_url || images.doggo3.src}
            list={floofStoryList}
            desc={""}
            className="text-2xl font-medium text-dark-grey2 border-b border-[#9B9B9B6E] pb-6 border-dashed"
          />

          <InfoCard
            type="list"
            title="What's Pup looking for:"
            image={petData?.images?.[4]?.image_url || images.doggo3.src}
            list={pupLookingForList}
            desc={""}
            className="text-2xl font-medium text-dark-grey2 border-b border-[#9B9B9B6E] pb-6 border-dashed"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
