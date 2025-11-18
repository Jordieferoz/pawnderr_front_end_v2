import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isFilterModalOpen: boolean;
}

const initialState: ModalState = {
  isFilterModalOpen: false,
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
  },
});

export const { openFilterModal, closeFilterModal } = modalSlice.actions;
export default modalSlice.reducer;
