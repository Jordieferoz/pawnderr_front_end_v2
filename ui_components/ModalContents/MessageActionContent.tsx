"use client";

import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { closeMessageActionModal, openBlockModal } from "@/store/modalSlice";
import { images } from "@/utils/images";

const MessageActionContent: FC = () => {
  const dispatch = useDispatch();
  const { actionData } = useSelector((state: RootState) => state.modal);

  // const handleOpenReportModal = () => {
  //   dispatch(closeMessageActionModal());
  //   dispatch(openReportModal());
  // };

  const handleOpenBlockModal = () => {
    dispatch(closeMessageActionModal());
    if (actionData) {
      dispatch(openBlockModal(actionData));
    }
  };
  return (
    <div className="w-full bg-white rounded-2xl p-4">
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
      {/* Report */}
      {/* Report */}
      {/* <div
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
      </div> */}

      {/* Divider */}
      <div className="w-full h-[1px] bg-gray-200 my-1"></div>

      <a
        href="mailto:support@pawnderr.com?subject=Report%20an%20Issue"
        className="flex items-center justify-between py-3 cursor-pointer"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <img src={images.alert.src} alt="alert" className="w-7 h-7" />
            <span className="text-dark-grey body_large_medium">Report</span>
          </div>
          <span className="text-gray-500 text-sm pl-10">
            Contact us through support@pawnderr.com
          </span>
        </div>

        <img
          src={images.chevronRightGrey.src}
          alt="arrow"
          className="w-7 h-7"
        />
      </a>
    </div>
  );
};

export default MessageActionContent;
