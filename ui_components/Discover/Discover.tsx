"use client";

import {
  discoverNearbyPets,
  fetchMyPet,
  fetchMyPetsCollection
} from "@/utils/api";
import { petsStorage } from "@/utils/pets-storage";
import { useRouter } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";

import { ensureUserLocationAndUpdate, getGenderColor } from "@/utils";
import { images } from "@/utils/images";
import { MyProfileCard, SwipingCards, YourStats } from ".";
import { IPetData } from "../Profile/types";
import { CustomAvatar } from "../Shared";
import { NearbyPet } from "./types";

const Discover: FC = () => {
  const router = useRouter();
  const [firstPetId, setFirstPetId] = useState<number | null>(null);
  const [petData, setPetData] = useState<IPetData | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(petData, "petData");
  const [premiumPets, setPremiumPets] = useState<NearbyPet[]>([]);
  const borderColor = getGenderColor(petData?.gender ?? "");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [swipingCardsHeight, setSwipingCardsHeight] = useState<
    number | undefined
  >(undefined);
  // Default to true (hidden) until location is successfully fetched
  const [isGeoRestricted, setIsGeoRestricted] = useState(true);

  useEffect(() => {
    const ensureFirstPetId = async () => {
      try {
        const storedPet = petsStorage.getFirstPet();
        if (storedPet) {
          setPetData(storedPet as any);
          setFirstPetId(storedPet.id);
          setLoading(false);
        }

        let id = petsStorage.getFirstPetId();

        if (!id) {
          const petsResp = await fetchMyPetsCollection();
          if (petsResp?.data) {
            petsStorage.set(petsResp.data);
            id = petsStorage.getFirstPetId();
            const newStoredPet = petsStorage.getFirstPet();
            if (newStoredPet) {
              setPetData(newStoredPet as any);
            }
          }
        }

        if (id) {
          setFirstPetId(id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error ensuring first pet id:", error);
        setLoading(false);
      }
    };

    ensureFirstPetId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!firstPetId) return;
      try {
        const resp = await fetchMyPet(Number(firstPetId));

        const petDetails = resp?.data;
        setPetData(petDetails);

        // Fetch premium pets
        try {
          await ensureUserLocationAndUpdate();
          const premiumResp = await discoverNearbyPets(Number(firstPetId), {
            is_premium: true
          });
          if (premiumResp?.data?.pets && Array.isArray(premiumResp.data.pets)) {
            setPremiumPets(premiumResp.data.pets);
          }
        } catch (err) {
          console.error("Error fetching premium pets:", err);
        }
      } catch (error) {
        console.error("Error fetching pet:", error);
      } finally {
        setLoading(false);
      }
    };

    if (firstPetId) {
      fetchData();
    }
  }, [firstPetId]);

  useEffect(() => {
    const updateHeight = () => {
      if (wrapperRef.current) {
        // Total height of the wrapper
        const totalHeight = wrapperRef.current.clientHeight;
        // Subtract vertical padding (md:py-5 = 40px) + mb-4 (16px) + some buffer
        // Note: The inner div layout might vary, but let's try to fit it.
        // If we want the white card to fill the wrapper, we should probably set height on it.
        // For now, let's calculate the height for SwipingCards.
        // 520px (default) + 40px padding = 560px approx required.
        // If screen is small, we naturally shrink.

        // Let's assume the white box takes up the full height minus some margin if needed.
        // The swiping cards container inside needs to be:
        // wrapperHeight - padding (40px) - header (approx 0 if empty)
        // Let's safe margin of 60px.
        setSwipingCardsHeight(totalHeight - 120);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const primaryImage =
    petData?.images?.find((img) => img.is_primary)?.image_url ||
    petData?.images?.[0]?.image_url;

  const profileData = {
    name: petData?.name ?? "",
    gender: petData?.gender ?? "",
    age: petData?.age ?? 0,
    barkoGraphy: petData?.bark_o_graphy ?? "",
    funFactOrHabit: petData?.fun_fact_or_habit ?? "",
    breed: petData?.breed?.name ?? "",
    location: "Gurugram",
    image: primaryImage,
    isVerified: petData?.is_verified,
    isPremium: petData?.user?.is_premium_user,
    isFoundingDog: petData?.is_founding_dog,
    petId: petData?.id
  };

  return (
    <div
      ref={wrapperRef}
      className="discover_wrapper common_container w-full my-6"
    >
      {!isGeoRestricted && premiumPets?.length > 0 && (
        <div className="flex my-3 gap-4 items-center overflow-x-auto hide-scrollbar">
          {premiumPets.map((pet, index) => (
            <div
              key={index}
              onClick={() => router.push(`/profile/${pet.id}?action=true`)}
            >
              <CustomAvatar
                src={pet.primary_image?.image_url}
                size={64}
                gender={pet.gender as any}
                name={pet.name}
                showPlus={true}
                plusIcon={images.pawnderrPlus.src}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 justify-center w-full h-full items-start">
        {/* Left Column - Your Stats */}
        {!isGeoRestricted && (
          <div className="hidden lg:block w-[320px] shrink-0">
            <YourStats borderColor={borderColor} />
          </div>
        )}

        {/* Middle Column - Swiping Cards */}
        <div className="flex-1 w-full max-w-[700px] flex justify-center">
          <div
            className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] border-2 md:px-5 md:py-8 md:rounded-xl box-border w-full flex flex-col h-[520px] md:h-[560px]"
            style={{ borderColor }}
          >
            <h2 className="font_fredoka text-2xl font-medium mb-3 text-center text-dark-grey hidden md:block">
              Discover Nearby Profiles
            </h2>
            <div className="flex-1 relative w-full h-full min-h-[440px]">
              <SwipingCards
                petData={petData}
                loading={loading}
                containerHeight={
                  swipingCardsHeight ? swipingCardsHeight - 60 : undefined
                }
                onGeoRestricted={(restricted) => setIsGeoRestricted(restricted)}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Featured Profile */}
        {!isGeoRestricted && (
          <div className="hidden lg:block w-[320px] shrink-0">
            <MyProfileCard {...profileData} borderColor={borderColor} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
