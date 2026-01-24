"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { InputField } from "../Shared";
import { showToast } from "../Shared/ToastMessage";
import { requestChangePasswordOtp, confirmChangePassword } from "@/utils/api";
import {
  changePasswordSchema,
  ChangePasswordValues
} from "@/utils/schemas/auth";

const ChangePassword = () => {
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Request OTP, Step 2: Verify & Change
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const handleRequestOtp = async () => {
    setIsLoading(true);
    try {
      const response = await requestChangePasswordOtp();
      if (response.statusCode === 200 || response.statusCode === 201) {
        showToast({
          type: "success",
          message: "OTP sent successfully to your registered number."
        });
        setStep(2);
      } else {
        throw new Error(response.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Failed to request OTP:", error);
      showToast({
        type: "error",
        message: error.message || "Failed to send OTP. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ChangePasswordValues) => {
    setIsLoading(true);
    try {
      const response = await confirmChangePassword({
        otp: data.otp,
        newPassword: data.newPassword
      });

      if (response.statusCode === 200 || response.statusCode === 201) {
        showToast({
          type: "success",
          message: "Password changed successfully!"
        });
        // Reset form and go back to step 1
        reset();
        setStep(1);
      } else {
        throw new Error(response.message || "Failed to change password");
      }
    } catch (error: any) {
      console.error("Failed to change password:", error);
      showToast({
        type: "error",
        message:
          error.message || "Failed to change password. Please verify your OTP."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-[0px_4px_16.4px_0px_#0000001A] p-8 md:rounded-[40px] rounded-lg mt-10 md:mt-0">
      <div className="mb-6">
        <h3 className="display3 text-accent-900 mb-2">Change Password</h3>
        <p className="heading4_medium text-neutral-white">
          {step === 1
            ? "Click the button below to receive an OTP on your registered mobile number."
            : "Enter the OTP sent to your mobile number and your new password."}
        </p>
      </div>

      {step === 1 ? (
        <Button
          onClick={handleRequestOtp}
          disabled={isLoading}
          className="w-full md:w-auto"
        >
          {isLoading ? "Sending OTP..." : "Send OTP"}
        </Button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* OTP Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-dark-grey mb-2">
              Enter OTP
            </label>
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <InputOTP
                  {...field}
                  maxLength={6}
                  onChange={(val: string) => field.onChange(val)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="relative">
            <Controller
              control={control}
              name="newPassword"
              render={({ field }) => (
                <InputField
                  label="New Password"
                  placeholder="Enter new password"
                  type="password"
                  isPassword
                  {...field}
                  aria-invalid={!!errors.newPassword}
                />
              )}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <InputField
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  type="password"
                  isPassword
                  {...field}
                  aria-invalid={!!errors.confirmPassword}
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <Button type="submit" disabled={!isValid || isLoading}>
              {isLoading ? "Changing Password..." : "Change Password"}
            </Button>

            <Button
              type="button"
              variant="link"
              onClick={() => setStep(1)}
              disabled={isLoading}
            >
              Back
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChangePassword;
