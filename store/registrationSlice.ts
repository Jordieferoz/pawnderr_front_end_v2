// redux/registrationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RegistrationData {
  // Authentication data
  email?: string;
  password?: string;
  userId?: number;
  isVerified?: boolean;
  isActive?: boolean;
  profileCompletion?: number;

  // Step 1 - User Details
  name: string;
  gender: "male" | "female" | "other" | ""; // Changed to match schema
  phoneNumber: string;
  location: string;

  // Step 2 (OTP)
  otp?: string;

  // Step 3 - Pet profile
  images?: string[];
  petName: string;
  nicknames?: string;
  petGender: "male" | "female" | ""; // Changed to match schema
  age?: string;
  energyLevel?: string[];
  favoriteActivities?: string[];
  vaccinationStatus?: string;
  funFact?: string;
  barkography?: string;

  // Step 4 - Matching Pet
  interestedIn: string[];
  playDateVibe: string[];
  ageRange: [number, number];
  preferredBreeds: "exact_match" | "open_to_all" | undefined;
  distanceRadius: "5" | "10" | "20" | "30-35" | ""; // Match schema
  personalityPreference: string[];

  // Current step
  step: number;
}

const initialState: RegistrationData = {
  // Authentication data
  email: "",
  password: "",
  userId: undefined,
  isVerified: false,
  isActive: false,
  profileCompletion: 0,

  // Step 1
  name: "",
  gender: "", // Empty string is valid
  phoneNumber: "",
  location: "",

  // Step 2
  otp: "",

  // Step 3
  images: [],
  petName: "",
  nicknames: "",
  petGender: "", // Empty string is valid
  age: "",
  energyLevel: [],
  favoriteActivities: [],
  vaccinationStatus: "",
  funFact: "",
  barkography: "",

  // Step 4
  interestedIn: [],
  playDateVibe: [],
  ageRange: [0, 15],
  preferredBreeds: undefined,
  distanceRadius: "", // Empty string as default
  personalityPreference: [],

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
      action: PayloadAction<Partial<RegistrationData>>,
    ) => {
      Object.assign(state, action.payload);
    },
    resetRegistration: () => initialState,
  },
});

export const { setStep, updateStepData, resetRegistration } =
  registrationSlice.actions;
export default registrationSlice.reducer;
