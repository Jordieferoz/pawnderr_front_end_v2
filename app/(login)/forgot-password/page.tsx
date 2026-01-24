"use client";

import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
  resetPasswordSchema,
  type ResetPasswordValues
} from "@/utils/schemas/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { InputField } from "@/ui_components/Shared";
import { showToast } from "@/ui_components/Shared/ToastMessage";
import { forgotPassword, resetPassword, resendOTP } from "@/utils/api";
import { images } from "@/utils/images";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";

// Sanitize phone input
const sanitizePhoneInput = (value: string): string => {
  let sanitized = value.replace(/[^\d+]/g, "");
  if (sanitized.includes("+")) {
    const plusIndex = sanitized.indexOf("+");
    if (plusIndex > 0) {
      sanitized = sanitized.replace(/\+/g, "");
    } else if (plusIndex === 0 && sanitized.length > 1) {
      sanitized = "+" + sanitized.slice(1).replace(/\+/g, "");
    }
  }
  return sanitized;
};

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1); // 1: Phone, 2: OTP & Reset
  const [resetPhone, setResetPhone] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Phone Form
  const {
    control: phoneControl,
    handleSubmit: handlePhoneSubmit,
    formState: {
      errors: phoneErrors,
      isValid: isPhoneValid,
      isSubmitting: isPhoneSubmitting
    }
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      phone: ""
    }
  });

  // Reset Form
  const {
    control: resetControl,
    handleSubmit: handleResetSubmit,
    formState: {
      errors: resetErrors,
      isValid: isResetValid,
      isSubmitting: isResetSubmitting
    }
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onPhoneSubmit = async (data: ForgotPasswordValues) => {
    try {
      const formattedPhone = data.phone.startsWith("+")
        ? data.phone
        : `+91${data.phone}`;

      await forgotPassword({ phone: formattedPhone });
      setResetPhone(formattedPhone); // Store formatted phone for next step

      showToast({
        type: "success",
        message: "OTP sent successfully"
      });

      setStep(2);
      setTimer(30);
      setCanResend(false);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      showToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to send OTP. Please check the number."
      });
    }
  };

  const onResetSubmit = async (data: ResetPasswordValues) => {
    try {
      await resetPassword({
        phone: resetPhone,
        otp: data.otp,
        newPassword: data.newPassword
      });

      showToast({
        type: "success",
        message: "Password reset successfully. Please login."
      });

      router.push("/sign-in");
    } catch (error: any) {
      console.error("Reset password error:", error);
      showToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to reset password. Please try again."
      });
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    try {
      await resendOTP({
        phone: resetPhone,
        purpose: "forgot_password"
      });
      setTimer(30);
      setCanResend(false);
      showToast({
        type: "success",
        message: "OTP resent successfully"
      });
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      showToast({
        type: "error",
        message: error?.response?.data?.message || "Failed to resend OTP."
      });
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
            className="logo w-[220px]"
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
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h1>
        <p className="heading4_medium text-neutral-white px-7 md:px-34 text-center mb-10">
          {step === 1
            ? "Enter your phone number to receive an OTP for resetting your password."
            : `Enter the OTP sent to ${resetPhone} and set your new password.`}
        </p>

        <div className="md:px-30">
          <img
            className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-1/2 md:hidden"
            src={images.authPattern.src}
            alt="Decorative pattern"
          />

          {step === 1 ? (
            <form
              onSubmit={handlePhoneSubmit(onPhoneSubmit)}
              className="flex flex-col gap-6"
              noValidate
            >
              <div className="relative">
                <Controller
                  control={phoneControl}
                  name="phone"
                  render={({ field }) => (
                    <InputField
                      label="Phone Number"
                      placeholder="+91..."
                      type="tel"
                      {...field}
                      onChange={(e) => {
                        const sanitized = sanitizePhoneInput(e.target.value);
                        field.onChange(sanitized);
                      }}
                      aria-invalid={Boolean(phoneErrors.phone)}
                      aria-describedby={
                        phoneErrors.phone ? "phone-error" : undefined
                      }
                    />
                  )}
                />
                {phoneErrors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-500">
                    {phoneErrors.phone.message}
                  </p>
                )}
              </div>

              <div className="fixed bottom-0 left-0 md:relative py-5 w-full bg-white shadow-[0px_-4px_12.8px_-3px_#00000012] md:shadow-none flex justify-center md:block">
                <div className="w-full flex items-center flex-col">
                  <Button
                    type="submit"
                    disabled={!isPhoneValid || isPhoneSubmitting}
                    className="w-[calc(100%-40px)] md:w-full mb-4"
                  >
                    {isPhoneSubmitting ? (
                      <span className="flex items-center gap-2">
                        Processing...
                      </span>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                  <div className="text-center">
                    <Link
                      href="/sign-in"
                      className="text-primary-theme paragraph1_bold"
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleResetSubmit(onResetSubmit)}
              className="flex flex-col gap-6"
              noValidate
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Enter OTP
                </label>
                <Controller
                  control={resetControl}
                  name="otp"
                  render={({ field }) => (
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <InputOTPGroup className="gap-5 w-full">
                        <InputOTPSlot
                          className="grow basis-0 h-[60px]"
                          index={0}
                        />
                        <InputOTPSlot
                          className="grow basis-0 h-[60px]"
                          index={1}
                        />
                        <InputOTPSlot
                          className="grow basis-0 h-[60px]"
                          index={2}
                        />
                        <InputOTPSlot
                          className="grow basis-0 h-[60px]"
                          index={3}
                        />
                        <InputOTPSlot
                          className="grow basis-0 h-[60px]"
                          index={4}
                        />
                        <InputOTPSlot
                          className="grow basis-0 h-[60px]"
                          index={5}
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                {resetErrors.otp && (
                  <p className="mt-1 text-sm text-red-500">
                    {resetErrors.otp.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Controller
                  control={resetControl}
                  name="newPassword"
                  render={({ field }) => (
                    <InputField
                      isPassword
                      label="New Password"
                      placeholder="Enter new password"
                      type="password"
                      {...field}
                      aria-invalid={Boolean(resetErrors.newPassword)}
                    />
                  )}
                />
                {resetErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {resetErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Controller
                  control={resetControl}
                  name="confirmPassword"
                  render={({ field }) => (
                    <InputField
                      isPassword
                      label="Confirm Password"
                      placeholder="Confirm new password"
                      type="password"
                      {...field}
                      aria-invalid={Boolean(resetErrors.confirmPassword)}
                    />
                  )}
                />
                {resetErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {resetErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-sm text-primary-theme hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-gray-500">Resend OTP in {timer}s</span>
                )}
              </div>

              <div className="fixed bottom-0 left-0 md:relative py-5 w-full bg-white shadow-[0px_-4px_12.8px_-3px_#00000012] md:shadow-none flex justify-center md:block">
                <Button
                  type="submit"
                  disabled={!isResetValid || isResetSubmitting}
                  className="w-[calc(100%-40px)] md:w-full"
                >
                  {isResetSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      <img
        src={images.loginBg.src}
        className="absolute -top-10 left-0 w-full z-10 pointer-events-none hidden md:block"
        alt=""
      />
    </div>
  );
}
