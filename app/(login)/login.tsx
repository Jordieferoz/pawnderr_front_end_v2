"use client";

import {
  signInSchema,
  type SignInValues,
  signUpSchema,
  type SignUpValues
} from "@/utils/schemas/auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { setUser } from "@/store/userSlice";
import { InputField } from "@/ui_components/Shared";
import { signupStorage } from "@/utils/auth-storage";
import { images } from "@/utils/images";
import { zodResolver } from "@hookform/resolvers/zod";

type Mode = "signin" | "signup";

// Simple input sanitization - removes dangerous HTML/JS
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, "").trim();
};

export function Login({ mode = "signin" }: { mode?: Mode }) {
  const dispatch = useDispatch();

  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignup = mode === "signup";
  const schema = isSignup ? signUpSchema : signInSchema;

  const [apiError, setApiError] = useState<string | null>(null);

  // Get error from URL if redirected from middleware
  useEffect(() => {
    const error = searchParams?.get("error");
    if (error === "CredentialsSignin") {
      setApiError("Invalid email or password. Please try again.");
    } else if (error) {
      setApiError("An error occurred. Please try again.");
    }
  }, [searchParams]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    trigger
  } = useForm<SignInValues | SignUpValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: isSignup
      ? { email: "", password: "", confirmPassword: "" }
      : { email: "", password: "", rememberMe: false }
  });

  const password = watch("password");
  const confirmPassword = isSignup
    ? watch("confirmPassword" as keyof SignUpValues)
    : undefined;

  const onSubmit = async (data: SignInValues | SignUpValues) => {
    setApiError(null);

    try {
      const sanitizedEmail = sanitizeInput(data.email);

      if (isSignup) {
        const signupData = data as SignUpValues;
        signupStorage.set(sanitizedEmail, signupData.password);
        router.push("/register");
      } else {
        // Sign in flow using NextAuth
        const signinData = data as SignInValues;
        const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

        const result = await signIn("credentials", {
          email: sanitizedEmail,
          password: signinData.password,
          redirect: false,
          callbackUrl
        });

        if (result?.error) {
          console.error("❌ Sign in error:", result.error);
          if (result.error === "CredentialsSignin") {
            setApiError("Invalid email or password. Please try again.");
          } else {
            setApiError(result.error);
          }
        } else if (result?.ok) {
          await new Promise((resolve) => setTimeout(resolve, 500));

          const { getSession } = await import("next-auth/react");
          const session = await getSession();

          if (session?.user) {
            dispatch(setUser(session.user as any));
          }

          if (!(session as any)?.accessToken) {
            console.error("❌ No accessToken in session!");
          }

          router.push(callbackUrl);
          router.refresh();
        }
      }
    } catch (error: any) {
      console.error("❌ Authentication error:", error);

      if (error?.message) {
        setApiError(error.message);
      } else {
        setApiError(
          isSignup
            ? "Failed to proceed. Please try again."
            : "Invalid email or password. Please try again."
        );
      }
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("Google sign in error:", error);
      setApiError("Failed to sign in with Google. Please try again.");
    }
  };

  useEffect(() => {
    if (isSignup && confirmPassword) {
      void trigger("confirmPassword" as keyof SignUpValues);
    }
  }, [password, isSignup, confirmPassword, trigger]);

  return (
    <div className="relative min-h-[100dvh] px-5 py-6 md:px-8">
      <div className="container">
        <Link
          href={"/"}
          className="mb-7.5 md:inline-flex justify-start hidden relative z-20"
        >
          <Image
            src={images.logoHorizontal.src}
            className="logo w-[240px]"
            width={147}
            height={97}
            alt="PAWnderr Logo"
          />
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-[766px] md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] rounded-4xl md:px-20 md:py-7 relative z-20">
        <Link
          href={"/"}
          className="mb-7.5 inline-flex justify-center md:hidden"
        >
          <Image
            src={images.logoHorizontal.src}
            className="logo h-13"
            width={212}
            height={52}
            alt="PAWnderr Logo"
          />
        </Link>
        <h1 className="display3 text-accent-900 mb-3 px-6 md:px-18 text-center">
          {isSignup ? "Create Your PAWnderr Profile" : "Welcome Back"}
        </h1>
        <p
          className={`body_regular text-light-grey2 px-7 md:px-34 text-center mb-10`}
        >
          {isSignup
            ? "Because every connection starts with a simple hello."
            : "Your dog's next meaningful connection could be just a few clicks away.."}
        </p>
        <div className="md:px-30">
          <img
            className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-1/2 md:hidden"
            src={images.authPattern.src}
            alt="Decorative pattern"
          />

          <div className="mb-10 flex items-center justify-center gap-5">
            <button
              type="button"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleGoogleSignIn}
            >
              <Image
                src={images.google.src}
                width={70}
                height={70}
                alt="Sign in with Google"
              />
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-white"></div>
            </div>
            <div className="relative flex justify-center">
              <p className="bg-white px-4 text-grey-500 body_medium text-center uppercase">
                Or use your Email
              </p>
            </div>
          </div>

          {/* API Error Display */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{apiError}</p>
            </div>
          )}

          <form
            className="mb-7 flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="relative">
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <InputField
                    label="Email Address"
                    placeholder="Email"
                    type="email"
                    {...field}
                    onChange={(e) => {
                      const sanitized = sanitizeInput(e.target.value);
                      field.onChange(sanitized);
                    }}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                )}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <InputField
                    isPassword
                    label={isSignup ? "Set Password" : "Password"}
                    placeholder={isSignup ? "Create a password" : "Password"}
                    type="password"
                    {...field}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />
                )}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {isSignup && (
              <div className="relative">
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <InputField
                      isPassword
                      label="Confirm Password"
                      placeholder="Re-enter password"
                      type="password"
                      {...field}
                      aria-invalid={Boolean(
                        "confirmPassword" in errors && errors.confirmPassword
                      )}
                      aria-describedby={
                        "confirmPassword" in errors && errors.confirmPassword
                          ? "confirm-error"
                          : undefined
                      }
                    />
                  )}
                />
                {"confirmPassword" in errors && errors.confirmPassword && (
                  <p id="confirm-error" className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            {!isSignup && (
              <div className="flex items-center justify-between px-1 mb-2">
                <div className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name="rememberMe"
                    render={({ field }) => (
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        id="rememberMe"
                      />
                    )}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="body_medium text-dark-grey cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="button2 text-accent-900 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            )}
            <div className="fixed bottom-0 md:relative py-5 md:pb-0 w-full bg-white shadow-[0px_-4px_12.8px_-3px_#00000012] md:shadow-none">
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                suppressHydrationWarning
                className="w-[calc(100%-40px)] md:w-full mb-4"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isSignup ? "Signing Up..." : "Signing In..."}
                  </span>
                ) : (
                  <>{isSignup ? "Sign Up" : "Sign In"}</>
                )}
              </Button>
              <div className="text-center">
                <p className="paragraph1_bold text-accent-1000">
                  {isSignup ? "Already have an account?" : " New to PAWnderr?"}{" "}
                  <Link
                    href={isSignup ? "/sign-in" : "/sign-up"}
                    className="text-primary-theme"
                  >
                    {isSignup ? "Sign In" : "Create an Account"}
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      <img
        src={isSignup ? images.loginBg.src : images.signupBg.src}
        className="absolute -top-10 left-0 w-full z-10 pointer-events-none hidden md:block"
        alt=""
      />
    </div>
  );
}
