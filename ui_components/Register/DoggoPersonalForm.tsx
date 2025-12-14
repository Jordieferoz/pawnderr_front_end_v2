"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { genderOptions } from "@/constants";
import { RootState } from "@/store";
import { updateStepData } from "@/store/registrationSlice";
import { registerAuth } from "@/utils/api";
import { signupStorage } from "@/utils/auth-storage";
import {
  userDetailsSchema,
  type UserDetailsValues,
} from "@/utils/schemas/registrationSchema";
import { tokenStorage } from "@/utils/token-storage";

import { InputField } from "../Shared";
import { BackBtnRegister } from ".";

const UserDetailsForm: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const registrationData = useSelector(
    (state: RootState) => state.registration,
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<UserDetailsValues>({
    resolver: zodResolver(userDetailsSchema) as Resolver<UserDetailsValues>,
    mode: "onChange",
    defaultValues: {
      name: registrationData.name || "",
      gender: registrationData.gender || "",
      phoneNumber: registrationData.phoneNumber || "",
      location: registrationData.location || "",
    },
  });

  useEffect(() => {
    // Check if user already completed this step (has tokens in sessionStorage)
    if (tokenStorage.hasValidSession() && registrationData.userId) {
      // User already registered, check if they should move forward
      if (registrationData.step > 1) {
        router.push("/register"); // Will route to correct step based on Redux state
        return;
      }
    }

    // Check if signup credentials exist (fresh registration)
    const credentials = signupStorage.get();
    if (!credentials && !registrationData.userId) {
      router.push("/sign-up");
    }
  }, [router, registrationData.userId, registrationData.step]);

  // Restore form values from Redux (persisted in localStorage)
  useEffect(() => {
    if (registrationData.name) setValue("name", registrationData.name);
    if (registrationData.gender) setValue("gender", registrationData.gender);
    if (registrationData.phoneNumber)
      setValue("phoneNumber", registrationData.phoneNumber);
    if (registrationData.location)
      setValue("location", registrationData.location);
  }, [registrationData, setValue]);

  const onSubmit = async (data: UserDetailsValues) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      const credentials = signupStorage.get();

      if (!credentials) {
        setApiError("Session expired. Please sign up again.");
        setTimeout(() => router.push("/sign-up"), 2000);
        return;
      }

      const response = await registerAuth({
        email: credentials.email,
        password: credentials.password,
        name: data.name,
        phone: data.phoneNumber,
        gender: data.gender,
      });

      if (response.statusCode === 200 || response.statusCode === 201) {
        const userData = response.data?.data;

        if (userData?.accessToken && userData?.refreshToken) {
          // Store tokens in sessionStorage (expires when tab closes)
          tokenStorage.setAccessToken(userData.accessToken);
          tokenStorage.setRefreshToken(userData.refreshToken);

          // Update Redux (will be persisted to localStorage automatically)
          dispatch(
            updateStepData({
              // Authentication data
              email: userData.email,
              userId: userData.id,
              isVerified: userData.is_verified,
              isActive: userData.is_active,
              profileCompletion: userData.profile_completion_percentage,

              // Step 1 form data
              name: data.name,
              gender: data.gender,
              phoneNumber: data.phoneNumber,
              location: data.location,

              // Move to next step
              step: 2,
            }),
          );

          // Clear signup credentials
          signupStorage.clear();
        } else {
          setApiError(
            "Registration successful but authentication tokens missing.",
          );
        }
      } else {
        setApiError(
          response.data?.message ||
            "Failed to create account. Please try again.",
        );
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error?.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error?.message) {
        setApiError(error.message);
      } else {
        setApiError("Failed to create account. Please try again.");
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

        <Button
          type="submit"
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
              Creating Account...
            </span>
          ) : (
            "Next"
          )}
        </Button>
      </form>
    </div>
  );
};

export default UserDetailsForm;
