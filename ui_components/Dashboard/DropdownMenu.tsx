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
import { fetchMyPetsCollection } from "@/utils/api";
import { images } from "@/utils/images";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface DropdownMenuProps {
  userProfile: UserProfile | null;
  isLoading: boolean;
}

const DropdownMenu: FC<DropdownMenuProps> = ({ userProfile, isLoading }) => {
  const { logout } = useAuth();
  const [firstPetId, setFirstPetId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  const handleMenuItemClick = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetchMyPetsCollection();

        const myPets = resp.data.my_pets;

        if (myPets && myPets.length > 0) {
          setFirstPetId(myPets[0].id);
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchData();
  }, []);

  const avatarUrl = userProfile?.avatar || images.doggoProfilePlaceholder.src;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="rounded-full bg-light-grey w-11.5 h-11.5 flex items-center justify-center cursor-pointer">
          {isLoading ? (
            <div className="w-10.5 h-10.5 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <img
              src={avatarUrl}
              className="rounded-full w-10.5 h-10.5 object-cover"
              alt={userProfile?.name || "Profile"}
            />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-2" align="end">
        <div className="flex flex-col gap-1">
          {dropdownMenuItems.map((item) => {
            // Modify href for profile to include pet ID
            const href =
              item.href === "/profile" && firstPetId
                ? `/profile/${firstPetId}`
                : item.href;

            return (
              <Link
                key={item.href}
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
