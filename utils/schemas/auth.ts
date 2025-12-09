// utils/schemas/auth.ts

import { z } from "zod";

// Sign-in schema with rememberMe
export const signInSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }).trim(),
  password: z.string().min(8, { message: "Use at least 8 characters" }),
  rememberMe: z.boolean().optional(), // Checkbox can be optional
});

// Sign-up schema: Extends sign-in requirements
export const signUpSchema = signInSchema
  .extend({
    confirmPassword: z.string().min(8, { message: "Confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
