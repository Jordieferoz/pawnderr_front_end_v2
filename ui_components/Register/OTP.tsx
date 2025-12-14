"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RootState } from "@/store";
import { updateStepData } from "@/store/registrationSlice";
import { fetchPets } from "@/utils/api";
import { otpSchema, type OtpValues } from "@/utils/schemas/registrationSchema";

import { BackBtnRegister } from ".";

const OTP: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const registrationData = useSelector(
    (state: RootState) => state.registration,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  // Check if user is authenticated
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      setApiError("Session expired. Please start registration again.");
      setTimeout(() => router.push("/sign-up"), 2000);
    }
  }, [router]);

  const onSubmit = async (data: OtpValues) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      // Verify user is still authenticated
      // const token = sessionStorage.getItem("accessToken");
      // if (!token) {
      //   setApiError("Session expired. Please start registration again.");
      //   setTimeout(() => router.push("/sign-up"), 2000);
      //   return;
      // }

      try {
        const petsResponse = await fetchPets();

        if (petsResponse.statusCode === 200 && petsResponse.data) {
          // Store pets data for the pet profile creation step
          console.log(petsResponse, "petsResponse");
        }
      } catch (petsError) {
        console.error("Failed to fetch pets:", petsError);
        // Continue anyway - this is not critical for moving forward
      }

      // Update Redux state - user is now verified
      dispatch(
        updateStepData({
          otp: data.otp,
          isVerified: true,
          step: 3,
        }),
      );
    } catch (error: any) {
      console.error("OTP verification error:", error);

      if (error?.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error?.message) {
        setApiError(error.message);
      } else {
        setApiError("Failed to verify OTP. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // At the top of OTP component, add restoration logic
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    const userData = sessionStorage.getItem("userData");

    if (!token || !userData) {
      setApiError("Session expired. Please start registration again.");
      setTimeout(() => router.push("/sign-up"), 2000);
      return;
    }

    // Restore Redux state if empty (page refresh)
    if (!registrationData.userId) {
      const user = JSON.parse(userData);
      dispatch(
        updateStepData({
          email: user.email,
          userId: user.id,
          name: user.name,
          gender: user.gender,
          phoneNumber: user.phone,
          isVerified: user.isVerified,
          isActive: user.isActive,
          profileCompletion: user.profileCompletion,
          step: 2,
        }),
      );
    }
  }, [router, registrationData.userId, dispatch]);

  return (
    <div>
      <BackBtnRegister
        title="OTP Verification"
        desc="Enter the verification code we just sent on your Mobile Number."
      />

      <div className="mb-4 text-center md:px-30">
        <p className="text-sm text-gray-600">
          Code sent to{" "}
          <span className="font-semibold text-gray-900">
            {registrationData.phoneNumber}
          </span>
        </p>
      </div>

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg md:mx-30">
          <p className="text-sm text-red-600 text-center">{apiError}</p>
        </div>
      )}

      <form
        className="mb-7 flex flex-col gap-6 md:px-30"
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
                maxLength={4}
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

        <Button
          type="submit"
          className="mt-10"
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
            "Verify"
          )}
        </Button>
      </form>
    </div>
  );
};

export default OTP;
