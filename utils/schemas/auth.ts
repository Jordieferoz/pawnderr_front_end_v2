// utils/schemas/auth.ts

import { z } from "zod";

// Sign-in schema with phone number and password
export const signInSchema = z.object({
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
    ),
  password: z.string().min(8, { message: "Use at least 8 characters" })
});

// Sign-up schema: Uses email and password (separate from sign-in)
export const signUpSchema = z
  .object({
    email: z.string().email({ message: "Enter a valid email" }).trim(),
    password: z.string().min(8, { message: "Use at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Confirm your password" })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"]
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
