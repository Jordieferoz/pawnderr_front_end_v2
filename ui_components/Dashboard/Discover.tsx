"use client";

import { useEffect } from "react";

import SwipingCards from "@/ui_components/Dashboard/SwipingCards";
import { CustomAvatar } from "@/ui_components/Shared";
import { fetchMyPet, fetchMyPetsCollection } from "@/utils/api";
import { images } from "@/utils/images";

const Discover = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetchMyPetsCollection();
        console.log(resp, "resp");

        // Get the my_pets array from response
        const myPets = resp.data.my_pets;

        // Fetch detailed data for each pet
        const petDetailsPromises = myPets.map((pet: any) => fetchMyPet(pet.id));

        // Wait for all pet details to be fetched
        const petDetails = await Promise.all(petDetailsPromises);
        console.log(petDetails, "pet details");

        // setPets(petDetails);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="discover_wrapper common_container h-[calc(100vh-90px)]">
      <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:px-5 md:py-5 md:rounded-2xl md:w-[700px] md:mx-auto">
        <div className="items-center justify-between mb-4">
          <div className="flex my-3 gap-4 items-center overflow-x-auto hide-scrollbar">
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
          </div>
        </div>

        <SwipingCards />
      </div>
    </div>
  );
};

export default Discover;
