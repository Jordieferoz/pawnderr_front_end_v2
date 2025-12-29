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
import { images } from "@/utils/images";

const DropdownMenu: FC = () => {
  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-full bg-light-grey w-11.5 h-11.5 flex items-center justify-center cursor-pointer">
          <img
            src={images.doggoProfilePlaceholder.src}
            className="rounded-full w-10.5 h-10.5 object-cover"
            alt="pet placeholder"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-2" align="end">
        <div className="flex flex-col gap-1">
          {dropdownMenuItems.map((item) => {
            // const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 transition-colors"
              >
                {/* <Icon className="w-4 h-4 text-gray-600" /> */}
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <div className="h-px bg-gray-200 my-1" />

          <button
            onClick={() => handleLogout()}
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
