import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isFilterModalOpen: boolean;
  isMessageActionModalOpen: boolean;
  isReportModalOpen: boolean;
  isHangTightModalOpen: boolean;
  isBlockModalOpen: boolean;
}

const initialState: ModalState = {
  isFilterModalOpen: false,
  isMessageActionModalOpen: false,
  isReportModalOpen: false,
  isBlockModalOpen: false,
  isHangTightModalOpen: false
};

const modalSlice = createSlice({
  name: "modalUI",
  initialState,
  reducers: {
    openFilterModal: (state) => {
      state.isFilterModalOpen = true;
    },
    closeFilterModal: (state) => {
      state.isFilterModalOpen = false;
    },
    openMessageActionModal: (state) => {
      state.isMessageActionModalOpen = true;
    },
    closeMessageActionModal: (state) => {
      state.isMessageActionModalOpen = false;
    },
    openReportModal: (state) => {
      state.isReportModalOpen = true;
    },
    closeReportModal: (state) => {
      state.isReportModalOpen = false;
    },
    openHangTightModal: (state) => {
      state.isHangTightModalOpen = true;
    },
    closeHangTightModal: (state) => {
      state.isHangTightModalOpen = false;
    },
    openBlockModal: (state) => {
      state.isBlockModalOpen = true;
    },
    closeBlockModal: (state) => {
      state.isBlockModalOpen = false;
    }
  }
});

export const {
  openFilterModal,
  closeFilterModal,
  openMessageActionModal,
  closeMessageActionModal,
  openReportModal,
  closeReportModal,
  openBlockModal,
  closeBlockModal,
  openHangTightModal,
  closeHangTightModal
} = modalSlice.actions;
export default modalSlice.reducer;
