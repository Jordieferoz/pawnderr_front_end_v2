"use client";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

import { showToast } from "@/ui_components/Shared/ToastMessage";
import { checkCanChat, messageInitiated } from "@/utils/api";
import { images } from "@/utils/images";
import { petsStorage } from "@/utils/pets-storage";

type Card = {
  id: string | number;
  petId: string | number;
  name: string;
  info: string;
  url: string;
  desc: string;
  details: string;
  indicator?: string;
  matchId?: string | number;
  funFact?: string;
  barkography?: string;
};

const FlipCard: FC<{ card: Card }> = ({ card }) => {
  const router = useRouter();

  const [isFlipped, setIsFlipped] = useState(false);

  const handleOpenChat = async (toPetId: string | number) => {
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
        from_pet_id: Number(fromPetId),
        to_pet_id: Number(toPetId)
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

      const matchId = card.matchId;
      const minPetId = Math.min(Number(fromPetId), Number(toPetId));
      const maxPetId = Math.max(Number(fromPetId), Number(toPetId));

      const chatId =
        matchId !== undefined && matchId !== null
          ? `pet${minPetId}_pet${maxPetId}_match${matchId}`
          : `pet${minPetId}_pet${maxPetId}`;

      if (matchId !== undefined && matchId !== null) {
        try {
          await messageInitiated({
            chat_id: chatId,
            from_pet_id: Number(fromPetId),
            to_pet_id: Number(toPetId),
            match_id: Number(matchId)
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

  const largeButton =
    "bg-primary-500 rounded-full w-[68px] h-[68px] flex items-center justify-center shadow-[0px_4px_28px_0px_#00000040] hover:scale-105 active:scale-95 transition-transform";
  return (
    <div className="flex flex-col items-center gap-4 relative perspective-[1000px]">
      <div
        className="relative w-full h-[420px] rounded-[24px] border-[3px] border-white shadow-[0px_4px_10px_rgba(0,0,0,0.1)] transition-all duration-700 ease-in-out hover:shadow-[0px_8px_25px_rgba(0,0,0,0.2)] [transform-style:preserve-3d] cursor-pointer group"
        style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Face */}
        <div className="absolute inset-0 rounded-[24px] [backface-visibility:hidden]">
          {card.indicator && (
            <div className="absolute top-6 left-6 z-20 bg-black text-white px-3 py-1 rounded-lg border-[1.5px] border-white text-sm font-bold tracking-wider">
              {card.indicator}
            </div>
          )}
          <img
            src={card.url}
            alt={card.name}
            className="w-full h-full object-cover rounded-[24px]"
          />
          <div className="absolute inset-0 card_gradient rounded-[24px]" />
          <div className="absolute bottom-17 left-5 right-5 text-white z-10">
            <h3 className="text-2xl font-semibold leading-tight">
              {card.name}{" "}
              <span className="text-base font-normal opacity-90 capitalize">
                {card.info}
              </span>
            </h3>
            <p className="text-sm opacity-90 mt-1 leading-snug line-clamp-2 text-ellipsis">
              {card.desc}
            </p>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 rounded-[24px] bg-white [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-start items-start text-left p-8 overflow-hidden">
          <img
            src={images.pawYellow.src}
            alt="paw"
            className="absolute top-4 right-4 w-12 h-12 opacity-80"
          />

          <div className="flex flex-col gap-6 mt-4 w-full">
            {/* Fun Fact */}
            {card.funFact && (
              <div className="text-left w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Fun Fact:
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm line-clamp-2">
                  {card.funFact}
                </p>
                {card.funFact.length > 50 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/profile/${card.petId}?action=false`);
                    }}
                    className="text-yellow-500 underline text-sm font-medium hover:text-yellow-600 mt-1"
                  >
                    Read More
                  </button>
                )}
              </div>
            )}

            {/* Bark-o-graphy */}
            {card.barkography && (
              <div className="text-left w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Bio (aka Bark-o-graphy):
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm line-clamp-5">
                  {card.barkography}
                </p>
                {(card.barkography.length > 100 ||
                  card.barkography.split("\n").length > 3) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/profile/${card.petId}?action=false`);
                    }}
                    className="text-yellow-500 underline text-sm font-medium hover:text-yellow-600 mt-1"
                  >
                    Read More
                  </button>
                )}
              </div>
            )}

            {!card.funFact && !card.barkography && (
              <div className="text-lg opacity-90 space-y-2 text-gray-800">
                {card.details.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-5 absolute -bottom-6 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={() => handleOpenChat(card.petId)}
          className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-[0px_4px_28px_0px_#00000040] hover:scale-105 active:scale-95 transition-transform"
        >
          <img src={images.messagesActive.src} alt="message" className="w-7" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/profile/${card.petId}?action=false`);
          }}
          className={largeButton}
        >
          <img src={images.pawYellow.src} alt="Like" className="h-[36px]" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFlipped(!isFlipped);
          }}
          className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-[0px_4px_28px_0px_#00000040] hover:scale-105 active:scale-95 transition-transform"
        >
          <img src={images.eyeBlue.src} alt="view" className="w-[28px]" />
        </button>
      </div>
    </div>
  );
};

interface MatchedCardProps {
  matches?: any[];
  indicators?: any[];
}

const MatchedCard: FC<MatchedCardProps> = ({
  matches = [],
  indicators = []
}) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">No active matches found.</p>
      </div>
    );
  }

  // Create a Set of verified IDs correctly
  // Assuming indicators might be a list of objects or just IDs.
  // We'll flexibly handle both.
  const indicatorSet = new Set(
    indicators.map((i: any) => {
      if (typeof i === "object" && i !== null) {
        return String(i.match_id || i.id || "");
      }
      return String(i);
    })
  );

  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
        {matches.map((match, index) => {
          const matchId = String(match.match_id || match.id || "");
          const fromPetId = petsStorage.getFirstPetId();
          const minPetId = Math.min(Number(fromPetId), Number(match.pet.id));
          const maxPetId = Math.max(Number(fromPetId), Number(match.pet.id));
          const chatId = `pet${minPetId}_pet${maxPetId}_match${matchId}`;
          const hasIndicator = indicatorSet.has(matchId);

          // Find primary image
          const primaryImage =
            match.pet?.images?.find((img: any) => img.is_primary)?.image_url ||
            match.pet?.images?.[0]?.image_url ||
            match.pet?.primary_photo_url ||
            match.primary_photo_url;

          return (
            <FlipCard
              key={match.id || index}
              card={{
                id: chatId,
                petId: match.pet.id,
                name: match.pet?.name || match.name || "Unknown",
                info: `(${match.pet?.gender || match.gender || "Unknown"}, ${match.pet?.age || match.age || "?"} Years)`,
                url: primaryImage,
                desc:
                  match.pet?.bio ||
                  match.bio ||
                  match.description ||
                  "No description available",
                details: [
                  match.pet?.breed?.name ||
                    match.pet?.breed ||
                    match.breed ||
                    "Unknown Breed",
                  match.pet?.weight ? `Weight: ${match.pet?.weight}kg` : ""
                ]
                  .filter(Boolean)
                  .join("\n"),
                indicator: hasIndicator ? "NEW!" : undefined,
                matchId: match.match_id || match.id,
                funFact: match.pet?.fun_fact_or_habit,
                barkography: match.pet?.bark_o_graphy
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MatchedCard;
