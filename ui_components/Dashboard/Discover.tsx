"use client";

import SwipingCards from "@/ui_components/Dashboard/SwipingCards";
import {
  discoverNearbyPets,
  fetchMyPet,
  fetchMyPetsCollection,
  fetchSubscriptionStatus
} from "@/utils/api";
import { images } from "@/utils/images";
import { petsStorage } from "@/utils/pets-storage";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import CustomAvatar from "../Shared/CustomAvatar";

import { IPetData } from "../Profile/types";
import { showToast } from "../Shared/ToastMessage";
import { NearbyPet } from "./types";

const Discover = () => {
  const dispatch = useDispatch();
  const [firstPetId, setFirstPetId] = useState<number | null>(null);
  const [petData, setPetData] = useState<IPetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [premiumPets, setPremiumPets] = useState<NearbyPet[]>([]);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [swipingCardsHeight, setSwipingCardsHeight] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      try {
        const resp = await fetchSubscriptionStatus();
        setIsSubscribed(Boolean(resp?.data?.is_premium));
      } catch (error: any) {
        setIsSubscribed(false);
        showToast({
          type: "error",
          message:
            error?.message ||
            "Unable to load subscription status. Please try again."
        });
      } finally {
        setIsSubscriptionLoading(false);
      }
    };

    loadSubscriptionStatus();
  }, []);

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
        setSwipingCardsHeight(totalHeight - 60);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="discover_wrapper common_container md:h-[calc(100vh-120px)] h-[calc(100vh-166px)] w-full"
    >
      <div
        className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:px-5 md:py-5 md:rounded-2xl md:w-[700px] md:mx-auto box-border"
        style={{ height: "100%" }}
      >
        <div className="items-center justify-between mb-4">
          <div className="flex my-3 gap-4 items-center overflow-x-auto hide-scrollbar">
            {premiumPets.map((pet, index) => (
              <CustomAvatar
                key={index}
                src={pet.primary_image?.image_url}
                size={64}
                gender={pet.gender as any}
                name={pet.name}
                showPlus={true}
                plusIcon={images.pawnderrPlus.src}
              />
            ))}
          </div>
        </div>

        <SwipingCards
          petData={petData}
          loading={loading}
          isSubscribed={isSubscribed}
          containerHeight={swipingCardsHeight}
        />
      </div>
    </div>
  );
};

export default Discover;
