"use client";

import { openMessageActionModal } from "@/store/modalSlice";
import { images } from "@/utils/images";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { InputField } from "../Shared";

interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
  avatar?: string;
}

interface ChatWindowProps {
  name: string;
  avatar: string;
}

const messages: Message[] = [
  {
    id: 1,
    sender: "other",
    text: "Hey! Jake is adorable. My Jeff would totally share her chew toy with him 💕",
    avatar: images.doggo1.src,
  },
  {
    id: 2,
    sender: "me",
    text: "Haha wow, that’s serious commitment 😁",
  },
  {
    id: 3,
    sender: "me",
    text: "Jake usually guards his toys like national treasures!",
  },
  {
    id: 4,
    sender: "other",
    text: "Jeff’s the opposite — He brings everyone a gift. Usually half a slipper 🥿😂",
    avatar: images.doggo1.src,
  },
  {
    id: 5,
    sender: "other",
    text: "Jeff’s the opposite — He brings everyone a gift. Usually half a slipper 🥿😂",
    avatar: images.doggo1.src,
  },
  {
    id: 6,
    sender: "other",
    text: "Jeff’s the opposite — He brings everyone a gift. Usually half a slipper 🥿😂",
    avatar: images.doggo1.src,
  },
];

const ChatWindow: FC<ChatWindowProps> = ({ name, avatar }) => {
  const dispatch = useDispatch();

  const handleOpenMessageActionModal = () => {
    dispatch(openMessageActionModal());
  };
  return (
    <div className="bg-white md:bg-transparent flex-1 rounded-xl md:rounded-[0px] px-4 md:px-0 md:border-l md:border-black/10 md:h-full relative shadow-[0px_4px_16.4px_0px_#0000001A] h-[calc(75vh-120px)] md:shadow-none flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 md:px-3 px-1 py-3 border-b border-black/10">
        <img src={avatar} className="w-8 h-8 rounded-full object-cover" />
        <h2 className="heading3_medium text-accent-900">{name}</h2>

        <div
          className="ml-auto cursor-pointer"
          onClick={handleOpenMessageActionModal}
        >
          <img src={images.ellipsisHorizontal.src} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 md:px-4 space-y-4 pb-5 hide-scrollbar">
        <div className="text-center tp_small_medium text-dark-grey my-5">
          Today 04:43
        </div>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "other" && (
              <img
                src={msg.avatar}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}

            <p
              className={`max-w-[70%] px-4 py-3 rounded-xl body_medium ${
                msg.sender === "me"
                  ? "bg-blue text-white"
                  : "bg-grey-800 text-dark-grey"
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="fixed md:absolute md:bottom-[0px] bottom-[88px] left-0 right-0 py-3 md:border-0 bg-white md:rounded-b-[40px] border-t shadow-[0px_-6px_11px_0px_#8787871C] md:shadow-none border-black/10 ">
        <div className="common_container flex items-center gap-3">
          <img src={images.attachment.src} />

          <div className="relative w-full">
            <InputField placeholder="Type message..." className="w-full" />
            <img
              src={images.smiley.src}
              className="absolute top-1/2 -translate-y-1/2 right-4"
            />
          </div>
          <img src={images.send.src} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
