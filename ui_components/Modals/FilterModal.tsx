"use client";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { closeFilterModal } from "@/store/modalSlice";

import { FilterContent } from "../ModalContents";
import { Modal } from "../Shared";

const FilterModal = () => {
  const dispatch = useDispatch();

  return (
    <Modal
      open={useSelector((state: RootState) => state.modal.isFilterModalOpen)}
      setOpen={(val) => {
        if (!val) dispatch(closeFilterModal());
      }}
      content={<FilterContent />}
    />
  );
};

export default FilterModal;
