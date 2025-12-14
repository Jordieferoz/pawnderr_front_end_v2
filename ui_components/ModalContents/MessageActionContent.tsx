"use client";

import { FC } from "react";
import { useDispatch } from "react-redux";

import {
  closeMessageActionModal,
  openBlockModal,
  openReportModal,
} from "@/store/modalSlice";
import { images } from "@/utils/images";

const MessageActionContent: FC = () => {
  const dispatch = useDispatch();

  const handleOpenReportModal = () => {
    dispatch(closeMessageActionModal());
    dispatch(openReportModal());
  };
  const handleOpenBlockModal = () => {
    dispatch(closeMessageActionModal());
    dispatch(openBlockModal());
  };
  return (
    <div className="w-full bg-white rounded-2xl p-4">
      {/* Report */}
      <div
        className="flex items-center justify-between py-3 cursor-pointer"
        onClick={handleOpenReportModal}
      >
        <div className="flex items-center gap-3">
          <img src={images.alert.src} alt="arrow" className="w-7 h-7" />
          <span className="text-dark-grey body_large_medium">Report</span>
        </div>

        <img
          src={images.chevronRightGrey.src}
          alt="arrow"
          className="w-7 h-7"
        />
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-gray-200 my-1"></div>

      {/* Block */}
      <div
        className="flex items-center justify-between py-3 cursor-pointer"
        onClick={handleOpenBlockModal}
      >
        <div className="flex items-center gap-3">
          <img src={images.block.src} alt="block" className="w-7 h-7" />
          <span className="text-dark-grey body_large_medium">Block</span>
        </div>

        <img
          src={images.chevronRightGrey.src}
          alt="arrow"
          className="w-7 h-7"
        />
      </div>
    </div>
  );
};

export default MessageActionContent;
