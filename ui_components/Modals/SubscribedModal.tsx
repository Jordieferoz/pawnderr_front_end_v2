"use client";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { closeSubscribedModal } from "@/store/modalSlice";

import { SubscribedModalContent } from "../ModalContents";
import { Modal } from "../Shared";

interface SubscribedModalProps {
  primaryImage?: string;
  gender?: string;
}

const SubscribedModal = ({ primaryImage, gender }: SubscribedModalProps) => {
  const dispatch = useDispatch();

  return (
    <Modal
      open={useSelector(
        (state: RootState) => state.modal.isSubscribedModalOpen
      )}
      setOpen={(val) => {
        if (!val) dispatch(closeSubscribedModal());
      }}
      content={
        <SubscribedModalContent primaryImage={primaryImage} gender={gender} />
      }
    />
  );
};

export default SubscribedModal;
