"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";

interface DeleteAccountModalProps {
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const DeleteAccountModal: FC<DeleteAccountModalProps> = ({
  onCancel,
  onConfirm,
  isLoading
}) => {
  return (
    <div className="flex flex-col items-center text-center gap-5 md:py-6 py-4 px-4">
      <h2 className="heading2_medium text-dark-grey">
        Are you sure you want to delete the account?
      </h2>

      <p className="body_medium text-[#FF4D4D] max-w-md">
        This action is irreversible and you will lose all your matches,
        messages, and profile data.
      </p>

      <div className="flex flex-col md:flex-row w-full gap-4 mt-4 justify-center">
        <Button
          onClick={onCancel}
          disabled={isLoading}
          className="w-full md:w-auto px-8 bg-transparent text-dark-grey border border-dark-grey hover:bg-gray-100 shadow-none"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full md:w-auto px-8 bg-[#FF4D4D] text-white hover:bg-[#ff3333] border-none shadow-none"
        >
          {isLoading ? "Deleting..." : "Yes, Delete Account"}
        </Button>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
