"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { deleteUserAccount } from "@/utils/api";
import { useState } from "react";
import { showToast } from "../Shared/ToastMessage";
import Modal from "../Shared/Modal";
import { DeleteAccountModal } from "../Modals";

const DeleteAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useAuth();

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const response = await deleteUserAccount();
      if (response.statusCode === 200 || response.statusCode === 201) {
        showToast({
          type: "success",
          message: "Your account has been deleted successfully."
        });
        setIsModalOpen(false);
        // Clear all user data and redirect to home
        await logout("/");
      } else {
        throw new Error(response.message || "Failed to delete account");
      }
    } catch (error: any) {
      console.error("Failed to delete account:", error);
      showToast({
        type: "error",
        message: error.message || "Failed to delete account. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-[0px_4px_16.4px_0px_#0000001A] p-8 md:rounded-[40px] rounded-lg mt-10 md:mt-0">
      <div className="flex flex-col items-center text-center gap-5 md:py-8">
        <h2 className="heading2_medium text-dark-grey">
          Delete your account permanently?
        </h2>

        <p className="body_medium text-[#FF4D4D] max-w-md">
          Warning: This action will permanently remove your profile, matches,
          and data. This cannot be undone.
        </p>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-8"
        >
          Yes, Delete My Account
        </Button>
      </div>

      <Modal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        content={
          <DeleteAccountModal
            onCancel={() => setIsModalOpen(false)}
            onConfirm={handleDeleteAccount}
            isLoading={isLoading}
          />
        }
      />
    </div>
  );
};

export default DeleteAccount;
