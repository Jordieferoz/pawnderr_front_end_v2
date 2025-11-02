// redux/registrationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RegistrationData {
  // Step 1
  name: string;
  gender: string;
  phoneNumber: string;
  location: string;
  // Step 2 (OTP)
  otp?: string;
  // Step 3 - Pet profile
  images?: (File | string)[];
  petName: string;
  nicknames?: string;
  petGender: string;
  age?: string;
  energyLevel?: string;
  favoriteActivities?: string[];
  vaccinationStatus?: string;
  funFact?: string;
  barkography?: string;
  // Step 4 - Matching Pet
  interestedIn: string;
  step: number;
}

const initialState: RegistrationData = {
  name: "",
  gender: "",
  phoneNumber: "",
  location: "",
  otp: "",
  images: [],
  petName: "",
  nicknames: "",
  petGender: "",
  age: "",
  energyLevel: "",
  favoriteActivities: [],
  vaccinationStatus: "",
  funFact: "",
  barkography: "",
  interestedIn: "",
  step: 1,
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    updateStepData: (
      state,
      action: PayloadAction<Partial<RegistrationData>>
    ) => {
      Object.assign(state, action.payload);
    },
    resetRegistration: () => initialState,
  },
});

export const { setStep, updateStepData, resetRegistration } =
  registrationSlice.actions;
export default registrationSlice.reducer;
