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
import { setUser } from "@/store/userSlice";
import { LoginOTPModal } from "@/ui_components/Modals";
import { InputField, Modal } from "@/ui_components/Shared";
import { loginWithPhone } from "@/utils/api";
import { signupStorage } from "@/utils/auth-storage";
import { images } from "@/utils/images";
import { zodResolver } from "@hookform/resolvers/zod";

type Mode = "signin" | "signup";

// Simple input sanitization - removes dangerous HTML/JS
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, "").trim();
};

// Sanitize phone number input - only allow digits and + at the start
const sanitizePhoneInput = (value: string): string => {
  // Remove all non-digit characters except + at the start
  let sanitized = value.replace(/[^\d+]/g, "");

  // Ensure + is only at the start
  if (sanitized.includes("+")) {
    const plusIndex = sanitized.indexOf("+");
    if (plusIndex > 0) {
      // Remove + if it's not at the start
      sanitized = sanitized.replace(/\+/g, "");
    } else if (plusIndex === 0 && sanitized.length > 1) {
      // Keep + at start, remove any other + signs
      sanitized = "+" + sanitized.slice(1).replace(/\+/g, "");
    }
  }

  return sanitized;
};

export function Login({ mode = "signin" }: { mode?: Mode }) {
  const dispatch = useDispatch();

  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignup = mode === "signup";
  const schema = isSignup ? signUpSchema : signInSchema;

  const [apiError, setApiError] = useState<string | null>(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpPhone, setOtpPhone] = useState<string>("");

  // Get error from URL if redirected from middleware
  useEffect(() => {
    const error = searchParams?.get("error");
    if (error === "CredentialsSignin") {
      setApiError("Invalid credentials. Please try again.");
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
    defaultValues: (isSignup
      ? { email: "", password: "", confirmPassword: "" }
      : { phone: "", password: "" }) as SignInValues | SignUpValues
  });

  const password = watch("password" as keyof (SignInValues | SignUpValues));
  const confirmPassword = isSignup
    ? watch("confirmPassword" as keyof SignUpValues)
    : undefined;

  const onSubmit = async (data: SignInValues | SignUpValues) => {
    setApiError(null);

    try {
      if (isSignup) {
        const signupData = data as SignUpValues;
        const sanitizedEmail = sanitizeInput(signupData.email);
        signupStorage.set(sanitizedEmail, signupData.password);
        router.push("/register");
      } else {
        // Sign in flow with phone number and password
        const signinData = data as SignInValues;
        const formattedPhone = signinData.phone?.startsWith("+")
          ? signinData.phone
          : `+91${signinData.phone}`;

        try {
          const response = await loginWithPhone({
            phone: formattedPhone,
            password: signinData.password
          });

          if (response.statusCode === 200 || response.statusCode === 201) {
            // Check if OTP verification is required
            const responseData = response.data?.data || response.data;
            if (
              responseData?.requires_verification === true ||
              responseData?.requiresVerification === true
            ) {
              // OTP verification required, open OTP modal
              setOtpPhone(formattedPhone);
              setShowOTPModal(true);
            } else if (responseData?.accessToken) {
              // Direct login successful, store tokens and complete login
              sessionStorage.setItem("accessToken", responseData.accessToken);
              sessionStorage.setItem(
                "refreshToken",
                responseData.refreshToken || ""
              );
              sessionStorage.setItem(
                "firebaseToken",
                responseData.firebaseToken || ""
              );

              if (responseData.id) {
                const userProfile = {
                  id: responseData.id,
                  email: responseData.email || "",
                  name: responseData.name || "",
                  phone: responseData.phone || "",
                  gender: responseData.gender || "",
                  isActive: responseData.is_active ?? false,
                  isVerified: responseData.is_verified ?? false,
                  profileCompletionPercentage:
                    responseData.profile_completion_percentage ?? 0
                };
                sessionStorage.setItem("userData", JSON.stringify(userProfile));
              }

              // Create NextAuth session
              const callbackUrl =
                searchParams?.get("callbackUrl") || "/dashboard";
              const result = await signIn("credentials", {
                accessToken: responseData.accessToken,
                firebaseToken: responseData.firebaseToken || "",
                redirect: false,
                callbackUrl
              });

              if (result?.ok) {
                await completeLoginFlow(callbackUrl);
              } else {
                setApiError("Failed to create session. Please try again.");
              }
            } else {
              // OTP required - open modal
              setOtpPhone(formattedPhone);
              setShowOTPModal(true);
            }
          } else {
            setApiError(
              response.data?.message || "Login failed. Please try again."
            );
          }
        } catch (error: any) {
          console.error("❌ Login error:", error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Login failed. Please try again.";
          setApiError(errorMessage);
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
            : "Invalid phone number. Please try again."
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

  // Helper function to complete login flow after OTP verification
  const completeLoginFlow = async (callbackUrl: string = "/dashboard") => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get session from NextAuth (now that we've signed in server-side)
    const { getSession } = await import("next-auth/react");
    const session = await getSession();

    if (session?.user) {
      // Set user in Redux store from NextAuth session
      dispatch(setUser(session.user as any));
    }

    if (!(session as any)?.accessToken) {
      console.error("❌ No accessToken in session!");
    }

    // Redirect to dashboard - ProfileLoader will fetch fresh data if needed
    router.push(callbackUrl);
    router.refresh();
  };

  // Handle OTP verification success
  const handleOTPVerified = async () => {
    setShowOTPModal(false);
    const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

    // After OTP verification, tokens are stored in sessionStorage by LoginOTPModal
    // Use NextAuth to create server-side session with the access token
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const firebaseToken = sessionStorage.getItem("firebaseToken");

      if (!accessToken) {
        setApiError("No access token found. Please try again.");
        return;
      }

      // Sign in with NextAuth using the access token to create server-side session
      const result = await signIn("credentials", {
        accessToken: accessToken,
        firebaseToken: firebaseToken || "",
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        console.error("❌ Sign in error after OTP:", result.error);
        setApiError("Failed to create session. Please try again.");
      } else if (result?.ok) {
        await completeLoginFlow(callbackUrl);
      }
    } catch (error: any) {
      console.error("❌ Error completing login after OTP:", error);
      setApiError("Failed to complete login. Please try again.");
    }
  };

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
                {isSignup ? "Or use your Email" : "Or use your Phone Number"}
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
            {isSignup ? (
              <>
                <div className="relative">
                  <Controller
                    control={control}
                    name={"email" as keyof SignUpValues}
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
                        aria-invalid={Boolean(
                          "email" in errors && errors.email
                        )}
                        aria-describedby={
                          "email" in errors && errors.email
                            ? "email-error"
                            : undefined
                        }
                      />
                    )}
                  />
                  {"email" in errors && errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-500">
                      {(errors.email as { message?: string })?.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Controller
                    control={control}
                    name={"password" as keyof SignUpValues}
                    render={({ field }) => (
                      <InputField
                        isPassword
                        label="Set Password"
                        placeholder="Create a password"
                        type="password"
                        {...field}
                        aria-invalid={Boolean(
                          "password" in errors && errors.password
                        )}
                        aria-describedby={
                          "password" in errors && errors.password
                            ? "password-error"
                            : undefined
                        }
                      />
                    )}
                  />
                  {"password" in errors && errors.password && (
                    <p
                      id="password-error"
                      className="mt-1 text-sm text-red-500"
                    >
                      {(errors.password as { message?: string })?.message}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <Controller
                    control={control}
                    name={"phone" as keyof SignInValues}
                    render={({ field }) => (
                      <InputField
                        label="Phone Number"
                        placeholder="+1234567890"
                        type="tel"
                        {...field}
                        onChange={(e) => {
                          const sanitized = sanitizePhoneInput(e.target.value);
                          field.onChange(sanitized);
                        }}
                        aria-invalid={Boolean(
                          "phone" in errors && (errors as any).phone
                        )}
                        aria-describedby={
                          "phone" in errors && (errors as any).phone
                            ? "phone-error"
                            : undefined
                        }
                      />
                    )}
                  />
                  {"phone" in errors && (errors as any).phone && (
                    <p id="phone-error" className="mt-1 text-sm text-red-500">
                      {(errors as any).phone?.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Controller
                    control={control}
                    name={"password" as keyof SignInValues}
                    render={({ field }) => (
                      <InputField
                        isPassword
                        label="Password"
                        placeholder="Password"
                        type="password"
                        {...field}
                        aria-invalid={Boolean(
                          "password" in errors && (errors as any).password
                        )}
                        aria-describedby={
                          "password" in errors && (errors as any).password
                            ? "password-error"
                            : undefined
                        }
                      />
                    )}
                  />
                  {"password" in errors && (errors as any).password && (
                    <p
                      id="password-error"
                      className="mt-1 text-sm text-red-500"
                    >
                      {(errors as any).password?.message}
                    </p>
                  )}
                </div>
              </>
            )}

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

      {/* OTP Verification Modal */}
      <Modal
        open={showOTPModal}
        setOpen={(val) => {
          if (!val) {
            setShowOTPModal(false);
            setOtpPhone("");
          }
        }}
        content={
          <LoginOTPModal
            phone={otpPhone}
            onOTPVerified={handleOTPVerified}
            onClose={() => {
              setShowOTPModal(false);
              setOtpPhone("");
            }}
          />
        }
        className="max-w-md"
      />
    </div>
  );
}
