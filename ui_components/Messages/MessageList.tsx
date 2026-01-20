"use client";

import { useRouter } from "next/navigation";
import { FC, useMemo } from "react";

import { useChatConversations, useFirebaseChat } from "@/hooks/useFirebaseChat";
import { type ChatConversation } from "@/utils/firebase-chat";
import { images } from "@/utils/images";
import { petsStorage } from "@/utils/pets-storage";

interface MessageListProps {
  searchTerm?: string;
}

const MessageList: FC<MessageListProps> = ({ searchTerm = "" }) => {
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

  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return conversations;

    const lowerTerm = searchTerm.toLowerCase();
    return conversations.filter((conversation) => {
      // Logic duplicated from render to ensure consistent name matching
      const otherPetId =
        conversation.otherPetId ??
        Number(
          conversation.participants.find(
            (id) => !petIds.includes(Number(id))
          ) || 0
        );

      const displayName =
        conversation.otherPetName ||
        (otherPetId ? `Pet ${otherPetId}` : "Pet");

      return displayName.toLowerCase().includes(lowerTerm);
    });
  }, [conversations, searchTerm, petIds]);


  const openChat = (chatId: string) => {
    router.push(`/messages/${chatId}`);
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    const isSameDay = date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isSameDay) return "Today";

    // Check if it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      yesterday.getFullYear() === yesterday.getFullYear();

    if (isYesterday) return "Yesterday";

    if (diffDays < 7) {
      return `${diffDays} Days Ago`;
    }

    return date.toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' });
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


  if (searchTerm && filteredConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-grey-500">No results found</p>
      </div>
    );
  }

  if (conversations.length === 0 && !searchTerm) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-grey-500">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1">
      {filteredConversations.map((conversation: ChatConversation) => {
        const otherPetId =
          conversation.otherPetId ??
          Number(
            conversation.participants.find(
              (id) => !petIds.includes(Number(id))
            ) || 0
          );
        const isUnread = (conversation.unreadCount ?? 0) > 0;

        const displayName =
          conversation.otherPetName ||
          (otherPetId ? `Pet ${otherPetId}` : "Pet");
        const displayImage =
          conversation.otherPetPrimaryPhoto || images.doggo1.src;
        const lastMessage = conversation.lastMessage?.text || "No messages yet";

        return (
          <div
            key={conversation.chatId}
            onClick={() => openChat(conversation.chatId)}
            className="relative py-4 px-3 cursor-pointer hover:bg-black/5 transition rounded-xl"
          >
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <img
                  src={displayImage}
                  className="w-14 h-14 object-cover rounded-full border border-black/5"
                  alt="user"
                />
                {/* Online Indicator - Optional based on design */}
                {/* <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white" /> */}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-[16px] font-semibold text-accent-900 truncate">
                    {displayName}
                  </h3>
                  <span className="text-xs text-grey-500 shrink-0">
                    {formatTimestamp(conversation.lastMessageTime)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-grey-500 truncate max-w-[85%]">
                    {lastMessage}
                  </p>

                  {(conversation.unreadCount || 0) > 0 && (
                    <div className="bg-[#FF4B55] rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-white">
                        {(conversation.unreadCount || 0) > 9
                          ? "9+"
                          : conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 left-[70px] h-[1px] bg-black/5" />
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
