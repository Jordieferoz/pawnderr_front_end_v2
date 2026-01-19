"use client";

import SwipingCards from "@/ui_components/Dashboard/SwipingCards";
import { fetchMyPet, fetchMyPetsCollection, fetchSubscriptionStatus } from "@/utils/api";
import { petsStorage } from "@/utils/pets-storage";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HangTightModal } from "../Modals";
import { IPetData } from "../Profile/types";
import { showToast } from "../Shared/ToastMessage";

const Discover = () => {
  const dispatch = useDispatch();
  const [firstPetId, setFirstPetId] = useState<number | null>(null);
  const [petData, setPetData] = useState<IPetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);
  console.log(petData, 'petData')
  console.log(isSubscribed, 'isSubscribed')
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
          console.log(storedPet, "storedPet");
          setPetData(storedPet as any);
          setFirstPetId(storedPet.id);
          setLoading(false);
          // We have the data, but if you want to refresh it from API, you can let the second useEffect run.
          // However, since we setPetData, the UI is ready.
        }

        let id = petsStorage.getFirstPetId();

        if (!id) {
          const petsResp = await fetchMyPetsCollection();
          if (petsResp?.data) {
            petsStorage.set(petsResp.data);
            id = petsStorage.getFirstPetId();
            // If we just fetched, we might also want to setPetData if available in the response
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

  return (
    <div className="discover_wrapper common_container h-[calc(100vh-120px)]">
      <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:px-5 md:py-5 md:rounded-2xl md:w-[700px] md:mx-auto">
        <div className="items-center justify-between mb-4">
          {/* <div className="flex my-3 gap-4 items-center overflow-x-auto hide-scrollbar">
            <CustomAvatar
              src={images.doggo1.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />

            <CustomAvatar
              src={images.doggo2.src}
              size={64}
              type="countdown"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />

            <CustomAvatar
              src={images.doggo3.src}
              size={64}
              gender="male"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />

            <CustomAvatar
              src={images.doggo4.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />
            <CustomAvatar
              src={images.doggo4.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />
            <CustomAvatar
              src={images.doggo4.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />
            <CustomAvatar
              src={images.doggo4.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />
            <CustomAvatar
              src={images.doggo4.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />
            <CustomAvatar
              src={images.doggo4.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />
            <CustomAvatar
              src={images.doggo4.src}
              size={64}
              gender="female"
              name="Frank"
              showPlus
              plusIcon={images.pawnderrPlus.src}
            />
          </div> */}
        </div>

        <SwipingCards petData={petData} loading={loading} isSubscribed={isSubscribed} />

      </div>
    </div>
  );
};

export default Discover;
