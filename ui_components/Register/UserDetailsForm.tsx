"use client";

import {
  userDetailsSchema,
  type UserDetailsValues
} from "@/utils/schemas/registrationSchema";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { genderOptions } from "@/constants";
import { setStep, updateStepData } from "@/store/registrationSlice";
import { registerAuth } from "@/utils/api";
import { signupStorage } from "@/utils/auth-storage";
import { zodResolver } from "@hookform/resolvers/zod";

import { BackBtnRegister } from ".";
import { InputField } from "../Shared";
import { showToast } from "../Shared/ToastMessage";

const UserDetailsForm: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(setStep(1));

    // Check if signup credentials exist
    const credentials = signupStorage.get();
    if (!credentials) {
      router.push("/sign-up");
    }
  }, [dispatch, router]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<UserDetailsValues>({
    resolver: zodResolver(userDetailsSchema) as Resolver<UserDetailsValues>,
    mode: "onChange",
    defaultValues: {
      name: "",
      gender: "",
      phoneNumber: "",
      location: ""
    }
  });

  const onSubmit = async (data: UserDetailsValues) => {
    setIsSubmitting(true);

    try {
      const credentials = signupStorage.get();

      if (!credentials) {
        showToast({
          type: "error",
          message: "Session expired. Please sign up again."
        });

        setTimeout(() => router.push("/sign-up"), 2000);
        return;
      }

      // Append +91 to phone number before sending to API
      const formattedPhone = data.phoneNumber.startsWith("+")
        ? data.phoneNumber
        : `+91${data.phoneNumber}`;

      const response = await registerAuth({
        email: credentials.email,
        password: credentials.password,
        name: data.name,
        phone: formattedPhone, // Use formatted phone number
        gender: data.gender
      });

      if (response.statusCode === 200 || response.statusCode === 201) {
        const userData = response.data?.data;
        console.log(userData, "userData");
        // Store tokens
        // sessionStorage.setItem("accessToken", userData.accessToken);
        // sessionStorage.setItem("refreshToken", userData.refreshToken);

        // Store complete user profile data
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

        // Update Redux for registration flow
        dispatch(
          updateStepData({
            ...userProfile,
            password: credentials.password,
            phoneNumber: data.phoneNumber, // Store original phone number without +91
            location: data.location,
            step: 2
          })
        );

        // signupStorage.clear();
      } else {
        showToast({
          type: "error",
          message: `${response.data?.message || "Failed to create account. Please try again."}`
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error?.response?.data?.message) {
        showToast({
          type: "error",
          message: error.response.data.message
        });
      } else if (error?.message) {
        showToast({
          type: "error",
          message: error.message
        });
      } else {
        showToast({
          type: "error",
          message: "Failed to create account. Please try again."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <BackBtnRegister
        title={"Let's Get to \n Know You."}
        desc={`Before we start fetching the perfect match, tell us a \n bit about yourself and your Pet.`}
      />

      <form
        className="mb-7 flex flex-col gap-6 md:px-30"
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
        <div className="fixed bottom-0 md:relative py-5 w-full bg-white shadow-[0px_-4px_12.8px_-3px_#00000012] md:shadow-none">
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
                Creating Account...
              </span>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserDetailsForm;
