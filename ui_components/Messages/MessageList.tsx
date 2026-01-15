"use client";

import { useRouter } from "next/navigation";
import { FC, useMemo } from "react";

import { useChatConversations, useFirebaseChat } from "@/hooks/useFirebaseChat";
import { type ChatConversation } from "@/utils/firebase-chat";
import { images } from "@/utils/images";
import { petsStorage } from "@/utils/pets-storage";

const MessageList: FC = () => {
  const router = useRouter();

  // Initialize Firebase
  const { isAuthenticated, isInitializing, error } = useFirebaseChat();

  const petIds = useMemo(
    () => petsStorage.get()?.my_pets?.map((pet) => pet.id) ?? [],
    []
  );

  // Get conversations
  const { conversations, isLoading } = useChatConversations(
    isAuthenticated ? petIds : []
  );

  const openChat = (chatId: string) => {
    router.push(`/messages/${chatId}`);
  };

  // Format timestamp
  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7)
      return date.toLocaleDateString("en-US", { weekday: "short" });
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-grey-500">Loading conversations...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-grey-500">
          {error || "Chat is unavailable. Please sign in again."}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-grey-500">Loading conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-grey-500">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {conversations.map((conversation: ChatConversation) => {
        const otherPetId =
          conversation.otherPetId ??
          Number(
            conversation.participants.find(
              (id) => !petIds.includes(Number(id))
            ) || 0
          );

        const displayName = otherPetId ? `Pet ${otherPetId}` : "Pet";
        const displayImage = images.doggo1.src;
        const lastMessage = conversation.lastMessage?.text || "No messages yet";

        return (
          <div
            key={conversation.chatId}
            onClick={() => openChat(conversation.chatId)}
            className="relative py-4 border-b border-black/10 px-4 cursor-pointer hover:bg-black/5 transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={displayImage}
                className="w-12 h-12 shrink-0 object-cover rounded-full"
                alt="user"
              />
              <div className="w-full">
                <div className="flex items-center gap-2 justify-between mb-2 md:mb-0.5">
                  <h3 className="heading3_medium text-accent-900">
                    {displayName}
                  </h3>
                  <p className="tp_small_medium text-grey-500">
                    {formatTimestamp(conversation.lastMessageTime)}
                  </p>
                </div>

                <div className="flex items-center gap-2 justify-between">
                  <p className="text-grey-500 body_regular truncate">
                    {lastMessage}
                  </p>

                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <div className="bg-secondary-600 rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                      <p className="body_medium text-white text-[10px]">
                        {conversation.unreadCount > 9
                          ? "9+"
                          : conversation.unreadCount}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
