"use client";

import { ChatWindow, Messages } from "@/ui_components/Messages";
import {
  BlockModal,
  MessageActionModal,
  ReportModal
} from "@/ui_components/Modals";
import { images } from "@/utils/images";
import { petsStorage } from "@/utils/pets-storage";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);
  const chatId = params?.id as string;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const myPetIds = isMounted
    ? petsStorage.get()?.my_pets?.map((pet) => pet.id) ?? []
    : [];

  const getPetIdsFromChat = () => {
    if (!chatId) return [];
    return Array.from(chatId.matchAll(/pet(\d+)/g)).map((match) =>
      Number(match[1])
    );
  };

  const chatPetIds = getPetIdsFromChat();
  const myPetId =
    chatPetIds.find((id) => myPetIds.includes(id)) ?? myPetIds[0] ?? 0;
  const receiverPetId =
    chatPetIds.find((id) => id !== myPetId) ?? chatPetIds[1] ?? 0;

  // TODO: Fetch receiver user details from your API
  // For now, using placeholder data
  const receiverName = receiverPetId ? `Pet ${receiverPetId}` : "Pet";
  const receiverAvatar = images.doggo1.src;

  return (
    <div className="h-full w-full">
      {chatId && receiverPetId && myPetId ? (
        <ChatWindow
          chatId={chatId}
          receiverPetId={receiverPetId}
          myPetId={myPetId}
          name={receiverName}
          avatar={receiverAvatar}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center h-full">
          <p className="text-grey-500">
            Select a conversation to start chatting
          </p>
        </div>
      )}
      <MessageActionModal />
      <ReportModal />
      <BlockModal />
    </div>
  );
}
