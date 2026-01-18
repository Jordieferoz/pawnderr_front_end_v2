"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { CustomAvatar } from "@/ui_components/Shared";
import { showToast } from "@/ui_components/Shared/ToastMessage";
import {
  checkCanChat,
  fetchActiveMatches,
  messageInitiated
} from "@/utils/api";
import { images } from "@/utils/images";
import { petsStorage } from "@/utils/pets-storage";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [matchesPage, setMatchesPage] = useState(1);
  const [hasMoreMatches, setHasMoreMatches] = useState(true);
  const mobileMatchesRef = useRef<HTMLDivElement>(null);
  const desktopMatchesRef = useRef<HTMLDivElement>(null);

  const loadMatches = useCallback(async (page: number, append: boolean) => {
    setIsLoadingMatches(true);
    try {
      const response = await fetchActiveMatches({
        page,
        limit: 20,
        state: "active"
      });
      const items =
        response?.data?.data?.matches ||
        response?.data?.data?.results ||
        response?.data?.matches ||
        response?.data?.results ||
        [];
      const pagination =
        response?.data?.data?.pagination || response?.data?.pagination || {};
      const totalPages = pagination?.totalPages ?? pagination?.total_pages ?? 0;
      const nextHasMore = page < totalPages;

      const nextItems = Array.isArray(items) ? items : [];
      setMatches((prev) => (append ? [...prev, ...nextItems] : nextItems));
      setHasMoreMatches(nextHasMore);
    } catch (error: any) {
      showToast({
        type: "error",
        message: error?.message || "Unable to load matches. Please try again."
      });
      if (!append) {
        setMatches([]);
      }
      setHasMoreMatches(false);
    } finally {
      setIsLoadingMatches(false);
    }
  }, []);

  useEffect(() => {
    loadMatches(1, false);
  }, [loadMatches]);

  const handleMatchesScroll = (container: HTMLDivElement | null) => {
    if (!container || isLoadingMatches || !hasMoreMatches) return;
    const threshold = 80;
    const isNearEnd =
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - threshold;
    if (isNearEnd) {
      const nextPage = matchesPage + 1;
      setMatchesPage(nextPage);
      loadMatches(nextPage, true);
    }
  };

  useEffect(() => {
    const mobileEl = mobileMatchesRef.current;
    const desktopEl = desktopMatchesRef.current;
    const onScrollMobile = () => handleMatchesScroll(mobileEl);
    const onScrollDesktop = () => handleMatchesScroll(desktopEl);

    if (mobileEl) {
      mobileEl.addEventListener("scroll", onScrollMobile);
    }
    if (desktopEl) {
      desktopEl.addEventListener("scroll", onScrollDesktop);
    }

    return () => {
      if (mobileEl) {
        mobileEl.removeEventListener("scroll", onScrollMobile);
      }
      if (desktopEl) {
        desktopEl.removeEventListener("scroll", onScrollDesktop);
      }
    };
  }, [isLoadingMatches, hasMoreMatches, matchesPage]);

  const handleMatchClick = async (match: any) => {
    const fromPetId = petsStorage.getFirstPetId();
    const toPetId =
      match?.pet_id || match?.pet?.id || match?.profile?.pet_id || match?.id;
    const matchId = match?.match_id || match?.id;

    if (!fromPetId || !toPetId) {
      showToast({
        type: "error",
        message: "Unable to start chat. Missing pet details."
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

      const chatId =
        matchId !== undefined && matchId !== null
          ? `pet${fromPetId}_pet${toPetId}_match${matchId}`
          : `pet${fromPetId}_pet${toPetId}`;

      if (matchId !== undefined && matchId !== null) {
        await messageInitiated({
          chat_id: chatId,
          from_pet_id: fromPetId,
          to_pet_id: toPetId,
          match_id: matchId
        });
      }

      router.push(`/messages/${chatId}`);
    } catch (error: any) {
      showToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to initiate chat."
      });
    }
  };

  const renderMatchAvatar = (match: any) => {
    const pet =
      match?.pet || match?.profile || match?.pet_profile || match?.petData;
    const petName = pet?.name || pet?.pet_name || match?.pet_name || "Pet";
    const petImage =
      pet?.image_url ||
      pet?.primary_image?.image_url ||
      pet?.images?.[0]?.image_url ||
      images.doggo1.src;

    return (
      <button
        key={match?.match_id || match?.id || pet?.id || petName}
        onClick={() => handleMatchClick(match)}
        className="focus:outline-none"
        type="button"
      >
        <CustomAvatar
          src={petImage}
          size={48}
          type="countdown"
          name={petName}
        />
      </button>
    );
  };
  return (
    <div className="relative h-[calc(100vh-90px)] common_container overflow-hidden">
      <div className="container mx-auto h-full flex flex-col">
        <div className="my-4 mb-0 md:hidden flex-none">
          <div className="flex items-center gap-3 mb-4">
            <img
              onClick={() => router.back()}
              className="w-10 h-10"
              src={images.backBtn.src}
              alt="back"
            />
            <h4 className="display4_medium text-accent-900">Messages</h4>
          </div>
          <div
            ref={mobileMatchesRef}
            className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-2"
          >
            {isLoadingMatches
              ? null
              : matches.map((match) => renderMatchAvatar(match))}
          </div>
        </div>

        <div className="hidden md:flex items-center justify-between my-4 mb-6 flex-none">
          <h4 className="display4_medium text-accent-900">Messages</h4>
          <div
            ref={desktopMatchesRef}
            className="flex items-center gap-4 overflow-x-auto hide-scrollbar"
          >
            {isLoadingMatches
              ? null
              : matches.map((match) => renderMatchAvatar(match))}
          </div>
        </div>

        <div className="flex-1 min-h-0 pb-4">
          {children}
        </div>
      </div>
      <img
        className="absolute w-full left-0 top-0 hidden md:flex pointer-events-none z-[-1]"
        src={images.discoverBg.src}
        alt="messages_pattern"
      />
    </div>
  );
}
