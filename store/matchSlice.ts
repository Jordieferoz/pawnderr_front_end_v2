import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUnseenMatchCount } from "@/utils/api";

interface MatchState {
  unseenMatchCount: number;
  whoLikesMeCount: number;
}

const initialState: MatchState = {
  unseenMatchCount: 0,
  whoLikesMeCount: 0
};

export const getMatchIndicators = createAsyncThunk(
  "match/getMatchIndicators",
  async (_, { dispatch }) => {
    try {
      const response = await fetchUnseenMatchCount(); // Returns data directly based on user edit

      // Assuming response has 'count' or similar structure.
      // If the user said "use only the count api", likely "unseenMatchCount" corresponds to "new_matches".
      // We'll map 'count' or 'new_matches' if present.
      // We will perform a safe check.

      const newMatches = response?.data?.new_matches || 0;
      const whoLikesMe = response?.data?.who_likes_me || 0;

      dispatch(
        setMatchIndicators({
          new_matches: newMatches,
          who_likes_me: whoLikesMe
        })
      );
    } catch (error) {
      console.error("Failed to fetch match indicators", error);
    }
  }
);

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setUnseenMatchCount: (state, action: PayloadAction<number>) => {
      state.unseenMatchCount = action.payload;
    },
    setMatchIndicators: (
      state,
      action: PayloadAction<{ new_matches: number; who_likes_me: number }>
    ) => {
      state.unseenMatchCount = action.payload.new_matches;
      state.whoLikesMeCount = action.payload.who_likes_me;
    },
    clearWhoLikesMeCount: (state) => {
      state.whoLikesMeCount = 0;
    }
  }
});

export const { setUnseenMatchCount, setMatchIndicators, clearWhoLikesMeCount } =
  matchSlice.actions;
export default matchSlice.reducer;
