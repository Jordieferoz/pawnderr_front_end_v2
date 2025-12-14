"use client";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { closeReportModal } from "@/store/modalSlice";

import { ReportModalContent } from "../ModalContents";
import { Modal } from "../Shared";

const ReportModal = () => {
  const dispatch = useDispatch();

  return (
    <Modal
      open={useSelector((state: RootState) => state.modal.isReportModalOpen)}
      setOpen={(val) => {
        if (!val) dispatch(closeReportModal());
      }}
      content={<ReportModalContent />}
    />
  );
};

export default ReportModal;
