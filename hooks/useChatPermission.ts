// hooks/useChatPermission.ts
import { useState, useEffect } from "react";
import { checkCanChat } from "@/utils/api";
import { petsStorage } from "@/utils/pets-storage";

interface UseChatPermissionReturn {
  canChat: boolean | null;
  isLoading: boolean;
  error: string | null;
  checkPermission: (toPetId: number) => Promise<void>;
}

/**
 * Hook to check if current user's pet can chat with another pet
 */
export const useChatPermission = (
  toPetId: number | null
): UseChatPermissionReturn => {
  const [canChat, setCanChat] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPermission = async (targetPetId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current user's first pet ID
      const fromPetId = petsStorage.getFirstPetId();

      if (!fromPetId) {
        setError("No pet found. Please register a pet first.");
        setCanChat(false);
        setIsLoading(false);
        return;
      }

      const response = await checkCanChat({
        from_pet_id: fromPetId,
        to_pet_id: targetPetId
      });

      // Assuming the API returns { can_chat: true/false } or similar
      const canChatResult =
        response.data?.canChat ??
        response.data?.data?.canChat ??
        response.data?.can_chat ??
        response.data?.data?.can_chat ??
        response.statusCode === 200;

      setCanChat(canChatResult);
    } catch (err: any) {
      console.error("Failed to check chat permission:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to check chat permission"
      );
      setCanChat(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (toPetId) {
      checkPermission(toPetId);
    } else {
      setCanChat(null);
      setError(null);
    }
  }, [toPetId]);

  return {
    canChat,
    isLoading,
    error,
    checkPermission
  };
};
