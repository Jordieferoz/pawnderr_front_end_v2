import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MatchState {
  unseenMatchCount: number;
}

const initialState: MatchState = {
  unseenMatchCount: 0
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setUnseenMatchCount: (state, action: PayloadAction<number>) => {
      state.unseenMatchCount = action.payload;
    }
  }
});

export const { setUnseenMatchCount } = matchSlice.actions;
export default matchSlice.reducer;
