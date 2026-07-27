"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useChatConversations, useFirebaseChat } from "@/hooks/useFirebaseChat";
import { setUnreadMessageCount } from "@/store/matchSlice";
import { PETS_STORAGE_EVENT, petsStorage } from "@/utils/pets-storage";

/** Keeps the Messages navigation indicator live on every dashboard screen. */
const MessageIndicatorListener = () => {
  const dispatch = useDispatch();
  const [petIds, setPetIds] = useState<number[]>([]);
  const { isAuthenticated } = useFirebaseChat();
  const { conversations } = useChatConversations(
    isAuthenticated ? petIds : []
  );

  useEffect(() => {
    const refreshPetIds = () => {
      const ids = (petsStorage.get()?.my_pets || [])
        .map((pet) => Number(pet.id))
        .filter(Number.isFinite);
      setPetIds(ids);
    };

    refreshPetIds();
    window.addEventListener(PETS_STORAGE_EVENT, refreshPetIds);
    return () => window.removeEventListener(PETS_STORAGE_EVENT, refreshPetIds);
  }, []);

  useEffect(() => {
    const unreadCount = conversations.reduce(
      (total, conversation) => total + (conversation.unreadCount || 0),
      0
    );
    dispatch(setUnreadMessageCount(unreadCount));
  }, [conversations, dispatch]);

  return null;
};

export default MessageIndicatorListener;
