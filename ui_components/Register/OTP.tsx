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
import { fetchPetRegistrationData, verifyOTP } from "@/utils/api";
import { otpSchema, type OtpValues } from "@/utils/schemas/registrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { BackBtnRegister } from ".";
import { showToast } from "../Shared/ToastMessage";

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
    setApiError(null);
    setIsSubmitting(true);

    try {
      // Format phone number with +91 if not already present
      const formattedPhone = registrationData.phoneNumber?.startsWith("+")
        ? registrationData.phoneNumber
        : `+91${registrationData.phoneNumber}`;

      // Step 1: Verify OTP
      const verifyResponse = await verifyOTP({
        phone: formattedPhone,
        otp: data.otp
      });

      if (
        verifyResponse.statusCode === 200 ||
        verifyResponse.statusCode === 201
      ) {
        const userData = verifyResponse.data?.data;
        console.log(userData, "userData");
        if (userData?.accessToken && userData?.refreshToken) {
          // Store tokens
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
            profileCompletion: userData.profile_completion_percentage
          };

          sessionStorage.setItem("userData", JSON.stringify(userProfile));

          showToast({
            type: "success",
            message: "OTP verified successfully!"
          });

          // Step 2: Fetch registration metadata after successful OTP verification
          const metadataResponse = await fetchPetRegistrationData();
          console.log(metadataResponse, "metadataResponse");
          if (metadataResponse.statusCode === 200 && metadataResponse.data) {
            // Store metadata in Redux
            dispatch(setMetadata(metadataResponse.data.data));

            // Update Redux state - user is now verified
            dispatch(
              updateStepData({
                isVerified: true,
                step: 3
              })
            );
          }
        } else {
          throw new Error("Failed to fetch registration data");
        }
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
            +91{registrationData.phoneNumber}
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
        <div className="fixed bottom-0 md:relative py-5 w-full bg-white shadow-[0px_-4px_12.8px_-3px_#00000012] md:shadow-none">
          <Button
            type="submit"
            className="w-[calc(100%-40px)] md:w-full mb-4"
            disabled={!isValid || isSubmitting}
            suppressHydrationWarning
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">Verifying...</span>
            ) : (
              "Verify"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OTP;
