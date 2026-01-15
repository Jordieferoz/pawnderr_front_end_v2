// hooks/useFirebaseChat.ts
import { onAuthStateChange, signInWithFirebaseToken } from "@/lib/firebase";
import { fetchFirebaseToken } from "@/utils/api";
import {
  getChatId,
  getUserConversations,
  markMessagesAsRead,
  sendMessage as sendFirebaseMessage,
  subscribeToMessages,
  type ChatConversation,
  type ChatMessage
} from "@/utils/firebase-chat";
import { tokenStorage } from "@/utils/token-storage";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export const useFirebaseChat = () => {
  const { data: session } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Firebase auth with custom token
  useEffect(() => {
    const resolveFirebaseToken = async (): Promise<string | null> => {
      const storedToken =
        (session as any)?.firebaseToken || tokenStorage.getFirebaseToken();
      if (storedToken) {
        return storedToken;
      }

      try {
        const resp = await fetchFirebaseToken();
        const apiToken =
          resp?.data?.firebaseToken ||
          resp?.data?.data?.firebaseToken ||
          resp?.data?.token ||
          resp?.data?.data?.token;
        if (apiToken) {
          tokenStorage.setFirebaseToken(apiToken);
          return apiToken;
        }
      } catch (fetchError) {
        console.error("❌ Failed to fetch Firebase token:", fetchError);
      }

      return null;
    };

    const initializeFirebase = async () => {
      try {
        const firebaseToken = await resolveFirebaseToken();
        if (!firebaseToken) {
          console.warn("⚠️ No Firebase token found");
          setError("Firebase token missing. Please sign in again.");
          setIsInitializing(false);
          return;
        }

        await signInWithFirebaseToken(firebaseToken);
        setIsAuthenticated(true);
        setError(null);
      } catch (error) {
        console.error("❌ Failed to initialize Firebase:", error);
        setIsAuthenticated(false);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to initialize Firebase";
        setError(errorMessage);
      } finally {
        setIsInitializing(false);
      }
    };

    // Wait for session to be available
    if (session !== undefined) {
      initializeFirebase();
    }

    // Listen to auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setIsAuthenticated(!!user);
    });

    return () => {
      unsubscribe();
    };
  }, [session]);

  return {
    isAuthenticated,
    isInitializing,
    error
  };
};

export const useChatMessages = (chatId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToMessages(chatId, (newMessages) => {
      setMessages(newMessages);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  const sendMessage = useCallback(
    async (
      fromPetId: number,
      toPetId: number,
      fromUserId: string,
      text: string,
      type: "text" | "image" | "file" = "text",
      imageUrl?: string,
      toUserId?: string
    ) => {
      if (!chatId) {
        throw new Error("Chat ID is required");
      }

      await sendFirebaseMessage(
        chatId,
        fromPetId,
        toPetId,
        fromUserId,
        text,
        type,
        imageUrl,
        toUserId
      );
    },
    [chatId]
  );

  const markAsRead = useCallback(
    async (petId: number) => {
      if (!chatId) {
        return;
      }

      await markMessagesAsRead(chatId, petId);
    },
    [chatId]
  );

  return {
    messages,
    isLoading,
    sendMessage,
    markAsRead
  };
};

export const useChatConversations = (petIds: number[]) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const petIdsKey = petIds.join(",");

  useEffect(() => {
    if (!petIds.length) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = getUserConversations(petIds, (newConversations) => {
      setConversations(newConversations);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [petIdsKey]);

  return {
    conversations,
    isLoading
  };
};

export { getChatId };
