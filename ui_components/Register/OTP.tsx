"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { updateStepData } from "@/store/registrationSlice";
import { otpSchema, type OtpValues } from "@/utils/schemas/registrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { BackBtnRegister } from ".";

const OTP: FC = () => {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data: OtpValues) => {
    dispatch(updateStepData({ ...data, step: 3 }));
  };

  return (
    <div>
      <BackBtnRegister
        title="OTP Verification"
        desc="Enter the verification code we just sent on your Mobile Number."
      />
      <form
        className="mb-7 flex flex-col gap-6"
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
          disabled={!isValid}
          suppressHydrationWarning
        >
          Verify
        </Button>
      </form>
    </div>
  );
};

export default OTP;
