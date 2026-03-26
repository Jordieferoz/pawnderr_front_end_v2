"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
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
      setFirstPetId(id ?? null);
    };

    loadFirstPetId();
    window.addEventListener(PETS_STORAGE_EVENT, loadFirstPetId);
    return () => window.removeEventListener(PETS_STORAGE_EVENT, loadFirstPetId);
  }, []);

  useEffect(() => {
    if (!firstPetId) return;
    const fetchData = async () => {
      try {
        const resp = await fetchMyPet(Number(firstPetId));
        setPetData(resp?.data ?? null);
      } catch (error) {
        console.error("Error fetching pet:", error);
      }
    };
    fetchData();
  }, [firstPetId]);

  const primaryImage = petData?.images?.find((img) => img.is_primary);
  const avatarUrl = primaryImage?.image_url || userProfile?.avatar;

  // Returns true if the resolved href matches the current pathname
  const isActive = (resolvedHref: string): boolean => {
    // Strip query string for comparison
    const hrefPath = resolvedHref.split("?")[0];
    return pathname === hrefPath || pathname.startsWith(hrefPath + "/");
  };

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
            // Resolve dynamic href
            let href = item.href;
            if (firstPetId) {
              if (item.href === "/profile") {
                href = `/profile/${firstPetId}`;
              } else if (item.href.startsWith("/profile/edit")) {
                const [path, query] = item.href.split("?");
                href = `${path}/${firstPetId}${query ? `?${query}` : ""}`;
              }
            }

            // Only highlight first 4 items
            const highlightable = index < 4;
            const active = highlightable && isActive(href);

            return (
              <Link
                key={index}
                href={href}
                onClick={handleMenuItemClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  active
                    ? "bg-gray-100 text-primary font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span className="text-sm font-medium">{item.label}</span>
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
