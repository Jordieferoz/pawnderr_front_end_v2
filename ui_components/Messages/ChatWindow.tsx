"use client";

import { useSession } from "next-auth/react";
import { FC, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { useChatMessages, useFirebaseChat } from "@/hooks/useFirebaseChat";
import { openMessageActionModal } from "@/store/modalSlice";
import { type ChatMessage } from "@/utils/firebase-chat";
import { images } from "@/utils/images";

import { InputField } from "../Shared";

interface ChatWindowProps {
  chatId: string;
  receiverPetId: number;
  myPetId: number;
  name: string;
  avatar: string;
}

const ChatWindow: FC<ChatWindowProps> = ({
  chatId,
  receiverPetId,
  myPetId,
  name,
  avatar
}) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Firebase
  const { isAuthenticated, isInitializing, error } = useFirebaseChat();

  // Get current user ID
  const currentUserId = (session?.user as any)?.id?.toString() || "";

  // Get messages for this chat
  const { messages, isLoading, sendMessage, markAsRead } = useChatMessages(
    chatId || null
  );

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (chatId && myPetId) {
      markAsRead(myPetId);
    }
  }, [chatId, myPetId, markAsRead]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpenMessageActionModal = () => {
    dispatch(openMessageActionModal());
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !chatId || !currentUserId || isSending) {
      return;
    }

    try {
      setIsSending(true);
      await sendMessage(
        myPetId,
        receiverPetId,
        currentUserId,
        messageText.trim(),
        "text"
      );
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return isToday
      ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
  };
  if (isInitializing) {
    return (
      <div className="bg-white flex-1 rounded-xl md:rounded-[0px] px-4 md:px-0 md:border-l md:border-black/10 md:h-full relative shadow-[0px_4px_16.4px_0px_#0000001A] h-[calc(75vh-120px)] md:shadow-none flex items-center justify-center">
        <p className="text-grey-500">Loading messages...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white flex-1 rounded-xl md:rounded-[0px] px-4 md:px-0 md:border-l md:border-black/10 md:h-full relative shadow-[0px_4px_16.4px_0px_#0000001A] h-[calc(75vh-120px)] md:shadow-none flex items-center justify-center">
        <p className="text-grey-500">
          {error || "Chat is unavailable. Please sign in again."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white flex-1 rounded-xl md:rounded-[0px] px-4 md:px-0 md:border-l md:border-black/10 md:h-full relative shadow-[0px_4px_16.4px_0px_#0000001A] h-[calc(75vh-120px)] md:shadow-none flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 md:px-3 px-1 py-3 border-b border-black/10">
        <img
          src={avatar}
          className="w-8 h-8 rounded-full object-cover"
          alt="avatar"
        />
        <h2 className="heading3_medium text-accent-900">{name}</h2>

        <div
          className="ml-auto cursor-pointer"
          onClick={handleOpenMessageActionModal}
        >
          <img src={images.ellipsisHorizontal.src} alt="more" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 md:px-4 space-y-4 pb-6 hide-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-grey-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-grey-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg: ChatMessage, index: number) => {
              const isMe = Number(msg.senderId) === myPetId;
              const showAvatar =
                !isMe &&
                (index === 0 || messages[index - 1].senderId !== msg.senderId);
              const showTime =
                index === messages.length - 1 ||
                Math.abs(
                  msg.timestamp - (messages[index + 1]?.timestamp || 0)
                ) > 300000; // 5 minutes

              return (
                <div key={msg.id}>
                  {showTime && (
                    <div className="text-center tp_small_medium text-dark-grey my-5">
                      {formatTime(msg.timestamp)}
                    </div>
                  )}
                  <div
                    className={`flex items-end gap-2 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {showAvatar && !isMe && (
                      <img
                        src={avatar}
                        className="w-12 h-12 rounded-full object-cover"
                        alt="avatar"
                      />
                    )}
                    {!isMe && !showAvatar && <div className="w-12" />}

                    <p
                      className={`max-w-[70%] px-4 py-3 rounded-2xl body_medium ${
                        isMe
                          ? "bg-blue text-white"
                          : "bg-grey-100 text-dark-grey"
                      }`}
                    >
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="mt-auto py-3 md:border-0 bg-white md:rounded-b-[40px] border-t shadow-[0px_-6px_11px_0px_#8787871C] md:shadow-none border-black/10">
        <div className="common_container flex items-center gap-3 md:px-4">
          <img
            src={images.attachment.src}
            alt="attachment"
            className="cursor-pointer"
          />

          <div className="relative w-full" onKeyDown={handleKeyDown}>
            <InputField
              placeholder="Type message..."
              className="w-full"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={isSending || !chatId || !myPetId || !receiverPetId}
            />
            <img
              alt="smiley"
              src={images.smiley.src}
              className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer"
            />
          </div>
          <img
            src={images.send.src}
            alt="send"
            className={`cursor-pointer ${isSending || !messageText.trim() ? "opacity-50" : ""}`}
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
