"use client";

import { ChatWindow, Messages } from "@/ui_components/Messages";
import {
  BlockModal,
  MessageActionModal,
  ReportModal
} from "@/ui_components/Modals";
import { images } from "@/utils/images";

export default function ChatPage() {
  return (
    <div className="message_wrapper">
      <div className="flex gap-2 bg-white/[94%] border border-black/10 rounded-[40px]">
        <div className="hidden md:flex md:basis-sn">
          <Messages />
        </div>
        <ChatWindow name="Jeff" avatar={images.doggo1.src} />
        <MessageActionModal />
      </div>
      <ReportModal />
      <BlockModal />
    </div>
  );
}
