"use client";

import { RootState } from "@/store";
import { closeMessageActionModal } from "@/store/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { MessageActionContent } from "../ModalContents";
import { Modal } from "../Shared";

const MessageActionModal = () => {
  const dispatch = useDispatch();

  return (
    <Modal
      open={useSelector(
        (state: RootState) => state.modal.isMessageActionModalOpen
      )}
      setOpen={(val) => {
        if (!val) dispatch(closeMessageActionModal());
      }}
      content={<MessageActionContent />}
    />
  );
};

export default MessageActionModal;
