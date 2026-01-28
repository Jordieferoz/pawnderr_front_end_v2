"use client";

import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { FC, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import {
  useChatDetails,
  useChatMessages,
  useFirebaseChat
} from "@/hooks/useFirebaseChat";
import { openMessageActionModal } from "@/store/modalSlice";
import { type ChatMessage } from "@/utils/firebase-chat";
import { images } from "@/utils/images";
import { showToast } from "@/ui_components/Shared/ToastMessage";

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
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  // Initialize Firebase
  const { isAuthenticated, isInitializing, error } = useFirebaseChat();

  // Get chat details (name, avatar) to fix "Pet {id}" issue
  const { details: chatDetails } = useChatDetails(chatId, myPetId);
  const displayName = chatDetails?.otherPetName || name;
  const displayAvatar = chatDetails?.otherPetPrimaryPhoto || avatar;

  // Get messages for this chat
  const { messages, isLoading, sendMessage, markAsRead } = useChatMessages(
    chatId || null,
    myPetId
  );

  // Mark messages as read when chat is opened or new messages arrive
  useEffect(() => {
    if (chatId && myPetId) {
      markAsRead(myPetId);
    }
  }, [chatId, myPetId, markAsRead, messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle click outside and Escape key for emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showEmojiPicker) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showEmojiPicker]);

  const getMatchIdFromChat = (id: string) => {
    const match = id.match(/match(\d+)/);
    return match ? Number(match[1]) : undefined;
  };

  const handleOpenMessageActionModal = () => {
    dispatch(
      openMessageActionModal({
        blocked_user_id: receiverPetId,
        match_id: getMatchIdFromChat(chatId),
        name: displayName,
        chatId,
        myPetId
      })
    );
  };

  const handleSendMessage = async () => {
    console.log("🚀 handleSendMessage called", {
      chatId,
      myPetId,
      receiverPetId,
      messageText,
      isAuthenticated
    });
    if (
      !messageText.trim() ||
      !chatId ||
      !myPetId ||
      !receiverPetId ||
      isSending
    ) {
      return;
    }

    try {
      setIsSending(true);
      await sendMessage(myPetId, receiverPetId, messageText.trim(), "text");
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
      showToast({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to send message."
      });
    } finally {
      setIsSending(false);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessageText((prev) => prev + emojiData.emoji);
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
    <div className="bg-white flex-1 md:border-l md:border-black/10 md:h-full relative h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-black/5">
        <div className="relative">
          <img
            src={displayAvatar}
            className="w-12 h-12 rounded-full object-cover border border-black/5"
            alt="avatar"
          />
          {/* Online status dot - matching design */}
          {/* <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00C055] border-2 border-white rounded-full"></span> */}
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-accent-900">
            {displayName}
          </h2>
          {/* <p className="text-xs text-grey-500">Active now</p> */}
        </div>

        <div className="ml-auto relative group">
          <button
            type="button"
            className="p-2 hover:bg-black/5 rounded-full transition"
            onClick={handleOpenMessageActionModal}
          >
            <img
              src={images.ellipsisHorizontal.src}
              alt="more"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-white hide-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-grey-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-grey-500">No messages yet. Say hello!</p>
          </div>
        ) : (
          <>
            {messages.map((msg: ChatMessage, index: number) => {
              const prevMsg = messages[index - 1];
              const isMe = Number(msg.senderId) === myPetId;

              const isSequence = prevMsg && prevMsg.senderId === msg.senderId;
              const showAvatar = !isMe && !isSequence;

              // Date separator logic
              const currentDate = new Date(msg.timestamp);
              const prevDate = prevMsg ? new Date(prevMsg.timestamp) : null;

              let showDateSeparator = false;
              let dateSeparatorText = "";

              if (
                !prevDate ||
                currentDate.getDate() !== prevDate.getDate() ||
                currentDate.getMonth() !== prevDate.getMonth() ||
                currentDate.getFullYear() !== prevDate.getFullYear()
              ) {
                showDateSeparator = true;

                const now = new Date();
                const isToday =
                  currentDate.getDate() === now.getDate() &&
                  currentDate.getMonth() === now.getMonth() &&
                  currentDate.getFullYear() === now.getFullYear();

                if (isToday) {
                  dateSeparatorText = `Today ${currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`;
                } else {
                  dateSeparatorText = currentDate.toLocaleDateString("en-GB", {
                    weekday: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                  });
                }
              }

              return (
                <div key={msg.id} className="flex flex-col gap-4">
                  {showDateSeparator && (
                    <div className="flex items-center justify-center my-2">
                      <div className="h-[1px] bg-black/5 flex-1 max-w-[100px]"></div>
                      <span className="text-xs font-medium text-grey-500 px-4">
                        {dateSeparatorText}
                      </span>
                      <div className="h-[1px] bg-black/5 flex-1 max-w-[100px]"></div>
                    </div>
                  )}

                  <div
                    className={`flex items-end gap-3 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMe && (
                      <div className="w-10 flex-shrink-0">
                        {showAvatar ? (
                          <img
                            src={displayAvatar}
                            className="w-10 h-10 rounded-full object-cover"
                            alt="avatar"
                          />
                        ) : (
                          <div className="w-10" />
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[70%] group relative ${isMe ? "items-end" : "items-start"} flex flex-col`}
                    >
                      <div
                        className={`px-5 py-3.5 text-[15px] leading-relaxed ${
                          isMe
                            ? "bg-[#0047AB] text-white rounded-t-[20px] rounded-bl-[20px] rounded-br-[4px]"
                            : "bg-[#F3F3F3] text-[#1A1A1A] rounded-t-[20px] rounded-br-[20px] rounded-bl-[4px]"
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Optional: Read receipt or tiny timestamp could go here if design requires */}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="mt-auto bg-white pb-6 pt-2 px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1" onKeyDown={handleKeyDown}>
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-full right-0 mb-4 z-50 shadow-2xl rounded-md"
              >
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  width={300}
                  skinTonesDisabled={true}
                  height={400}
                />
              </div>
            )}
            <InputField
              placeholder="Type message.."
              className="w-full bg-white border border-black/10 rounded-xl h-12 pl-4 pr-12 placeholder:text-light-grey2"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={isSending || !chatId || !myPetId || !receiverPetId}
            />
            <button
              ref={emojiButtonRef}
              type="button"
              className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer transition"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <img
                alt="smiley"
                src={images.smileyActive.src}
                className="w-5 h-5"
              />
            </button>
          </div>
          <button
            type="button"
            className={`w-10 h-10 flex items-center justify-center transition hover:scale-105 ${
              isSending || !messageText.trim()
                ? "opacity-50 cursor-not-allowed"
                : "opacity-100 cursor-pointer"
            }`}
            onClick={handleSendMessage}
            disabled={isSending || !messageText.trim()}
          >
            {/* Using a blue send arrow svg or image */}
            <img src={images.sendArrow.src} alt="send" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
