// utils/firebase-chat.ts
import {
  ref,
  push,
  onValue,
  off,
  query,
  orderByChild,
  limitToLast,
  serverTimestamp,
  set,
  update,
  get,
  child
} from "firebase/database";
import { getFirebaseDatabase, getFirebaseAuth } from "@/lib/firebase";

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
  participants: string[]; // Array of user IDs
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
  senderId: string,
  receiverId: string,
  text: string,
  type: "text" | "image" | "file" = "text",
  imageUrl?: string
): Promise<void> => {
  const database = getFirebaseDatabase();
  if (!database) {
    throw new Error("Firebase database is not available");
  }

  const messagesRef = ref(database, `chats/${chatId}/messages`);
  const newMessageRef = push(messagesRef);

  const message: Omit<ChatMessage, "id"> = {
    text,
    senderId,
    receiverId,
    timestamp: Date.now(),
    read: false,
    type,
    ...(imageUrl && { imageUrl })
  };

  await set(newMessageRef, message);

  // Update conversation metadata
  const conversationRef = ref(database, `chats/${chatId}`);
  await update(conversationRef, {
    lastMessage: message.text,
    lastMessageTime: message.timestamp,
    lastSenderId: senderId,
    [`unreadCount_${receiverId}`]: (await get(child(conversationRef, `unreadCount_${receiverId}`))).val() || 0 + 1
  });
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (
  chatId: string,
  userId: string
): Promise<void> => {
  const database = getFirebaseDatabase();
  if (!database) {
    throw new Error("Firebase database is not available");
  }

  const messagesRef = ref(database, `chats/${chatId}/messages`);
  const snapshot = await get(messagesRef);

  if (snapshot.exists()) {
    const updates: Record<string, any> = {};
    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val();
      if (message.receiverId === userId && !message.read) {
        updates[`${childSnapshot.key}/read`] = true;
      }
    });

    if (Object.keys(updates).length > 0) {
      await update(messagesRef, updates);
    }

    // Reset unread count
    const conversationRef = ref(database, `chats/${chatId}`);
    await update(conversationRef, {
      [`unreadCount_${userId}`]: 0
    });
  }
};

/**
 * Listen to messages in a chat
 */
export const subscribeToMessages = (
  chatId: string,
  callback: (messages: ChatMessage[]) => void,
  limit: number = 50
): (() => void) => {
  const database = getFirebaseDatabase();
  if (!database) {
    console.error("Firebase database is not available");
    return () => {};
  }

  const messagesRef = ref(database, `chats/${chatId}/messages`);
  const messagesQuery = query(
    messagesRef,
    orderByChild("timestamp"),
    limitToLast(limit)
  );

  const unsubscribe = onValue(
    messagesQuery,
    (snapshot) => {
      if (snapshot.exists()) {
        const messages: ChatMessage[] = [];
        snapshot.forEach((childSnapshot) => {
          messages.push({
            id: childSnapshot.key!,
            ...childSnapshot.val()
          });
        });
        // Sort by timestamp (oldest first)
        messages.sort((a, b) => a.timestamp - b.timestamp);
        callback(messages);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.error("Error listening to messages:", error);
      callback([]);
    }
  );

  return () => {
    off(messagesRef);
    unsubscribe();
  };
};

/**
 * Get user's conversations
 */
export const getUserConversations = (
  userId: string,
  callback: (conversations: ChatConversation[]) => void
): (() => void) => {
  const database = getFirebaseDatabase();
  if (!database) {
    console.error("Firebase database is not available");
    return () => {};
  }

  const conversationsRef = ref(database, "chats");
  const unsubscribe = onValue(
    conversationsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const conversations: ChatConversation[] = [];
        snapshot.forEach((chatSnapshot) => {
          const chatData = chatSnapshot.val();
          const chatId = chatSnapshot.key!;
          const participants = chatId.split("_");

          // Only include conversations where user is a participant
          if (participants.includes(userId)) {
            // Get last message
            const messages = chatData.messages || {};
            const messageKeys = Object.keys(messages);
            let lastMessage: ChatMessage | undefined;
            let lastMessageTime = 0;

            if (messageKeys.length > 0) {
              const lastMessageKey = messageKeys[messageKeys.length - 1];
              const lastMsg = messages[lastMessageKey];
              lastMessage = {
                id: lastMessageKey,
                ...lastMsg
              };
              lastMessageTime = lastMsg.timestamp || 0;
            }

            conversations.push({
              chatId,
              participants,
              lastMessage,
              lastMessageTime,
              unreadCount: chatData[`unreadCount_${userId}`] || 0
            });
          }
        });

        // Sort by last message time (newest first)
        conversations.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
        callback(conversations);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.error("Error fetching conversations:", error);
      callback([]);
    }
  );

  return () => {
    off(conversationsRef);
    unsubscribe();
  };
};
