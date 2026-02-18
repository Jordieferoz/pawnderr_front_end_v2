import { fetchSubscriptionStatus } from "@/utils/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionState {
  subscriptionStatus: string | null;
  isSubscribed: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  subscriptionStatus: null,
  isSubscribed: false,
  loading: false,
  error: null
};

export const getSubscriptionStatus = createAsyncThunk(
  "subscription/getStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchSubscriptionStatus();
      const isPremium = Boolean(response?.data?.is_premium);
      return isPremium;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch subscription status"
      );
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscriptionStatus: (state, action: PayloadAction<string | null>) => {
      // Deprecated, but keeping for backward compatibility if needed temporarily
      state.subscriptionStatus = action.payload;
    },
    setIsSubscribed: (state, action: PayloadAction<boolean>) => {
      state.isSubscribed = action.payload;
      state.subscriptionStatus = action.payload ? "active" : "inactive";
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubscriptionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isSubscribed = action.payload;
        // Keep subscriptionStatus in sync for now if needed, but the goal is to use isSubscribed
        state.subscriptionStatus = action.payload ? "active" : "inactive";
      })
      .addCase(getSubscriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setSubscriptionStatus, setIsSubscribed, setLoading, setError } =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;
