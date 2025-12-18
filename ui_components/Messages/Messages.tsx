"use client";

import { FC } from "react";

import { images } from "@/utils/images";

import { MessageList } from ".";
import { InputField } from "../Shared";

const Messages: FC = () => {
  return (
    <div className="md:p-4">
      <div className="mb-7.5">
        <InputField
          placeholder="Search..."
          className="placeholder:text-dark-grey "
          leftIcon={images.searchGrey.src}
        />
      </div>

      <MessageList />
    </div>
  );
};

export default Messages;
