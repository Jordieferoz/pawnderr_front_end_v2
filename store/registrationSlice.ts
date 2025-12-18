// store/registrationSlice.ts
import { RegistrationMetadata } from "@/ui_components/Register/types";
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
  gender: "male" | "female" | "other" | "";
  phoneNumber: string;
  location: string;

  // Step 2 (OTP)
  otp?: string;

  // Step 3 - Pet profile
  petId?: number; // ADD THIS - Pet ID from registration response
  images?: string[];
  temporaryPhotoIds?: string[];
  petName: string;
  nicknames?: string;
  petGender: "male" | "female" | "";
  age?: string;
  breed?: number;
  attributes?: Record<number, number[]>;
  vaccinationStatus?: string;
  funFact?: string;
  barkography?: string;

  // Step 4 - Matching Pet preferences (as preference_selections)
  preferenceSelections?: Record<number, number>; // { preferenceTypeId: optionId }
  minAge?: number;
  maxAge?: number;
  preferredBreedIds?: number[]; // Optional array of breed IDs

  // Registration metadata from API
  metadata?: RegistrationMetadata;

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
  gender: "",
  phoneNumber: "",
  location: "",

  // Step 2
  otp: "",

  // Step 3
  petId: undefined, // ADD THIS
  images: [],
  temporaryPhotoIds: [],
  petName: "",
  nicknames: "",
  petGender: "",
  age: "",
  breed: undefined,
  attributes: {},
  vaccinationStatus: "",
  funFact: "",
  barkography: "",

  // Step 4
  preferenceSelections: {}, // CHANGED
  minAge: 0, // CHANGED
  maxAge: 15, // CHANGED
  preferredBreedIds: [], // ADDED

  // Metadata
  metadata: undefined,

  step: 1
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
    setMetadata: (state, action: PayloadAction<RegistrationMetadata>) => {
      state.metadata = action.payload;
    },
    updateAttribute: (
      state,
      action: PayloadAction<{ attributeId: number; optionIds: number[] }>
    ) => {
      if (!state.attributes) {
        state.attributes = {};
      }
      state.attributes[action.payload.attributeId] = action.payload.optionIds;
    },
    // ADD THIS ACTION
    updatePreference: (
      state,
      action: PayloadAction<{ preferenceTypeId: number; optionId: number }>
    ) => {
      if (!state.preferenceSelections) {
        state.preferenceSelections = {};
      }
      state.preferenceSelections[action.payload.preferenceTypeId] =
        action.payload.optionId;
    },
    resetRegistration: () => initialState
  }
});

export const {
  setStep,
  updateStepData,
  setMetadata,
  updateAttribute,
  updatePreference, // ADD THIS EXPORT
  resetRegistration
} = registrationSlice.actions;
export default registrationSlice.reducer;
