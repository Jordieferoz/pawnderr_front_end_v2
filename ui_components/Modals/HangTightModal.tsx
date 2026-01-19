"use client";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { closeHangTightModal } from "@/store/modalSlice";

import { HangTightModalContent } from "../ModalContents";
import { Modal } from "../Shared";

const HangTightModal = () => {
  const dispatch = useDispatch();
  const { isHangTightModalOpen, hangTightData } = useSelector(
    (state: RootState) => state.modal
  );

  return (
    <Modal
      open={isHangTightModalOpen}
      setOpen={(val) => {
        if (!val) dispatch(closeHangTightModal());
      }}
      content={
        <HangTightModalContent
          userImage={hangTightData?.userImage || ""}
          matchImage={hangTightData?.matchImage || ""}
          userGender={hangTightData?.userGender || "male"}
          matchGender={hangTightData?.matchGender || "female"}
        />
      }
    />
  );
};

export default HangTightModal;
