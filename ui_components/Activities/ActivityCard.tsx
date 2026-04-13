"use client";
import { useRouter } from "next/navigation";
import { FC } from "react";

import { images } from "@/utils/images";

import { IActivityCardProps } from "./types";

const ActivityCard: FC<IActivityCardProps> = ({
  className,
  cards,
  activeTab,
  onLike,
  onPass,
  onUndo
}) => {
  const router = useRouter();

  const handleViewProfile = (petId: number) => {
    router.push(`/profile/${petId}?action=true`);
  };

  return (
    <div className={`w-full mx-auto p-4 pt-12 ${className ?? ""}`}>
      <div className="grid gap-14 mb-8 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {cards?.map((card) => {
          const buttonBase =
            "bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-[0px_4px_28px_0px_#00000040] hover:scale-105 active:scale-95 transition-transform";
          const largeButton =
            "bg-primary-500 rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-[0px_4px_28px_0px_#00000040] hover:scale-105 active:scale-95 transition-transform";

          return (
            <div
              key={card.id}
              className="flex flex-col items-center gap-4 relative max-w-md w-full"
            >
              <div className="relative w-full h-[420px] rounded-[24px] border-[3px] border-white shadow-[0px_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0px_8px_25px_rgba(0,0,0,0.2)] transition-shadow">
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

              <div className="flex justify-center items-center gap-5 absolute -bottom-6 left-1/2 -translate-x-1/2 z-10">
                {activeTab === "likes-me" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPass?.(card);
                      }}
                      className={buttonBase}
                    >
                      <img
                        src={images.dislike.src}
                        alt="Dislike"
                        className="w-5 h-5"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProfile(card.id);
                      }}
                      className={largeButton}
                    >
                      <img
                        src={images.pawYellow.src}
                        alt="Chat"
                        className="h-[30px]"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLike?.(card);
                      }}
                      className={buttonBase}
                    >
                      <img
                        src={images.like.src}
                        alt="Like"
                        className="w-[33px] h-[33px]"
                      />
                    </button>
                  </>
                )}
                {activeTab === "you-like" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUndo?.(card);
                      }}
                      className={buttonBase}
                    >
                      <img
                        src={images.dislike.src}
                        alt="Undo"
                        className="w-5 h-5"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProfile(card.id);
                      }}
                      className={largeButton}
                    >
                      <img
                        src={images.pawYellow.src}
                        alt="Chat"
                        className="h-[30px]"
                      />
                    </button>
                  </>
                )}
                {activeTab === "viewed-profile" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProfile(card.id);
                      }}
                      className={largeButton}
                    >
                      <img
                        src={images.pawYellow.src}
                        alt="Chat"
                        className="h-[30px]"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUndo?.(card);
                      }}
                      className={buttonBase}
                    >
                      <img
                        src={images.like.src}
                        alt="Like"
                        className="w-[33px] h-[33px]"
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityCard;
