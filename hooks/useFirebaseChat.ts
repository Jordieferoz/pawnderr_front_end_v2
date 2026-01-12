// hooks/useFirebaseChat.ts
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { signInWithFirebaseToken, onAuthStateChange } from "@/lib/firebase";
import {
  subscribeToMessages,
  sendMessage as sendFirebaseMessage,
  markMessagesAsRead,
  getUserConversations,
  getChatId,
  type ChatMessage,
  type ChatConversation
} from "@/utils/firebase-chat";
import { tokenStorage } from "@/utils/token-storage";

export const useFirebaseChat = () => {
  const { data: session } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize Firebase auth with custom token
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Try to get firebaseToken from session first, then from sessionStorage
        const firebaseToken =
          (session as any)?.firebaseToken ||
          tokenStorage.getFirebaseToken();

        if (!firebaseToken) {
          console.warn("⚠️ No Firebase token found");
          setIsInitializing(false);
          return;
        }

        await signInWithFirebaseToken(firebaseToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("❌ Failed to initialize Firebase:", error);
        setIsAuthenticated(false);
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
    isInitializing
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
      senderId: string,
      receiverId: string,
      text: string,
      type: "text" | "image" | "file" = "text",
      imageUrl?: string
    ) => {
      if (!chatId) {
        throw new Error("Chat ID is required");
      }

      await sendFirebaseMessage(
        chatId,
        senderId,
        receiverId,
        text,
        type,
        imageUrl
      );
    },
    [chatId]
  );

  const markAsRead = useCallback(
    async (userId: string) => {
      if (!chatId) {
        return;
      }

      await markMessagesAsRead(chatId, userId);
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

export const useChatConversations = (userId: string | null) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = getUserConversations(userId, (newConversations) => {
      setConversations(newConversations);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return {
    conversations,
    isLoading
  };
};

export { getChatId };
