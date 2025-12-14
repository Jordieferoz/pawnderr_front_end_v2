"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";

import { images } from "@/utils/images";

import { InputField } from "../Shared";
import { MessageList } from ".";

const Messages: FC = () => {
  const router = useRouter();

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
