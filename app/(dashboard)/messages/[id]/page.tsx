"use client";

import { ChatWindow, Messages } from "@/ui_components/Messages";
import {
  BlockModal,
  MessageActionModal,
  ReportModal
} from "@/ui_components/Modals";
import { images } from "@/utils/images";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const { data: session } = useSession();
  const chatId = params?.id as string;
  const currentUserId = (session?.user as any)?.id?.toString() || "";

  // Extract receiver ID from chat ID (format: "userId1_userId2")
  const getReceiverId = () => {
    if (!chatId || !currentUserId) return "";
    const participants = chatId.split("_");
    return (
      participants.find((id) => id !== currentUserId) || participants[0] || ""
    );
  };

  const receiverId = getReceiverId();

  // TODO: Fetch receiver user details from your API
  // For now, using placeholder data
  const receiverName = `User ${receiverId}`;
  const receiverAvatar = images.doggo1.src;

  return (
    <div className="message_wrapper">
      <div className="flex gap-2 bg-white/[94%] border border-black/10 rounded-[40px]">
        <div className="hidden md:flex md:basis-sn">
          <Messages />
        </div>
        {chatId && receiverId ? (
          <ChatWindow
            chatId={chatId}
            receiverId={receiverId}
            name={receiverName}
            avatar={receiverAvatar}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-grey-500">
              Select a conversation to start chatting
            </p>
          </div>
        )}
        <MessageActionModal />
      </div>
      <ReportModal />
      <BlockModal />
    </div>
  );
}
