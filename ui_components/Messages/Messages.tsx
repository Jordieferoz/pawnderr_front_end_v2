"use client";

import { images } from "@/utils/images";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { MessageList } from ".";
import { CustomAvatar, InputField } from "../Shared";

const Messages: FC = () => {
  const router = useRouter();

  return (
    <div className="profile_wrapper common_container">
      <div className="flex items-center my-4 justify-between mb-7">
        <div className="flex items-center gap-3">
          <img
            onClick={() => router.back()}
            className="w-10 h-10"
            src={images.backBtn.src}
          />
          <h4 className="display4_medium text-accent-900">Messages</h4>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4 items-center justify-center mb-7.5">
        <CustomAvatar
          src={images.doggo1.src}
          size={64}
          type="countdown"
          name="Frank"
        />

        <CustomAvatar
          src={images.doggo2.src}
          size={64}
          type="countdown"
          name="Frank"
        />

        <CustomAvatar
          src={images.doggo3.src}
          size={64}
          type="countdown"
          name="Frank"
        />

        <CustomAvatar
          src={images.doggo4.src}
          size={64}
          type="countdown"
          name="Frank"
        />
        <CustomAvatar
          src={images.doggo5.src}
          size={64}
          type="countdown"
          name="Frank"
        />
      </div>
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
