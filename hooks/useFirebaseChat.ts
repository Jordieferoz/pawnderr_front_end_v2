// hooks/useFirebaseChat.ts
import {
  getFirebaseFirestore,
  onAuthStateChange,
  signInWithFirebaseToken
} from "@/lib/firebase";
import { fetchFirebaseToken, messageInitiated } from "@/utils/api";
import {
  getChatId,
  getUserConversations,
  markMessagesAsRead,
  sendMessage as sendFirebaseMessage,
  subscribeToChat,
  subscribeToMessages,
  type ChatConversation,
  type ChatMessage
} from "@/utils/firebase-chat";
import { tokenStorage } from "@/utils/token-storage";
import { doc, getDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

export const useFirebaseChat = () => {
  const { data: session } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Firebase auth with custom token
  useEffect(() => {
    const resolveFirebaseToken = async (
      forceRefresh: boolean = false
    ): Promise<string | null> => {
      if (!forceRefresh) {
        const storedToken =
          (session as any)?.firebaseToken || tokenStorage.getFirebaseToken();
        if (storedToken) {
          return storedToken;
        }
      }

      try {
        const resp = await fetchFirebaseToken();
        if (process.env.NODE_ENV !== "production") {
          const payload = resp?.data as any;
          const rawToken =
            payload?.firebaseToken ||
            payload?.data?.firebaseToken ||
            payload?.token ||
            payload?.data?.token;
          console.log("🔎 Firebase token response:", {
            hasToken: Boolean(rawToken),
            tokenType: typeof rawToken,
            tokenLength: typeof rawToken === "string" ? rawToken.length : 0,
            keys: payload ? Object.keys(payload) : []
          });
        }
        const apiToken =
          resp?.data?.firebaseToken ||
          resp?.data?.data?.firebaseToken ||
          resp?.data?.token ||
          resp?.data?.data?.token;
        if (apiToken) {
          try {
            // Debug: Decode token to verify project ID match
            const parts = apiToken.split(".");
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              console.log("🕵️‍♀️ Firebase Token Debug:", {
                projectId: payload.aud,
                issuer: payload.iss,
                sub: payload.sub,
                frontendProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                isMatch:
                  payload.aud === process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
              });

              if (payload.aud !== process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
                console.error(
                  `❌ PROJECT ID MISMATCH! Token is for '${payload.aud}' but frontend is '${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}'`
                );
              }
            }
          } catch (e) {
            console.error("❌ Failed to decode token for debug:", e);
          }

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
      } catch (error: any) {
        const errorCode = error?.code || "";
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to initialize Firebase";

        if (String(errorCode).includes("auth/invalid-custom-token")) {
          console.warn(
            "⚠️ Invalid Custom Token detected. Attempting to refresh...",
            error
          );
          tokenStorage.clearFirebaseToken();
          const freshToken = await resolveFirebaseToken(true);
          if (freshToken) {
            try {
              await signInWithFirebaseToken(freshToken);
              setIsAuthenticated(true);
              setError(null);
              return;
            } catch (retryError: any) {
              console.error("❌ Firebase retry failed:", retryError);
              const retryErrorMessage =
                retryError instanceof Error
                  ? retryError.message
                  : "Failed to authenticate after token refresh";
              setError(`Retry failed: ${retryErrorMessage}`);
              setIsAuthenticated(false);
              return;
            }
          }
        }

        console.error("❌ Failed to initialize Firebase:", error);
        setIsAuthenticated(false);
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

export const useChatMessages = (chatId: string | null, myPetId?: number) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const chatInitiatedRef = useRef<Record<string, boolean>>({});

  const getMatchIdFromChat = useCallback((id: string) => {
    const match = id.match(/match(\d+)/);
    return match ? Number(match[1]) : null;
  }, []);

  useEffect(() => {
    if (!chatId || !myPetId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToMessages(chatId, myPetId, (newMessages) => {
      setMessages(newMessages);
      setIsLoading(false);
      if (newMessages.length > 0) {
        chatInitiatedRef.current[chatId] = true;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [chatId, myPetId]);

  const sendMessage = useCallback(
    async (
      fromPetId: number,
      toPetId: number,
      text: string,
      type: "text" | "image" | "file" = "text",
      imageUrl?: string
    ) => {
      if (!chatId) {
        throw new Error("Chat ID is required");
      }

      if (!fromPetId || !toPetId) {
        throw new Error("Pet IDs are required");
      }

      const firestore = getFirebaseFirestore();
      if (!firestore) {
        throw new Error("Firebase Firestore is not available");
      }

      const isFirstMessage = !chatInitiatedRef.current[chatId];
      if (isFirstMessage) {
        const matchId = getMatchIdFromChat(chatId);
        if (!matchId) {
          throw new Error(
            "Match ID is missing. Please start the chat from a match."
          );
        }

        await messageInitiated({
          chat_id: chatId,
          from_pet_id: fromPetId,
          to_pet_id: toPetId,
          match_id: matchId
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
        chatInitiatedRef.current[chatId] = true;
      }

      const chatDoc = await getDoc(doc(firestore, "chats", chatId));
      if (!chatDoc.exists()) {
        throw new Error("Chat document not found.");
      }

      if (chatDoc.data()?.is_disabled) {
        throw new Error(
          "This chat has been disabled or blocked. You cannot send messages."
        );
      }

      await sendFirebaseMessage(
        chatId,
        fromPetId,
        toPetId,
        text,
        type,
        imageUrl
      );
    },
    [chatId, getMatchIdFromChat]
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
      console.log("DEBUG: useChatConversations - No petIds provided");
      setConversations([]);
      setIsLoading(false);
      return;
    }

    console.log("DEBUG: useChatConversations - Subscribing for pets:", petIds);
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

export const useChatDetails = (chatId: string | null, myPetId?: number) => {
  const [details, setDetails] = useState<{
    otherPetName?: string;
    otherPetPrimaryPhoto?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chatId || !myPetId) {
      setDetails(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToChat(chatId, myPetId, (data) => {
      setDetails(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [chatId, myPetId]);

  return { details, isLoading };
};

export { getChatId };
