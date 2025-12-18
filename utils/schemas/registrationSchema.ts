// utils/schemas/registration.ts
import { z } from "zod";

// Step 1: User details schema
export const userDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["male", "female", "other", ""], "Please select a gender"),
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
    .min(5, "Upload at least 5 photos")
    .max(10, "You can upload up to 10 photos"),
  petName: z.string().min(1, "Pet's Name is required"),
  nicknames: z.string().max(100).optional(),
  petGender: z.enum(["male", "female"], { message: "Select pet gender" }),
  age: z.string().min(1, "Age is required"),
  breed: z.number({ message: "Select a breed" }),
  attributes: z.record(
    z.string(),
    z.array(z.number()).min(1, "This field is required"),
  ),
  vaccinationStatus: z.string().optional(),
  funFact: z.string().max(200).optional(),
  barkography: z.string().max(300).optional(),
});

// utils/schemas/registrationSchema.ts

export const matchingPetSchema = z.object({
  preferenceSelections: z
    .record(z.string(), z.number())
    .refine((data) => Object.keys(data).length >= 5, {
      message: "Please complete all preference selections",
    }),
  minAge: z.number().min(0).max(15),
  maxAge: z.number().min(0).max(15),
  preferredBreedIds: z.array(z.number()).optional(),
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
