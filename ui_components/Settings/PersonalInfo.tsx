"use client";

import {
  personalInfoSchema,
  PersonalInfoValues
} from "@/utils/personalInfoSchema";
import { FC, useEffect, useMemo, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useUserProfileFromStorage, useUserProfileRefetch } from "@/hooks";
import { updateUserProfile } from "@/utils/api";
import { userStorage } from "@/utils/user-storage";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputField } from "../Shared";
import { showToast } from "../Shared/ToastMessage";

// Sanitize phone number input - only allow digits and + at the start
const sanitizePhoneInput = (value: string): string => {
  // Remove all non-digit characters except + at the start
  let sanitized = value.replace(/[^\d+]/g, "");

  // Ensure + is only at the start
  if (sanitized.includes("+")) {
    const plusIndex = sanitized.indexOf("+");
    if (plusIndex > 0) {
      // Remove + if it's not at the start
      sanitized = sanitized.replace(/\+/g, "");
    } else if (plusIndex === 0 && sanitized.length > 1) {
      // Keep + at start, remove any other + signs
      sanitized = "+" + sanitized.slice(1).replace(/\+/g, "");
    }
  }

  return sanitized;
};

const PersonalInfo: FC = () => {
  const { userProfile } = useUserProfileFromStorage();
  // Only use refetch function, don't trigger API call on mount
  const { refetch: refetchProfile } = useUserProfileRefetch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<PersonalInfoValues>({
    name: "",
    email: "",
    phone: ""
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema) as Resolver<PersonalInfoValues>,
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    }
  });

  // Watch form values
  const currentValues = watch();

  // Prefill form when user profile data is available
  useEffect(() => {
    if (userProfile) {
      const values = {
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || ""
      };
      reset(values);
      setInitialValues(values);
    }
  }, [userProfile, reset]);

  // Check if form values have changed from initial values
  const hasChanges = useMemo(() => {
    return (
      currentValues.name !== initialValues.name ||
      currentValues.email !== initialValues.email ||
      currentValues.phone !== initialValues.phone
    );
  }, [currentValues, initialValues]);

  const onSubmit = async (data: PersonalInfoValues) => {
    if (!hasChanges) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateUserProfile({
        name: data.name,
        email: data.email,
        phone: data.phone
      });

      // API response structure: { status: "success", data: {...user data...}, message: "..." }
      const userData = response.data?.data || response.data;

      if (userData && userData.id) {
        // Update localStorage with the response data
        userStorage.set(userData);

        // Refetch profile to get latest data from server
        await refetchProfile();

        // Update initial values to reflect saved state
        setInitialValues({
          name: userData.name || data.name,
          email: userData.email || data.email,
          phone: userData.phone || data.phone
        });

        // Show success toast
        showToast({
          type: "success",
          message: "Profile updated successfully"
        });
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error: any) {
      console.error("❌ Failed to update profile:", error);

      // Show error toast
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile. Please try again.";

      showToast({
        type: "error",
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-[0px_4px_16.4px_0px_#0000001A] p-8 md:rounded-[40px] rounded-lg mt-10 md:mt-0">
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

        {/* Email */}
        <div className="relative">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <InputField
                label="Email"
                placeholder="your.email@example.com"
                type="email"
                {...field}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            )}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="relative">
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <InputField
                label="Phone Number"
                placeholder="+1234567890"
                type="tel"
                {...field}
                onChange={(e) => {
                  const sanitized = sanitizePhoneInput(e.target.value);
                  field.onChange(sanitized);
                }}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
            )}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!isValid || !hasChanges || isSubmitting}
          suppressHydrationWarning
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default PersonalInfo;
