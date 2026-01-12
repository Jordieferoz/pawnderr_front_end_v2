"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC } from "react";

import { useChatConversations, useFirebaseChat } from "@/hooks/useFirebaseChat";
import { type ChatConversation } from "@/utils/firebase-chat";
import { images } from "@/utils/images";

const MessageList: FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // Initialize Firebase
  useFirebaseChat();

  // Get current user ID
  const currentUserId = (session?.user as any)?.id?.toString() || "";

  // Get conversations
  const { conversations, isLoading } = useChatConversations(
    currentUserId || null
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
        // Get the other participant (not current user)
        const otherParticipantId =
          conversation.participants.find((id) => id !== currentUserId) ||
          conversation.participants[0];

        // TODO: Fetch user details for otherParticipantId from your API
        // For now, using placeholder data
        const displayName = `User ${otherParticipantId}`;
        const displayImage = images.doggo1.src;
        const lastMessage = conversation.lastMessage?.text || "No messages yet";

        return (
          <div
            key={conversation.chatId}
            onClick={() => openChat(conversation.chatId)}
            className="relative py-4 border-b border-black/10 px-2.5 cursor-pointer hover:bg-black/5 transition"
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
                  <p className="tp_small_medium text-neutral-white">
                    {formatTimestamp(conversation.lastMessageTime)}
                  </p>
                </div>

                <div className="flex items-center gap-2 justify-between">
                  <p className="text-grey-500 body_regular truncate">
                    {lastMessage}
                  </p>

                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <div className="bg-secondary-600 rounded-full w-4.5 h-4.5 flex items-center justify-center shrink-0">
                      <p className="body_medium text-white text-xs">
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
