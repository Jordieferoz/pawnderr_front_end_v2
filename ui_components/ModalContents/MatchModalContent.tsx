"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { closeMatchModal } from "@/store/modalSlice";
import { showToast } from "@/ui_components/Shared/ToastMessage";
import { messageInitiated } from "@/utils/api";
import { images } from "@/utils/images";

import { GenderCard } from "../Shared";

interface MatchModalContentProps {
  userImage: string;
  matchImage: string;
  userGender: string;
  matchGender: string;
  matchName: string;
  matchId: number;
  matchPetId: number;
  myPetId: number;
}

const MatchModalContent: FC<MatchModalContentProps> = ({
  userImage,
  matchImage,
  userGender,
  matchGender,
  matchName,
  matchId,
  matchPetId,
  myPetId
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleStartChatting = async () => {
    try {
      setLoading(true);
      const minPetId = Math.min(Number(myPetId), Number(matchPetId));
      const maxPetId = Math.max(Number(myPetId), Number(matchPetId));
      const chatId = `pet${minPetId}_pet${maxPetId}_match${matchId}`;

      await messageInitiated({
        chat_id: chatId,
        from_pet_id: myPetId,
        to_pet_id: matchPetId,
        match_id: matchId
      });

      dispatch(closeMatchModal());
      router.push(`/messages/${chatId}`);
    } catch (error: any) {
      showToast({
        type: "error",
        message: error?.message || "Failed to start chat"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueSwiping = () => {
    dispatch(closeMatchModal());
  };

  const isFemaleUser = (userGender || "").toLowerCase() === "female";

  return (
    <div className="w-full bg-white rounded-2xl relative">
      <img
        src={images.pawYellow.src}
        alt="match"
        className="w-20 mx-auto mb-2"
      />
      <h4 className="display4_medium text-dark-brown text-center mb-3">
        It's a Match!
      </h4>
      <p className="text-light-grey2 text-center body_large_medium mb-6 px-4">
        {isFemaleUser
          ? "You’ve got the first bark. Start chatting and see where this goes."
          : `Two hearts and four paws have found each other. ${
              matchName || "She"
            } takes the first step, and you’ll soon be part of the moment.`}
      </p>

      <div className="relative py-8 flex justify-center items-center h-[180px]">
        <div className="absolute left-1/2 -translate-x-[60%] z-10 -rotate-6">
          <GenderCard
            imageSrc={userImage}
            gender={userGender as "male" | "female"}
            className="border-4 border-white shadow-lg"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-[40%] translate-y-2 z-20 rotate-6">
          <GenderCard
            imageSrc={matchImage}
            gender={matchGender as "male" | "female"}
            className="border-4 border-white shadow-lg"
          />
        </div>

        {/* Heart Icon Overlay */}
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[60px] z-30 bg-white rounded-full p-2 shadow-md">
          <img src={images.like.src} className="w-6 h-6" alt="heart" />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {isFemaleUser ? (
          <Button
            className="w-full"
            onClick={handleStartChatting}
            disabled={loading}
          >
            {loading ? "Starting Chat..." : "Start Chatting"}
          </Button>
        ) : (
          <>
            <Button className="w-full" onClick={handleContinueSwiping}>
              Continue Swiping
            </Button>
            <p className="body_large_medium text-center text-light-grey2 mt-4">
              Or skip the wait with Pawnderr+
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchModalContent;
