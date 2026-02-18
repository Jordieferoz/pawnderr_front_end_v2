"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

import { dropdownMenuItems } from "@/constants";
import { useAuth } from "@/hooks";
import { RootState } from "@/store";
import { fetchMyPet } from "@/utils/api";
import { images } from "@/utils/images";
import { PETS_STORAGE_EVENT, petsStorage } from "@/utils/pets-storage";
import { useSelector } from "react-redux";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface PetImage {
  id: number;
  image_url: string;
  is_primary: boolean;
}

interface PetData {
  images: PetImage[];
}

interface DropdownMenuProps {
  userProfile: UserProfile | null;
  isLoading: boolean;
}

const DropdownMenu: FC<DropdownMenuProps> = ({ userProfile, isLoading }) => {
  const { logout } = useAuth();
  const [firstPetId, setFirstPetId] = useState<number | null>(null);

  const [petData, setPetData] = useState<PetData | null>(null);
  const [open, setOpen] = useState(false);
  const isSubscribed = useSelector(
    (state: RootState) => state.subscription.isSubscribed
  );

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  const handleMenuItemClick = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadFirstPetId = () => {
      const id = petsStorage.getFirstPetId();
      if (id) {
        setFirstPetId(id);
      } else {
        setFirstPetId(null);
      }
    };

    loadFirstPetId();

    const handlePetsChange = () => {
      loadFirstPetId();
    };

    window.addEventListener(PETS_STORAGE_EVENT, handlePetsChange);

    return () => {
      window.removeEventListener(PETS_STORAGE_EVENT, handlePetsChange);
    };
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
      }
    };

    if (firstPetId) {
      fetchData();
    }
  }, [firstPetId]);

  const primaryImage = petData?.images?.find((img) => img.is_primary);
  const avatarUrl = primaryImage?.image_url || userProfile?.avatar;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative rounded-full bg-light-grey w-11.5 h-11.5 flex items-center justify-center cursor-pointer">
          {isLoading ? (
            <div className="w-10.5 h-10.5 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <div className="flex items-center justify-center gap-1 w-11 h-11 bg-white border-2 border-neutral-white rounded-full">
              <img
                src={avatarUrl}
                className="rounded-full w-10.5 h-10.5 object-cover border-white border-1 p-0.5"
                alt={userProfile?.name || "Profile"}
              />
            </div>
          )}
          {isSubscribed && (
            <img
              src={images.crownYellowBg.src}
              alt="Premium"
              className="absolute -top-1 -right-1 w-5 h-5 z-10 border-2 border-white rounded-full"
            />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-2" align="end">
        <div className="flex flex-col gap-1">
          {dropdownMenuItems.map((item, index) => {
            // Modify href for profile to include pet ID
            let href = item.href;
            if (firstPetId) {
              if (item.href === "/profile") {
                href = `/profile/${firstPetId}`;
              } else if (item.href.startsWith("/profile/edit")) {
                // Handle /profile/edit?query... -> /profile/edit/[id]?query...
                const [path, query] = item.href.split("?");
                href = `${path}/${firstPetId}${query ? `?${query}` : ""}`;
              }
            }

            return (
              <Link
                key={index}
                href={href}
                onClick={handleMenuItemClick}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <div className="h-px bg-gray-200 my-1" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 transition-colors text-left w-full"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-600">Logout</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DropdownMenu;
