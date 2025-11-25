"use client";

import { ChatWindow } from "@/ui_components/Messages";
import {
  BlockModal,
  MessageActionModal,
  ReportModal,
} from "@/ui_components/Modals";
import { images } from "@/utils/images";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <div className="message_wrapper common_container">
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

      <ChatWindow name="Jeff" avatar={images.doggo1.src} />
      <MessageActionModal />
      <ReportModal />
      <BlockModal />
    </div>
  );
}
