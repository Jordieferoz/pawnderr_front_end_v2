"use client";

import { useRouter } from "next/navigation";

import { CustomAvatar } from "@/ui_components/Shared";
import { images } from "@/utils/images";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div className="relative h-full common_container">
      <div className="container mx-auto py-20 md:pt-[104px] md:pb-0 h-full">
        <div className="flex items-center my-4 justify-between mb-7">
          <div className="flex items-center gap-3">
            <img
              onClick={() => router.back()}
              className="w-10 h-10"
              src={images.backBtn.src}
              alt="back"
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
        {children}
      </div>
      <img
        className="absolute w-full left-0 top-0 hidden md:flex pointer-events-none z-[-1]"
        src={images.discoverBg.src}
        alt="messages_pattern"
      />
    </div>
  );
}
