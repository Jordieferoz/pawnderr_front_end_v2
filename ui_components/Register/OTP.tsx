"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { setMetadata, updateStepData } from "@/store/registrationSlice";
import { fetchPetRegistrationData } from "@/utils/api";
import { otpSchema, type OtpValues } from "@/utils/schemas/registrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { BackBtnRegister } from ".";

const OTP: FC = () => {
  const dispatch = useDispatch();

  const registrationData = useSelector(
    (state: RootState) => state.registration
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: {
      otp: ""
    }
  });

  const onSubmit = async (data: OtpValues) => {
    console.log(data, "data");
    setApiError(null);
    setIsSubmitting(true);

    try {
      // Fetch registration metadata
      const resp = await fetchPetRegistrationData();
      console.log(resp, "resp");
      if (resp.statusCode === 200 && resp.data) {
        // Store metadata in Redux
        dispatch(setMetadata(resp.data.data));

        // Update Redux state - user is now verified
        dispatch(
          updateStepData({
            // otp: data.otp,
            isVerified: true,
            step: 3
          })
        );

        console.log("Registration metadata loaded successfully");
      }
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
