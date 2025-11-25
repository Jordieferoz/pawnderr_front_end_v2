"use client";

import { RootState } from "@/store";
import { closeBlockModal } from "@/store/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { BlockModalContent } from "../ModalContents";
import { Modal } from "../Shared";

const BlockModal = () => {
  const dispatch = useDispatch();

  return (
    <Modal
      open={useSelector((state: RootState) => state.modal.isBlockModalOpen)}
      setOpen={(val) => {
        if (!val) dispatch(closeBlockModal());
      }}
      content={<BlockModalContent />}
    />
  );
};

export default BlockModal;
