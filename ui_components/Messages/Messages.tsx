"use client";

import { FC, useState } from "react";

import { images } from "@/utils/images";

import { MessageList } from ".";
import { InputField } from "../Shared";

const Messages: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="h-full flex flex-col px-4 py-5 w-full">
      <div className="mb-4">
        <InputField
          placeholder="Search..."
          className="placeholder:text-dark-grey bg-white border border-black/10 rounded-xl h-12"
          leftIcon={images.searchGrey.src}
          iconClassName="w-5 h-5"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <MessageList searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default Messages;
