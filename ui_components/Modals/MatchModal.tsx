"use client";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { closeMatchModal } from "@/store/modalSlice";

import { MatchModalContent } from "../ModalContents";
import { Modal } from "../Shared";

const MatchModal = () => {
  const dispatch = useDispatch();
  const { isMatchModalOpen, matchModalData } = useSelector(
    (state: RootState) => state.modal
  );

  return (
    <Modal
      open={isMatchModalOpen}
      setOpen={(val) => {
        if (!val) dispatch(closeMatchModal());
      }}
      content={
        matchModalData ? (
          <MatchModalContent
            userImage={matchModalData.userImage}
            matchImage={matchModalData.matchImage}
            userGender={matchModalData.userGender}
            matchGender={matchModalData.matchGender}
            matchName={matchModalData.matchName}
            matchId={matchModalData.matchId}
            matchPetId={matchModalData.matchPetId}
            myPetId={matchModalData.myPetId}
          />
        ) : (
          <></>
        )
      }
    />
  );
};

export default MatchModal;
