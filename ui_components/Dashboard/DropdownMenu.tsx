"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

import { dropdownMenuItems } from "@/constants";
import { useAuth } from "@/hooks";
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
  const handleLogout = async () => {
    await logout();
  };

  const avatarUrl = userProfile?.avatar || images.doggoProfilePlaceholder.src;

  return (
    <Popover>
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
          {/* User Info Section */}
          {userProfile && (
            <div className="px-3 py-2 mb-1">
              <p className="text-sm font-semibold text-gray-900">
                {userProfile.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userProfile.email}
              </p>
            </div>
          )}

          <div className="h-px bg-gray-200 my-1" />

          {dropdownMenuItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
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
