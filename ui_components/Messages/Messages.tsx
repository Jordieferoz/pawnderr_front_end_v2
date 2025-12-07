"use client";

import { images } from "@/utils/images";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { MessageList } from ".";
import { InputField } from "../Shared";

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
