// utils/schemas/registration.ts
import { z } from "zod";

// Step 1: User details schema
export const userDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["male", "female", "other", ""], "Please select a gender")
  ),
  phoneNumber: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
});

// Step 2: OTP schema
export const otpSchema = z.object({
  otp: z
    .string()
    .length(4, "Enter the 4 digit OTP")
    .regex(/^[0-9]{4}$/, "OTP must be 4 digits"),
});

// Step 3: Pet profile schema with detailed fields
export const petProfileSchema = z.object({
  images: z
    .array(z.any())
    .min(1, "Upload at least 1 photo")
    .max(6, "You can upload up to 6 photos"),
  petName: z.string().min(1, "Pet's Name is required"),
  nicknames: z.string().max(100).optional(),
  petGender: z.enum(["male", "female"], { message: "Select pet gender" }),
  age: z.string().min(1, "Age is required"),
  energyLevel: z.array(z.string()).min(1, "Select at least 1 energy level"),
  favoriteActivities: z
    .array(z.string())
    .min(3, "Select at least 3 activities"),
  vaccinationStatus: z.string().optional(),
  funFact: z.string().max(200).optional(),
  barkography: z.string().max(300).optional(),
});

// Example schemas for steps 4 and 5 (adjust if needed)
export const matchingPetSchema = z.object({
  interestedIn: z.array(z.string()).min(1, "Select at least 1 pet interest"),
  playDateVibe: z.array(z.string()).min(1, "Select at least 1 playdate vibe"),
  ageRange: z
    .tuple([z.number(), z.number()])
    .refine(([min, max]) => min <= max, { message: "Invalid age range" }),
  preferredBreeds: z
    .enum(["exact_match", "open_to_all"])
    .optional()
    .refine((val) => val !== undefined, {
      message: "Please select preferred breed",
    }),
  distanceRadius: z
    .enum(["5", "10", "20", "30-35"])
    .optional()
    .refine((val) => val !== undefined, {
      message: "Select a distance radius",
    }),
  personalityPreference: z
    .array(z.string())
    .min(1, "Select at least 1 personality preference"),
});

export const step5Schema = z.object({
  about: z.string().min(10, "Write a bit more about you"),
});

// Combined registration schema merging all steps
export const registrationSchema = userDetailsSchema
  .merge(otpSchema)
  .merge(petProfileSchema)
  .merge(matchingPetSchema)
  .merge(step5Schema);

// Export types for convenience
export type UserDetailsValues = z.infer<typeof userDetailsSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
export type PetProfileValues = z.infer<typeof petProfileSchema>;
export type PetMatchingProfileValues = z.infer<typeof matchingPetSchema>;
export type Step5Values = z.infer<typeof step5Schema>;
export type RegistrationValues = z.infer<typeof registrationSchema>;
