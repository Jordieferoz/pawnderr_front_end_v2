"use client";

import { FC } from "react";

import { images } from "@/utils/images";

import { MessageList } from ".";
import { InputField } from "../Shared";

const Messages: FC = () => {
  return (
    <div className="h-full flex flex-col px-4 py-5">
      <div className="mb-4">
        <InputField
          placeholder="Search..."
          className="placeholder:text-dark-grey bg-white border border-black/10 rounded-xl h-12"
          leftIcon={images.searchGrey.src}
          iconClassName="w-5 h-5"
        />
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <MessageList />
      </div>
    </div>
  );
};

export default Messages;
