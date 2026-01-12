"use client";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { closeHangTightModal } from "@/store/modalSlice";

import { HangTightModalContent } from "../ModalContents";
import { Modal } from "../Shared";

const HangTightModal = () => {
  const dispatch = useDispatch();

  return (
    <Modal
      open={useSelector((state: RootState) => state.modal.isHangTightModalOpen)}
      setOpen={(val) => {
        if (!val) dispatch(closeHangTightModal());
      }}
      content={<HangTightModalContent />}
    />
  );
};

export default HangTightModal;
