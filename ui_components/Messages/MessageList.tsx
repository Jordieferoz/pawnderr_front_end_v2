"use client";

import { images } from "@/utils/images";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface IMessageItem {
  chatId: string;
  name: string;
  image: string;
  timestamp: string;
  unread: number;
  message: string;
}

const dummyMessages: IMessageItem[] = [
  {
    chatId: "1",
    name: "Frank",
    image: images.doggo1.src,
    timestamp: "Today",
    unread: 4,
    message: "When can we meet?",
  },
  {
    chatId: "2",
    name: "Bella",
    image: images.doggo2.src,
    timestamp: "2h ago",
    unread: 1,
    message: "Got the files?",
  },
  {
    chatId: "3",
    name: "Max",
    image: images.doggo3.src,
    timestamp: "Yesterday",
    unread: 5,
    message: "Let’s catch up soon!",
  },
  {
    chatId: "4",
    name: "Charlie",
    image: images.doggo4.src,
    timestamp: "Mon",
    unread: 0,
    message: "Thanks for the update.",
  },
  {
    chatId: "5",
    name: "Lucy",
    image: images.doggo5.src,
    timestamp: "Sun",
    unread: 2,
    message: "Sending the details now!",
  },
];

const MessageList: FC = () => {
  const router = useRouter();

  const openChat = (id: string) => {
    router.push(`/messages/${id}`);
  };

  return (
    <div className="flex flex-col">
      {dummyMessages.map((item) => (
        <div
          key={item.chatId}
          onClick={() => openChat(item.chatId)}
          className="relative py-4 border-b border-black/10 px-2.5 cursor-pointer hover:bg-black/5 transition"
        >
          <div className="flex items-center gap-3">
            <img
              src={item.image}
              className="w-12 h-12 shrink-0 object-cover rounded-full"
            />
            <div className="w-full">
              <div className="flex items-center gap-2 justify-between mb-2 md:mb-0.5">
                <h3 className="heading3_medium text-accent-900">{item.name}</h3>
                <p className="tp_small_medium text-neutral-white">
                  {item.timestamp}
                </p>
              </div>

              <div className="flex items-center gap-2 justify-between">
                <p className="text-grey-500 body_regular">{item.message}</p>

                {item.unread > 0 && (
                  <div className="bg-secondary-600 rounded-full w-4.5 h-4.5 flex items-center justify-center">
                    <p className="body_medium text-white">{item.unread}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
