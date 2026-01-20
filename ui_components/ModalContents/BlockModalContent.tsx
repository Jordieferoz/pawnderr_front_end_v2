import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RootState } from "@/store";
import { closeBlockModal, closeMessageActionModal } from "@/store/modalSlice";
import { showToast } from "@/ui_components/Shared/ToastMessage";
import { blockMatch } from "@/utils/api";
import { blockChat } from "@/utils/firebase-chat";

const BlockModalContent: FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  // Note: Assuming 'modal' is the correct slice name based on file view
  const blockData = useSelector((state: RootState) => state.modal.blockData);
  const [isLoading, setIsLoading] = useState(false);

  const handleBlock = async () => {
    if (!blockData?.blocked_user_id) {
      showToast({ type: "error", message: "User data missing." });
      return;
    }

    setIsLoading(true);
    try {
      await blockMatch({
        blocked_user_id: blockData.blocked_user_id,
        match_id: blockData.match_id
      });
      showToast({ type: "error", message: "User blocked successfully" });

      if (blockData.chatId && blockData.myPetId) {
        await blockChat(blockData.chatId, blockData.myPetId);
      }

      dispatch(closeBlockModal());
      dispatch(closeMessageActionModal());
      router.push("/messages");
    } catch (error: any) {
      showToast({
        type: "error",
        message: error?.message || "Failed to block user."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl px-4 py-6 text-center">
      <h5 className="mb-2.5 display4_medium text-accent-900">Block Match</h5>

      <p className="body_large_medium text-dark-brown mb-8.5">
        Are you sure you want to block {blockData?.name || "this user"}?
      </p>

      <RadioGroup className="mt-6 flex flex-col items-center">
        <label
          htmlFor="report-before-block"
          className="flex items-center justify-between gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <RadioGroupItem
            value="report-before-block"
            id="report-before-block"
          />
          <span className="text-light-grey2 heading4">
            I want to report this user before blocking.
          </span>
        </label>
      </RadioGroup>

      <div className="mt-11">
        <Button className="w-full" onClick={handleBlock} disabled={isLoading}>
          {isLoading ? "Blocking..." : "Block"}
        </Button>
      </div>
    </div>
  );
};

export default BlockModalContent;
