"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { genderOptions } from "@/constants";
import { setStep, updateStepData } from "@/store/profileInfoSlice";
import {
  userDetailsSchema,
  UserDetailsValues,
} from "@/utils/personalInfoSchema";

import { InputField } from "../Shared";

const PersonalInfo: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setStep(1));
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UserDetailsValues>({
    resolver: zodResolver(userDetailsSchema) as Resolver<UserDetailsValues>,
    mode: "onChange",
    defaultValues: {
      name: "",
      gender: "",
      phoneNumber: "",
      location: "",
    },
  });

  const onSubmit = (data: UserDetailsValues) => {
    dispatch(updateStepData({ ...data, step: 2 }));
  };

  return (
    <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:px-20 md:py-16 md:rounded-[40px]">
      <form
        className="mb-7 flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Name */}
        <div className="relative">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <InputField
                label="Name"
                placeholder="Your full name"
                type="text"
                {...field}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
            )}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <div className="flex gap-4">
                {genderOptions.map(({ label, value }) => (
                  <Toggle
                    key={value}
                    pressed={field.value === value}
                    onPressedChange={(pressed) => {
                      if (pressed) field.onChange(value);
                    }}
                    aria-label={label}
                    type="button"
                  >
                    {label}
                  </Toggle>
                ))}
              </div>
            )}
          />
          {errors.gender && (
            <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="relative">
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <InputField
                label="Phone Number (Used for Verification Only)"
                placeholder="+1234567890"
                type="tel"
                {...field}
                aria-invalid={!!errors.phoneNumber}
                aria-describedby={
                  errors.phoneNumber ? "phone-error" : undefined
                }
              />
            )}
          />
          {errors.phoneNumber && (
            <p id="phone-error" className="mt-1 text-sm text-red-500">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div className="relative">
          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <InputField
                label="Location"
                placeholder="Select your Location"
                type="text"
                {...field}
                aria-invalid={!!errors.location}
                aria-describedby={
                  errors.location ? "location-error" : undefined
                }
              />
            )}
          />
          {errors.location && (
            <p id="location-error" className="mt-1 text-sm text-red-500">
              {errors.location.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={!isValid} suppressHydrationWarning>
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default PersonalInfo;
