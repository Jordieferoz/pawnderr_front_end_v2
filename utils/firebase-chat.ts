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
  setDoc
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
  lastMessage?: ChatMessage;
  lastMessageTime?: number;
  unreadCount?: number;
}

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
  fromUserId: string,
  text: string,
  type: "text" | "image" | "file" = "text",
  imageUrl?: string,
  toUserId?: string
): Promise<void> => {
  const firestore = getFirebaseFirestore();
  if (!firestore) {
    throw new Error("Firebase Firestore is not available");
  }

  const message = {
    chatId,
    fromPetId,
    toPetId,
    fromUserId,
    ...(toUserId ? { toUserId } : {}),
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
  callback: (messages: ChatMessage[]) => void,
  limit: number = 50
): (() => void) => {
  const firestore = getFirebaseFirestore();
  if (!firestore) {
    console.error("Firebase Firestore is not available");
    return () => {};
  }

  const messagesQuery = query(
    collection(firestore, "messages"),
    where("chatId", "==", chatId),
    where("isDisabled", "==", false),
    orderBy("timestamp"),
    firestoreLimit(limit)
  );

  const unsubscribe = onSnapshot(
    messagesQuery,
    (snapshot) => {
      const messages: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        const ts: Timestamp | undefined = data.timestamp;
        const timestamp =
          ts?.toMillis?.() ?? (ts as any)?.seconds * 1000 ?? 0;

        messages.push({
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
      callback(messages);
    },
    (error) => {
      console.error("Error listening to messages:", error);
      callback([]);
    }
  );

  return () => {
    unsubscribe();
  };
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

  const handleSnapshot = (snapshot: any) => {
    snapshot.forEach((docSnap: any) => {
      const data = docSnap.data();
      const ts: Timestamp | undefined = data.timestamp;
      const timestamp =
        ts?.toMillis?.() ?? (ts as any)?.seconds * 1000 ?? 0;
      const existing = chatMap.get(data.chatId);
      if (!existing || timestamp > (existing.timestamp || 0)) {
        chatMap.set(data.chatId, { ...data, timestamp });
      }
    });

    const conversations: ChatConversation[] = Array.from(chatMap.values())
      .filter((msg) => msg.chatId)
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .map((msg) => {
        const myPetId =
          petIds.find(
            (id) => id === msg.fromPetId || id === msg.toPetId
          ) ?? petIds[0];
        const otherPetId = myPetId === msg.fromPetId ? msg.toPetId : msg.fromPetId;

        return {
          chatId: msg.chatId,
          participants: [String(msg.fromPetId), String(msg.toPetId)],
          myPetId,
          otherPetId,
          lastMessage: {
            id: msg.id || "",
            text: msg.message ?? msg.text ?? "",
            senderId: String(msg.fromPetId ?? ""),
            receiverId: String(msg.toPetId ?? ""),
            timestamp: msg.timestamp || 0,
            read: false
          },
          lastMessageTime: msg.timestamp || 0,
          unreadCount: 0
        };
      });

    callback(conversations);
  };

  const sentQuery = query(
    collection(firestore, "messages"),
    where("fromPetId", "in", petIds),
    where("isDisabled", "==", false),
    orderBy("timestamp", "desc"),
    firestoreLimit(100)
  );

  const receivedQuery = query(
    collection(firestore, "messages"),
    where("toPetId", "in", petIds),
    where("isDisabled", "==", false),
    orderBy("timestamp", "desc"),
    firestoreLimit(100)
  );

  const unsub1 = onSnapshot(sentQuery, handleSnapshot, (error) => {
    console.error("Error fetching conversations (sent):", error);
    callback([]);
  });

  const unsub2 = onSnapshot(receivedQuery, handleSnapshot, (error) => {
    console.error("Error fetching conversations (received):", error);
    callback([]);
  });

  return () => {
    unsub1();
    unsub2();
  };
};
