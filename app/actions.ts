"use server";

import { signUpSchema } from "@/utils/schemas/auth";

// Define a result type for clarity and strictness
type SignUpResult = {
  errors?: Record<string, string[]>;
  success?: boolean;
};

export async function signUpAction(
  _prevState: unknown,
  formData: FormData
): Promise<SignUpResult> {
  // Convert FormData to an object of strings (all values will be string)
  const dataRaw = Object.fromEntries(formData);

  // Optionally: manually coerce types here if your Zod schema expects numbers or booleans
  // For string-only schemas, this step is not needed.

  // Validate via Zod schema
  const parsedResult = signUpSchema.safeParse(dataRaw);

  // If not valid, return per-field error messages
  if (!parsedResult.success) {
    const fieldErrors = parsedResult.error.flatten().fieldErrors;
    return { errors: fieldErrors };
  }

  // Success response for state-driven UI
  return { success: true };
}
