import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email' }).trim(),
  password: z.string().min(8, { message: 'Use at least 8 characters' }),
});

export const signUpSchema = signInSchema
  .extend({
    confirmPassword: z.string().min(8, { message: 'Confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
