"use client";

import { useEffect, useState } from "react";

import SwipingCards from "@/ui_components/Dashboard/SwipingCards";
import { CustomAvatar } from "@/ui_components/Shared";
import { fetchPets } from "@/utils/api";
import { images } from "@/utils/images";

import { FilterModal } from "../Modals";

interface Pet {
  id: number;
  name: string;
  gender: string;
  avatar?: string;
  // Add other pet properties based on your API response
}

const Discover = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPets = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("🔄 Fetching pets...");
        const response = await fetchPets();

        console.log("✅ Pets fetched successfully:", response);

        if (response.data) {
          setPets(response.data);
        }
      } catch (err: any) {
        console.error("❌ Failed to fetch pets:", err);
        setError(err.message || "Failed to load pets");
      } finally {
        setIsLoading(false);
      }
    };

    loadPets();
  }, []);

  return (
    <div className="discover_wrapper pb-10 common_container">
      <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:px-5 md:py-5 md:rounded-2xl md:w-[700px] md:mx-auto">
        <div className="items-center justify-between mb-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex my-3 gap-4 items-center overflow-x-auto hide-scrollbar">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="my-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Pets List */}
          {!isLoading && !error && pets.length > 0 && (
            <div className="flex my-3 gap-4 items-center overflow-x-auto hide-scrollbar">
              {pets.map((pet) => (
                <CustomAvatar
                  key={pet.id}
                  src={pet.avatar || images.doggoProfilePlaceholder.src}
                  size={64}
                  gender={pet.gender as "male" | "female"}
                  name={pet.name}
                  showPlus
                  plusIcon={images.pawnderrPlus.src}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && pets.length === 0 && (
            <div className="my-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 text-center">No pets found</p>
            </div>
          )}
        </div>

        <SwipingCards />
      </div>
      <FilterModal />
    </div>
  );
};

export default Discover;
