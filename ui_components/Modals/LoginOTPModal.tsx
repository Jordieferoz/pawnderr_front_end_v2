"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { resendOTP, verifyOTP } from "@/utils/api";
import { otpSchema, type OtpValues } from "@/utils/schemas/registrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { showToast } from "../Shared/ToastMessage";

interface LoginOTPModalProps {
  phone: string;
  onOTPVerified: () => void;
  onClose: () => void;
}

const LoginOTPModal = ({
  phone,
  onOTPVerified,
  onClose
}: LoginOTPModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: {
      otp: ""
    }
  });

  const handleResendOTP = async () => {
    setIsResending(true);
    setApiError(null);
    try {
      const formattedPhone = phone?.startsWith("+") ? phone : `+91${phone}`;
      await resendOTP({ phone: formattedPhone });
      showToast({
        type: "success",
        message: "OTP resent successfully!"
      });
      reset({ otp: "" });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend OTP. Please try again.";
      setApiError(errorMessage);
      showToast({
        type: "error",
        message: errorMessage
      });
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: OtpValues) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      const formattedPhone = phone?.startsWith("+") ? phone : `+91${phone}`;

      const verifyResponse = await verifyOTP({
        phone: formattedPhone,
        otp: data.otp
      });

      if (
        verifyResponse.statusCode === 200 ||
        verifyResponse.statusCode === 201
      ) {
        const userData = verifyResponse.data?.data;

        // If tokens are returned, store them
        if (userData?.accessToken && userData?.refreshToken) {
          sessionStorage.setItem("accessToken", userData.accessToken);
          sessionStorage.setItem("refreshToken", userData.refreshToken);

          const userProfile = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            gender: userData.gender,
            isActive: userData.is_active,
            isVerified: userData.is_verified,
            profileCompletionPercentage: userData.profile_completion_percentage
          };

          sessionStorage.setItem("userData", JSON.stringify(userProfile));
        }

        showToast({
          type: "success",
          message: "OTP verified successfully!"
        });

        // Call the callback to handle post-verification (like completing login)
        // This will handle either using the tokens from OTP response or calling login again
        onOTPVerified();
      } else {
        throw new Error(
          verifyResponse.data?.message || "OTP verification failed"
        );
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);

      let errorMessage = "Failed to verify OTP. Please try again.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setApiError(errorMessage);
      showToast({
        type: "error",
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayPhone = phone?.startsWith("+") ? phone : `+91${phone}`;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Verify Your Phone Number
        </h2>
        <p className="text-sm text-gray-600">
          Enter the verification code we sent to{" "}
          <span className="font-semibold text-gray-900">{displayPhone}</span>
        </p>
      </div>

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 text-center">{apiError}</p>
        </div>
      )}

      <form
        className="mb-6 flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="relative">
          <Controller
            control={control}
            name="otp"
            render={({ field }) => (
              <InputOTP
                {...field}
                maxLength={6}
                inputMode="numeric"
                autoFocus
                value={field.value || ""}
                onChange={(value: string) => field.onChange(value)}
                disabled={isSubmitting}
              >
                <InputOTPGroup className="gap-5 w-full">
                  <InputOTPSlot className="grow basis-0 h-[60px]" index={0} />
                  <InputOTPSlot className="grow basis-0 h-[60px]" index={1} />
                  <InputOTPSlot className="grow basis-0 h-[60px]" index={2} />
                  <InputOTPSlot className="grow basis-0 h-[60px]" index={3} />
                  <InputOTPSlot className="grow basis-0 h-[60px]" index={4} />
                  <InputOTPSlot className="grow basis-0 h-[60px]" index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.otp && (
            <p id="otp-error" className="mt-1 text-sm text-red-500">
              {errors.otp.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isSubmitting}
            suppressHydrationWarning
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
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-sm text-primary-theme hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginOTPModal;
