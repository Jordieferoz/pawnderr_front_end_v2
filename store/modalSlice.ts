import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isFilterModalOpen: boolean;
  isMessageActionModalOpen: boolean;
  actionData: {
    blocked_user_id: number;
    match_id?: number;
    name?: string;
  } | null;
  isReportModalOpen: boolean;
  isHangTightModalOpen: boolean;
  blockData: {
    blocked_user_id: number;
    match_id?: number;
    name?: string;
  } | null;
  isBlockModalOpen: boolean;
  isOutOfSwipesModalOpen: boolean;
  isNotificationModalOpen: boolean;
}

const initialState: ModalState = {
  isFilterModalOpen: false,
  isMessageActionModalOpen: false,
  actionData: null,
  isReportModalOpen: false,
  isBlockModalOpen: false,
  blockData: null,
  isHangTightModalOpen: false,
  isOutOfSwipesModalOpen: false,
  isNotificationModalOpen: false
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
    openMessageActionModal: (state, action: { payload: ModalState["actionData"] }) => {
      state.isMessageActionModalOpen = true;
      state.actionData = action.payload;
    },
    closeMessageActionModal: (state) => {
      state.isMessageActionModalOpen = false;
      state.actionData = null;
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
    openBlockModal: (state, action: { payload: ModalState["blockData"] }) => {
      state.isBlockModalOpen = true;
      state.blockData = action.payload;
    },
    closeBlockModal: (state) => {
      state.isBlockModalOpen = false;
    },
    openOutOfSwipesModal: (state) => {
      state.isOutOfSwipesModalOpen = true;
    },
    closeOutOfSwipesModal: (state) => {
      state.isOutOfSwipesModalOpen = false;
    },
    openNotificationModal: (state) => {
      state.isNotificationModalOpen = true;
    },
    closeNotificationModal: (state) => {
      state.isNotificationModalOpen = false;
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
  closeHangTightModal,
  openOutOfSwipesModal,
  closeOutOfSwipesModal,
  openNotificationModal,
  closeNotificationModal
} = modalSlice.actions;
export default modalSlice.reducer;
