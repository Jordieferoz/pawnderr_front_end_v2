import { z } from "zod";

// Step 1: User details schema (for registration)
export const userDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["male", "female", "other", ""], "Please select a gender")
  ),
  phoneNumber: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required")
});

// Personal info schema for edit profile (name, email, phone only)
export const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+?[0-9]+$/,
      "Phone number can only contain digits and a + at the start"
    )
    .refine(
      (val) => {
        // Remove + if present for length check
        const digitsOnly = val.replace(/^\+/, "");
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      },
      {
        message: "Phone number must be between 10 and 15 digits"
      }
    )
});

// Step 2: OTP schema
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Enter the 6 digit OTP")
    .regex(/^[0-9]{6}$/, "OTP must be 6 digits")
});

// Step 3: Pet profile schema with dynamic attributes
export const petProfileSchema = z.object({
  images: z
    .array(z.string())
    .min(1, "Upload at least 1 photo")
    .max(10, "You can upload up to 10 photos"),
  petName: z.string().min(1, "Pet's Name is required"),
  nicknames: z.string().max(100).optional(),
  petGender: z.enum(["male", "female"], { message: "Select pet gender" }),
  age: z.string().min(1, "Age is required"),
  breed: z.number({ message: "Please select a breed" }).optional(),
  // Dynamic attributes as Record<string, number[]>
  attributes: z.record(z.string(), z.array(z.number())).optional(),
  vaccinationStatus: z.string().optional(),
  funFact: z.string().max(200).optional(),
  barkography: z.string().max(300).optional()
});

// Pet profile schema for edit (without images validation since they're read-only)
export const petProfileEditSchema = z.object({
  images: z.array(z.string()).optional(), // Optional for edit
  petName: z.string().min(1, "Pet's Name is required"),
  nicknames: z.string().max(100).optional(),
  petGender: z.enum(["male", "female"], { message: "Select pet gender" }),
  age: z.string().min(1, "Age is required"),
  breed: z.number({ message: "Please select a breed" }).optional(),
  // Dynamic attributes as Record<string, number[]>
  attributes: z.record(z.string(), z.array(z.number())).optional(),
  vaccinationStatus: z.string().optional(),
  funFact: z.string().max(200).optional(),
  barkography: z.string().max(300).optional()
});

// Step 4: Matching preferences schema
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
      message: "Please select preferred breed"
    }),
  distanceRadius: z
    .enum(["5", "10", "20", "30-35"])
    .optional()
    .refine((val) => val !== undefined, {
      message: "Select a distance radius"
    }),
  personalityPreference: z
    .array(z.string())
    .min(1, "Select at least 1 personality preference")
});

export const step5Schema = z.object({
  about: z.string().min(10, "Write a bit more about you")
});

// Combined registration schema merging all steps
export const registrationSchema = userDetailsSchema
  .merge(otpSchema)
  .merge(petProfileSchema)
  .merge(matchingPetSchema)
  .merge(step5Schema);

// Export types for convenience
export type UserDetailsValues = z.infer<typeof userDetailsSchema>;
export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
export type PetProfileValues = z.infer<typeof petProfileSchema>;
export type PetProfileEditValues = z.infer<typeof petProfileEditSchema>;
export type PetMatchingProfileValues = z.infer<typeof matchingPetSchema>;
export type Step5Values = z.infer<typeof step5Schema>;
export type RegistrationValues = z.infer<typeof registrationSchema>;
