// utils/firebase-chat.ts
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  limit as firestoreLimit,
  Timestamp,
  doc,
  setDoc,
  getDocs
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase";

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: number;
  read: boolean;
  type?: "text" | "image" | "file";
  imageUrl?: string;
}

export interface ChatConversation {
  chatId: string;
  participants: string[];
  myPetId?: number;
  otherPetId?: number;
  otherPetName?: string;
  otherPetPrimaryPhoto?: string;
  lastMessage?: ChatMessage;
  lastMessageTime?: number;
  unreadCount?: number;
  hasUnread?: boolean;
}

const normalizeId = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const getTimestampMillis = (
  timestamp?: Timestamp | { seconds?: number } | number | null
): number => {
  if (!timestamp) return 0;
  if (typeof timestamp === "number") return timestamp;
  if (timestamp instanceof Timestamp) {
    return timestamp.toMillis();
  }
  const seconds = (timestamp as { seconds?: number }).seconds;
  return seconds ? seconds * 1000 : 0;
};

/**
 * Get chat ID from two user IDs (ensures consistent ordering)
 */
export const getChatId = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join("_");
};

/**
 * Send a message to a chat
 */
export const sendMessage = async (
  chatId: string,
  fromPetId: number,
  toPetId: number,
  text: string,
  type: "text" | "image" | "file" = "text",
  imageUrl?: string
): Promise<void> => {
  const firestore = getFirebaseFirestore();
  if (!firestore) {
    throw new Error("Firebase Firestore is not available");
  }

  const message = {
    chatId,
    fromPetId: String(fromPetId),
    toPetId: String(toPetId),
    message: text,
    type,
    ...(imageUrl ? { imageUrl } : {}),
    timestamp: serverTimestamp(),
    isDisabled: false
  };

  await addDoc(collection(firestore, "messages"), message);
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (
  chatId: string,
  petId: number
): Promise<void> => {
  const firestore = getFirebaseFirestore();
  if (!firestore) {
    throw new Error("Firebase Firestore is not available");
  }

  const readDocId = `${chatId}_${petId}`;
  await setDoc(
    doc(firestore, "chat_reads", readDocId),
    {
      chatId,
      petId,
      lastRead: serverTimestamp()
    },
    { merge: true }
  );
};

/**
 * Listen to messages in a chat
 */
export const subscribeToMessages = (
  chatId: string,
  myPetId: number,
  callback: (messages: ChatMessage[]) => void,
  limit: number = 50
): (() => void) => {
  const firestore = getFirebaseFirestore();
  if (!firestore) {
    console.error("Firebase Firestore is not available");
    return () => {};
  }

  const messagesMap = new Map<string, ChatMessage>();
  const hasReceivedInitialData = { q1: false, q2: false };

  const updateMessagesFromSnapshots = () => {
    if (!hasReceivedInitialData.q1 && !hasReceivedInitialData.q2) {
      return;
    }
    const messages = Array.from(messagesMap.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );
    callback(messages);
  };

  const q1 = query(
    collection(firestore, "messages"),
    where("chatId", "==", chatId),
    where("fromPetId", "==", myPetId),
    where("isDisabled", "==", false),
    orderBy("timestamp", "desc"),
    firestoreLimit(limit)
  );

  const q2 = query(
    collection(firestore, "messages"),
    where("chatId", "==", chatId),
    where("toPetId", "==", myPetId),
    where("isDisabled", "==", false),
    orderBy("timestamp", "desc"),
    firestoreLimit(limit)
  );

  const unsubscribe1 = onSnapshot(
    q1,
    (snapshot) => {
      hasReceivedInitialData.q1 = true;
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        const timestamp = getTimestampMillis(data.timestamp as Timestamp);
        messagesMap.set(docSnap.id, {
          id: docSnap.id,
          text: data.message ?? data.text ?? "",
          senderId: String(data.fromPetId ?? ""),
          receiverId: String(data.toPetId ?? ""),
          timestamp,
          read: false,
          type: data.type,
          imageUrl: data.imageUrl
        });
      });
      updateMessagesFromSnapshots();
    },
    (error) => {
      console.error("Error listening to sent messages:", error);
      hasReceivedInitialData.q1 = true;
      updateMessagesFromSnapshots();
    }
  );

  const unsubscribe2 = onSnapshot(
    q2,
    (snapshot) => {
      hasReceivedInitialData.q2 = true;
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        const timestamp = getTimestampMillis(data.timestamp as Timestamp);
        messagesMap.set(docSnap.id, {
          id: docSnap.id,
          text: data.message ?? data.text ?? "",
          senderId: String(data.fromPetId ?? ""),
          receiverId: String(data.toPetId ?? ""),
          timestamp,
          read: false,
          type: data.type,
          imageUrl: data.imageUrl
        });
      });
      updateMessagesFromSnapshots();
    },
    (error) => {
      console.error("Error listening to received messages:", error);
      hasReceivedInitialData.q2 = true;
      updateMessagesFromSnapshots();
    }
  );

  return () => {
    unsubscribe1();
    unsubscribe2();
  };
};

/**
 * Block a chat (only blocker sees it)
 */
export const blockChat = async (
  chatId: string,
  blockedByPetId: number
): Promise<void> => {
  const firestore = getFirebaseFirestore();
  if (!firestore) return;

  await setDoc(
    doc(firestore, "chats", chatId),
    { blocked_by: blockedByPetId },
    { merge: true }
  );
};

/**
 * Unblock a chat
 */
export const unblockChat = async (chatId: string): Promise<void> => {
  const firestore = getFirebaseFirestore();
  if (!firestore) return;

  await setDoc(
    doc(firestore, "chats", chatId),
    { blocked_by: null },
    { merge: true }
  );
};

/**
 * Get user's conversations
 */
/**
 * Subscribe to single chat details
 */
export const subscribeToChat = (
  chatId: string,
  myPetId: number,
  callback: (
    details: { otherPetName?: string; otherPetPrimaryPhoto?: string } | null
  ) => void
): (() => void) => {
  const firestore = getFirebaseFirestore();
  if (!firestore) return () => {};

  return onSnapshot(
    doc(firestore, "chats", chatId),
    (docSnap) => {
      if (!docSnap.exists()) {
        callback(null);
        return;
      }
      const data = docSnap.data();
      const chatPet1Id = normalizeId(data.pet1_id);

      const normalizedMyPetId = normalizeId(myPetId);

      const otherPetMetadata =
        normalizedMyPetId === chatPet1Id
          ? data.pet2_metadata
          : data.pet1_metadata;

      callback({
        otherPetName:
          otherPetMetadata?.name ||
          otherPetMetadata?.pet_name ||
          otherPetMetadata?.petName,
        otherPetPrimaryPhoto:
          otherPetMetadata?.primary_photo_url ||
          otherPetMetadata?.primaryPhotoUrl
      });
    },
    (error) => {
      console.error("Error subscribing to chat details:", error);
      callback(null);
    }
  );
};

/**
 * Get user's conversations
 */
export const getUserConversations = (
  petIds: number[],
  callback: (conversations: ChatConversation[]) => void
): (() => void) => {
  const firestore = getFirebaseFirestore();
  if (!firestore) {
    console.error("Firebase Firestore is not available");
    return () => {};
  }
  if (!petIds.length) {
    callback([]);
    return () => {};
  }

  const chatMap = new Map<string, any>();
  const lastMessageMap = new Map<
    string,
    {
      message: string;
      timestamp?: Timestamp | null;
      fromPetId?: number | null;
      toPetId?: number | null;
    }
  >();
  const lastReadMap: Record<string, Timestamp> = {};
  const chatListeners: Array<() => void> = [];
  const readListeners: Array<() => void> = [];
  const lastMessageListeners = new Map<string, () => void>();
  let isActive = true;

  const updateChatList = () => {
    if (!isActive) return;

    const conversations = Array.from(chatMap.values())
      .map((chat) => {
        const chatPet1Id = normalizeId(chat.pet1_id);
        const chatPet2Id = normalizeId(chat.pet2_id);
        if (!chatPet1Id || !chatPet2Id) return null;

        const myPetId =
          petIds.find((id) => {
            const normalizedId = normalizeId(id);
            return normalizedId === chatPet1Id || normalizedId === chatPet2Id;
          }) ?? null;

        if (!myPetId) return null;
        const normalizedMyPetId = normalizeId(myPetId);
        if (!normalizedMyPetId) return null;

        const otherPetId =
          normalizedMyPetId === chatPet1Id ? chatPet2Id : chatPet1Id;
        const otherPetMetadata =
          normalizedMyPetId === chatPet1Id
            ? chat.pet2_metadata
            : chat.pet1_metadata;
        const otherPetName =
          otherPetMetadata?.name ||
          otherPetMetadata?.pet_name ||
          otherPetMetadata?.petName ||
          undefined;
        const otherPetPrimaryPhoto =
          otherPetMetadata?.primary_photo_url ||
          otherPetMetadata?.primaryPhotoUrl ||
          undefined;

        // Block logic: Hide chat if blocked by someone else
        const isBlocked = !!chat.blocked_by;
        const blockedBy = normalizeId(chat.blocked_by);

        if (isBlocked && blockedBy !== normalizedMyPetId) {
          return null;
        }

        const lastMsg = lastMessageMap.get(chat.chatId);
        const lastMessageTime = getTimestampMillis(lastMsg?.timestamp);
        const lastMessage = lastMsg
          ? {
              id: "",
              text: lastMsg.message,
              senderId: String(lastMsg.fromPetId ?? ""),
              receiverId: String(lastMsg.toPetId ?? ""),
              timestamp: lastMessageTime,
              read: false
            }
          : undefined;

        const lastRead = lastReadMap[chat.chatId];
        const lastReadTime = getTimestampMillis(lastRead);
        let unreadCount = 0;
        const lastSenderId = normalizeId(lastMsg?.fromPetId);
        if (
          lastMessageTime &&
          lastSenderId &&
          lastSenderId !== normalizedMyPetId
        ) {
          if (!lastReadTime || lastMessageTime > lastReadTime) {
            unreadCount = 1;
          }
        }

        return {
          chatId: chat.chatId,
          participants: [String(chatPet1Id), String(chatPet2Id)],
          myPetId: normalizedMyPetId,
          otherPetId,
          otherPetName,
          otherPetPrimaryPhoto,
          lastMessage,
          lastMessageTime: lastMessageTime || undefined,
          unreadCount,
          hasUnread: unreadCount > 0
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) => (b?.lastMessageTime || 0) - (a?.lastMessageTime || 0)
      ) as ChatConversation[];

    callback(conversations);
  };

  const loadLastReadTimestamps = async () => {
    try {
      for (const petId of petIds) {
        const snapshot = await getDocs(
          query(
            collection(firestore, "chat_reads"),
            where("petId", "==", petId)
          )
        );
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          if (data?.chatId && data?.lastRead) {
            lastReadMap[data.chatId] = data.lastRead;
          }
        });
      }
    } catch (error) {
      console.warn("Error loading last read timestamps:", error);
    }
  };

  const ensureLastMessageListener = (chatId: string, petId: number) => {
    if (lastMessageListeners.has(chatId)) return;

    const msgQuery1 = query(
      collection(firestore, "messages"),
      where("chatId", "==", chatId),
      where("fromPetId", "==", petId),
      where("isDisabled", "==", false),
      orderBy("timestamp", "desc"),
      firestoreLimit(1)
    );

    const msgQuery2 = query(
      collection(firestore, "messages"),
      where("chatId", "==", chatId),
      where("toPetId", "==", petId),
      where("isDisabled", "==", false),
      orderBy("timestamp", "desc"),
      firestoreLimit(1)
    );

    const updateFromSnapshot = (snapshot: any, shouldCompare: boolean) => {
      if (snapshot.empty) return;
      const docSnap = snapshot.docs[0];
      const data = docSnap.data() as any;
      const timestamp = data.timestamp as Timestamp | null;
      const newTimestamp = getTimestampMillis(timestamp);
      const current = lastMessageMap.get(chatId);
      const currentTimestamp = getTimestampMillis(current?.timestamp);

      if (!shouldCompare || newTimestamp > currentTimestamp) {
        lastMessageMap.set(chatId, {
          message: data.message ?? data.text ?? "",
          timestamp,
          fromPetId: normalizeId(data.fromPetId),
          toPetId: normalizeId(data.toPetId)
        });
        updateChatList();
      }
    };

    const unsub1 = onSnapshot(
      msgQuery1,
      (snapshot) => updateFromSnapshot(snapshot, false),
      (error) => {
        console.warn(
          `Error listening to last message (sent) ${chatId}:`,
          error
        );
      }
    );

    const unsub2 = onSnapshot(
      msgQuery2,
      (snapshot) => updateFromSnapshot(snapshot, true),
      (error) => {
        console.warn(
          `Error listening to last message (received) ${chatId}:`,
          error
        );
      }
    );

    lastMessageListeners.set(chatId, () => {
      unsub1();
      unsub2();
    });
  };

  const listenForChats = (petId: number, field: "pet1_id" | "pet2_id") => {
    const chatsQuery = query(
      collection(firestore, "chats"),
      where(field, "==", petId),
      where("is_disabled", "==", false)
    );

    const unsubscribe = onSnapshot(
      chatsQuery,
      (snapshot) => {
        console.log(
          `DEBUG: Chats snapshot for ${field}=${petId}: ${snapshot.size} docs found`
        );
        const activeChatIds = new Set<string>();
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          console.log(`DEBUG: Chat Doc ${docSnap.id}:`, data);
          const chatId = docSnap.id;
          activeChatIds.add(chatId);
          chatMap.set(chatId, { chatId, ...data });
          ensureLastMessageListener(chatId, petId);
        });

        Array.from(chatMap.entries()).forEach(([chatId, chatData]) => {
          const chatPetId = normalizeId(chatData[field]);
          if (chatPetId === petId && !activeChatIds.has(chatId)) {
            chatMap.delete(chatId);
            lastMessageMap.delete(chatId);
            const unsub = lastMessageListeners.get(chatId);
            if (unsub) {
              unsub();
              lastMessageListeners.delete(chatId);
            }
          }
        });

        updateChatList();
      },
      (error) => {
        console.error(`Error fetching chats (${field}):`, error);
        callback([]);
      }
    );

    chatListeners.push(unsubscribe);
  };

  const listenForReads = (petId: number) => {
    const readsQuery = query(
      collection(firestore, "chat_reads"),
      where("petId", "==", petId)
    );

    const unsubscribe = onSnapshot(
      readsQuery,
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          if (data?.chatId && data?.lastRead) {
            lastReadMap[data.chatId] = data.lastRead;
          }
        });
        updateChatList();
      },
      (error) => {
        console.warn("Error listening to read receipts:", error);
      }
    );

    readListeners.push(unsubscribe);
  };

  loadLastReadTimestamps().finally(() => {
    updateChatList();
  });

  petIds.forEach((petId) => {
    listenForChats(petId, "pet1_id");
    listenForChats(petId, "pet2_id");
    listenForReads(petId);
  });

  return () => {
    isActive = false;
    chatListeners.forEach((unsub) => unsub());
    readListeners.forEach((unsub) => unsub());
    lastMessageListeners.forEach((unsub) => unsub());
    chatListeners.length = 0;
    readListeners.length = 0;
    lastMessageListeners.clear();
  };
};
