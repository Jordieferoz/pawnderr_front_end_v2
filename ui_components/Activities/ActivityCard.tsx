"use client";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

import { showToast } from "@/ui_components/Shared/ToastMessage";
import { checkCanChat, messageInitiated } from "@/utils/api";
import { images } from "@/utils/images";
import { petsStorage } from "@/utils/pets-storage";

import { IActivityCardProps } from "./types";

const ActivityCard: FC<IActivityCardProps> = ({
  className,
  cards,
  onMiddleAction
}) => {
  const router = useRouter();

  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);

  const handleOpenChat = async (toPetId: number) => {
    const fromPetId = petsStorage.getFirstPetId();

    if (!fromPetId) {
      showToast({
        type: "error",
        message: "No pet found. Please register a pet first."
      });
      return;
    }

    try {
      const response = await checkCanChat({
        from_pet_id: fromPetId,
        to_pet_id: toPetId
      });

      const canChatResult =
        response.data?.canChat ??
        response.data?.data?.canChat ??
        response.data?.can_chat ??
        response.data?.data?.can_chat ??
        response.statusCode === 200;

      if (!canChatResult) {
        const message =
          response.data?.reason ||
          response.data?.data?.reason ||
          response.data?.message ||
          response.data?.data?.message ||
          "You can't start a chat with this pet yet.";
        showToast({ type: "error", message });
        return;
      }

      const matchId =
        response.data?.match_id ||
        response.data?.data?.match_id ||
        response.data?.matchId ||
        response.data?.data?.matchId ||
        response.data?.data?.match?.id;
      const chatId =
        matchId !== undefined && matchId !== null
          ? `pet${fromPetId}_pet${toPetId}_match${matchId}`
          : `pet${fromPetId}_pet${toPetId}`;

      if (matchId !== undefined && matchId !== null) {
        try {
          await messageInitiated({
            chat_id: chatId,
            from_pet_id: fromPetId,
            to_pet_id: toPetId,
            match_id: matchId
          });
        } catch (initError: any) {
          showToast({
            type: "error",
            message:
              initError?.response?.data?.message ||
              initError?.message ||
              "Failed to initiate chat."
          });
          return;
        }
      }

      router.push(`/messages/${chatId}`);
    } catch (error: any) {
      showToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to check chat permission"
      });
    }
  };

  return (
    <div className={`w-full mx-auto p-4 pt-12 ${className ?? ""}`}>
      <div
        className={`grid gap-14 mb-8 ${
          cards?.length === 1
            ? "grid-cols-1 justify-items-center"
            : cards?.length === 2
              ? "grid-cols-1 sm:grid-cols-2 justify-items-center"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        }`}
      >
        {cards?.map((card) => {
          const isFlipped = flippedCardId === card.id;

          return (
            <div
              key={card.id} // Add a key prop
              className="flex flex-col items-center gap-4 relative perspective-[1000px] max-w-md w-full"
            >
              <div
                className={`relative w-full h-[420px] rounded-[24px] border-[3px] border-white shadow-[0px_4px_10px_rgba(0,0,0,0.1)] transition-all duration-700 ease-in-out hover:shadow-[0px_8px_25px_rgba(0,0,0,0.2)] [transform-style:preserve-3d] cursor-pointer group ${
                  isFlipped ? "bg-grey-100" : "bg-transparent"
                }`}
                style={{
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
                onClick={() =>
                  setFlippedCardId((prev) =>
                    prev === card.id ? null : card.id
                  )
                }
              >
                {/* Front Face */}
                <div className="absolute inset-0 rounded-[24px] [backface-visibility:hidden]">
                  <img
                    src={card.url}
                    alt={card.name}
                    className="w-full h-full object-cover rounded-[24px]"
                  />
                  <div className="absolute inset-0 card_gradient rounded-[24px]" />
                  <div className="absolute bottom-17 left-5 right-5 text-white z-10">
                    <h3 className="text-2xl font-semibold leading-tight">
                      {card.name}{" "}
                      <span className="text-base font-normal opacity-90">
                        {card.info}
                      </span>
                    </h3>
                    <p className="text-sm opacity-90 mt-1 leading-snug">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center gap-5 absolute -bottom-6 left-1/2 -translate-x-1/2 z-10">
                <button
                  onClick={() => handleOpenChat(card.id)}
                  className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-[0px_4px_28px_0px_#00000040] hover:scale-105 active:scale-95 transition-transform"
                >
                  <img
                    src={images.chatYellow.src}
                    alt="message"
                    className="w-7"
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMiddleAction?.(card);
                  }}
                  className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-[0px_4px_28px_0px_#00000040] hover:scale-105 active:scale-95 transition-transform"
                >
                  <img src={images.like.src} alt="like" className="w-7.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFlippedCardId((prev) =>
                      prev === card.id ? null : card.id
                    );
                  }}
                  className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-[0px_4px_28px_0px_#00000040] hover:scale-105 active:scale-95 transition-transform"
                >
                  <img
                    src={images.eyeBlue.src}
                    alt="view"
                    className="w-[28px]"
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityCard;
