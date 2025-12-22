// store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserData {
  id: number;
  email: string;
  name: string;
  phone: string;
  gender: string;
  isActive: boolean;
  isVerified: boolean;
  profileCompletionPercentage: number;
  lastLoginAt: string;
  loginCount: number;
}

interface UserState {
  user: UserData | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
