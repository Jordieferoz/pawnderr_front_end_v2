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

  const [premiumPets, setPremiumPets] = useState<NearbyPet[]>([]);
  const borderColor = getGenderColor(petData?.gender ?? "");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const premiumRowRef = useRef<HTMLDivElement>(null);
  const [swipingCardsHeight, setSwipingCardsHeight] = useState<
    number | undefined
  >(undefined);
  const [premiumSlotCount, setPremiumSlotCount] = useState(5);
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
          if (
            premiumResp?.data?.data?.pets &&
            Array.isArray(premiumResp.data.data.pets)
          ) {
            setPremiumPets(premiumResp.data.data.pets);
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
        const totalHeight = wrapperRef.current.clientHeight;
        setSwipingCardsHeight(totalHeight + 10);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Recalculate how many slots fit in the premium-pets row using ResizeObserver
  useEffect(() => {
    const SLOT_WIDTH = 80; // avatar 64px + gap 16px
    const PADDING = 32; // p-4 = 16px each side

    const calcCount = (width: number) => {
      const count = Math.max(1, Math.floor((width - PADDING) / SLOT_WIDTH));
      setPremiumSlotCount(count);
    };

    let observer: ResizeObserver | null = null;
    const raf = requestAnimationFrame(() => {
      const el = premiumRowRef.current;
      if (!el) return;
      calcCount(el.clientWidth);
      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          calcCount(entry.contentRect.width);
        }
      });
      observer.observe(el);
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [isGeoRestricted, premiumPets.length]);

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
      className="discover_wrapper common_container w-full lg:my-6"
    >
      {!isGeoRestricted && premiumPets?.length > 0 && (
        <div
          ref={premiumRowRef}
          className="flex my-3 absolute left-0 top-[-26px] w-[inherit] lg:relative lg:top-0 lg:w-auto shadow-[0px_4px_19.1px_7px_#0000000A] p-4 bg-white lg:rounded-xl border-b-2 lg:border-2 gap-4 items-center overflow-x-auto hide-scrollbar"
          style={{ borderColor }}
        >
          {/* Real premium pets */}
          {premiumPets.slice(0, premiumSlotCount).map((pet, index) => (
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

          {/* Empty placeholder slots to fill remaining space */}
          {Array.from({
            length: Math.max(0, premiumSlotCount - premiumPets.length)
          }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="inline-flex flex-col items-center gap-1.5"
            >
              <div className="relative" style={{ width: 64, height: 64 }}>
                {/* Crown badge */}
                {images.pawnderrPlus?.src && (
                  <img
                    src={images.pawnderrPlus.src}
                    className="absolute top-1 -right-1 w-[18px] h-[18px] z-20"
                    alt="plus"
                  />
                )}
                {/* Grey border ring */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "#D1D5DB",
                    WebkitMask:
                      "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))"
                  }}
                />
                {/* Inner placeholder */}
                <div className="w-full h-full rounded-full overflow-hidden p-1">
                  <div className="w-full h-full rounded-full bg-[#F3F4F6] flex items-center justify-center">
                    {/* Image placeholder icon */}
                    <img
                      src={images.premiumPlaceholder.src}
                      className="w-8"
                      alt="premium"
                    />
                  </div>
                </div>
              </div>
              {/* Dashed name placeholder */}
              <p className="text-xs text-[#D1D5DB] tracking-widest">———</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 justify-center w-full h-full items-start mt-10 lg:mt-0">
        {/* Left Column - Your Stats */}
        {!isGeoRestricted && <YourStats borderColor={borderColor} />}

        {/* Middle Column - Swiping Cards */}
        <div
          className="md:bg-white flex-1 w-full min-h-[589px] max-w-[700px] flex justify-center md:shadow-[0px_4px_16.4px_0px_#0000001A] border-0 lg:border-2 md:px-5 md:py-8 md:rounded-xl box-border flex-col h-[520px] md:h-[560px]"
          style={{ borderColor }}
        >
          <h2 className="font_fredoka text-2xl font-medium mb-10 text-center text-dark-grey hidden md:block">
            Discover Nearby Profiles
          </h2>
          <div className="flex-1 relative w-full h-full min-h-[440px]">
            <SwipingCards
              petData={petData}
              loading={loading}
              containerHeight={
                swipingCardsHeight ? swipingCardsHeight - 100 : undefined
              }
              onGeoRestricted={(restricted) => setIsGeoRestricted(restricted)}
            />
          </div>
        </div>

        {/* Right Column - Featured Profile */}
        {!isGeoRestricted && (
          <MyProfileCard {...profileData} borderColor={borderColor} />
        )}
      </div>
    </div>
  );
};

export default Discover;
