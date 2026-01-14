"use client";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { closeHangTightModal } from "@/store/modalSlice";

import { OutOfSwipesContent } from "../ModalContents";
import { Modal } from "../Shared";

const OutOfSwipesModal = () => {
  const dispatch = useDispatch();

  return (
    <Modal
      open={useSelector(
        (state: RootState) => state.modal.isOutOfSwipesModalOpen
      )}
      setOpen={(val) => {
        if (!val) dispatch(closeHangTightModal());
      }}
      content={<OutOfSwipesContent />}
    />
  );
};

export default OutOfSwipesModal;
