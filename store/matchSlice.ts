import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUnseenMatchCount } from "@/utils/api";

interface MatchState {
  unseenMatchCount: number;
  // Number of "who likes me" entries the user has NOT yet acknowledged.
  // Drives the Activities notification dot (shown when > 0).
  whoLikesMeCount: number;
  // Latest raw total reported by the backend.
  whoLikesMeTotal: number;
  // The backend total the user has already acknowledged by viewing Activities.
  // The dot only reappears once the total climbs above this baseline.
  whoLikesMeAcknowledged: number;
  unreadMessageCount: number;
}

// The backend has no endpoint to mark "who likes me" as seen (the count is
// derived live from swipes). To keep the Activities dot from re-appearing after
// a page reload, we persist the acknowledged baseline in localStorage.
const ACK_STORAGE_KEY = "whoLikesMeAcknowledged";

const readAcknowledged = (): number => {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(ACK_STORAGE_KEY);
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
};

const writeAcknowledged = (value: number) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACK_STORAGE_KEY, String(Math.max(value, 0)));
  } catch {
    // Ignore storage failures (e.g. private mode); the dot will still work
    // within the current session via in-memory state.
  }
};

const initialState: MatchState = {
  unseenMatchCount: 0,
  whoLikesMeCount: 0,
  whoLikesMeTotal: 0,
  whoLikesMeAcknowledged: readAcknowledged(),
  unreadMessageCount: 0
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
      state.unseenMatchCount = Math.max(action.payload, 0);
    },
    decrementUnseenMatchCount: (state, action: PayloadAction<number>) => {
      const amount = action.payload ?? 1;
      state.unseenMatchCount = Math.max(state.unseenMatchCount - amount, 0);
    },
    setMatchIndicators: (
      state,
      action: PayloadAction<{ new_matches: number; who_likes_me: number }>
    ) => {
      state.unseenMatchCount = action.payload.new_matches;

      const total = Math.max(action.payload.who_likes_me, 0);
      state.whoLikesMeTotal = total;
      // If the backend total dropped below the acknowledged baseline (e.g. a
      // liker matched or was rejected), lower the baseline so future new likes
      // are still detected correctly.
      if (total < state.whoLikesMeAcknowledged) {
        state.whoLikesMeAcknowledged = total;
        writeAcknowledged(total);
      }
      // Only count likes that arrived after the user last viewed Activities.
      state.whoLikesMeCount = Math.max(total - state.whoLikesMeAcknowledged, 0);
    },
    clearWhoLikesMeCount: (state) => {
      // Viewing Activities acknowledges every like currently known, hiding the
      // dot until a genuinely new like pushes the total higher. Persisted so a
      // page reload doesn't resurrect the dot for already-seen likes.
      state.whoLikesMeAcknowledged = state.whoLikesMeTotal;
      state.whoLikesMeCount = 0;
      writeAcknowledged(state.whoLikesMeTotal);
    },
    setUnreadMessageCount: (state, action: PayloadAction<number>) => {
      state.unreadMessageCount = action.payload;
    }
  }
});

export const {
  setUnseenMatchCount,
  decrementUnseenMatchCount,
  setMatchIndicators,
  clearWhoLikesMeCount,
  setUnreadMessageCount
} = matchSlice.actions;
export default matchSlice.reducer;
