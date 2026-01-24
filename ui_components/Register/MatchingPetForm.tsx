// components/Register/MatchingPetForm.tsx
"use client";

import {
  setStep,
  updatePreference,
  updateStepData
} from "@/store/registrationSlice";
import {
  matchingPetSchema,
  PetMatchingProfileValues
} from "@/utils/schemas/registrationSchema";
import { useRouter } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RootState } from "@/store";
import { petPreferencesInfo } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";

import { BackBtnRegister } from ".";
import { showToast } from "../Shared/ToastMessage";

const MatchingPetForm: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registrationData = useSelector(
    (state: RootState) => state.registration
  );

  const metadata = registrationData.metadata;
  const petId = registrationData.petId;

  // Get preference types from metadata
  const preferenceTypes = useMemo(
    () =>
      metadata?.preference_types
        ? [...metadata.preference_types].sort(
            (a, b) => a.display_order - b.display_order
          )
        : [],
    [metadata]
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch
  } = useForm<PetMatchingProfileValues>({
    resolver: zodResolver(matchingPetSchema),
    mode: "onChange",
    defaultValues: {
      preferenceSelections: {},
      minAge: 0,
      maxAge: 15,
      preferredBreedIds: []
    }
  });

  const watchedMinAge = watch("minAge");
  const watchedMaxAge = watch("maxAge");

  // Check if pet ID exists
  useEffect(() => {
    if (!metadata) {
      console.error("Metadata not loaded");
      return;
    }

    // Check if pet registration is complete
    if (!petId) {
      console.error("Pet ID missing");
      showToast({
        type: "error",
        message: "Please complete pet registration first."
      });
      // Set step back to 3
      dispatch(setStep(3));
      return;
    }

    // Restore form data
    if (registrationData.step >= 4 && registrationData.preferenceSelections) {
      reset({
        preferenceSelections: registrationData.preferenceSelections || {},
        minAge: registrationData.minAge || 0,
        maxAge: registrationData.maxAge || 15,
        preferredBreedIds: registrationData.preferredBreedIds || []
      });
    }
  }, [metadata, registrationData, reset, petId, dispatch]);

  const handlePreferenceChange = (
    preferenceTypeId: number,
    optionId: number
  ) => {
    const currentSelections = watch("preferenceSelections") || {};
    const updatedSelections = {
      ...currentSelections,
      [preferenceTypeId]: optionId
    };

    setValue("preferenceSelections", updatedSelections, {
      shouldValidate: true
    });

    // Update Redux
    dispatch(
      updatePreference({
        preferenceTypeId,
        optionId
      })
    );
  };

  // Handle age range change from dual slider
  const handleAgeRangeChange = (values: number[]) => {
    const [min, max] = values;
    setValue("minAge", min, { shouldValidate: true });
    setValue("maxAge", max, { shouldValidate: true });

    dispatch(
      updateStepData({
        minAge: min,
        maxAge: max
      })
    );
  };

  const onSubmit = async (data: PetMatchingProfileValues) => {
    if (!petId) {
      showToast({
        type: "error",
        message: "Pet ID not found. Please complete pet registration first."
      });
      dispatch(setStep(3));
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare API payload - EXACT FORMAT
      const payload = {
        pet_id: petId,
        preference_selections: data.preferenceSelections,
        min_age: data.minAge,
        max_age: data.maxAge,
        ...(data.preferredBreedIds &&
          data.preferredBreedIds.length > 0 && {
            preferred_breed_ids: data.preferredBreedIds
          })
      };

      // Call API
      const response = await petPreferencesInfo(payload);

      if (response.statusCode === 200 || response.statusCode === 201) {
        // Save to Redux
        dispatch(
          updateStepData({
            preferenceSelections: data.preferenceSelections,
            minAge: data.minAge,
            maxAge: data.maxAge,
            preferredBreedIds: data.preferredBreedIds
          })
        );

        showToast({
          type: "success",
          message: "Registration completed successfully!"
        });

        // Navigate to dashboard
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Pet preferences error:", error);

      if (error?.response?.data?.message) {
        showToast({ type: "error", message: error.response.data.message });
      } else if (error?.message) {
        showToast({ type: "error", message: error.message });
      } else {
        showToast({
          type: "error",
          message: "Failed to save preferences. Please try again."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading if metadata not available
  if (!metadata) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackBtnRegister
        title="What Kind of Pet Are You Looking to Connect With?"
        desc="Tell us what kind of companion would be a great match for your pet."
        note="*Remember: More information = Better matches"
        titleClassName="md:!px-0"
      />

      <form
        className="my-7 flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Dynamic Preference Types */}
        {preferenceTypes.map((preferenceType) => {
          // Create a copy before sorting to avoid mutation
          const sortedOptions = [...preferenceType.options].sort(
            (a, b) => a.display_order - b.display_order
          );

          return (
            <div key={preferenceType.id} className="flex flex-col gap-2">
              <label className="block body_large text-dark-grey">
                {preferenceType.name}
              </label>
              <Controller
                control={control}
                name={`preferenceSelections.${preferenceType.id}`}
                render={({ field }) => (
                  <ToggleGroup
                    type="single"
                    value={field.value?.toString() ?? ""}
                    onValueChange={(value) => {
                      const optionId = value ? parseInt(value) : 0;
                      field.onChange(optionId);
                      if (value) {
                        handlePreferenceChange(preferenceType.id, optionId);
                      }
                    }}
                    className="flex flex-wrap gap-3"
                  >
                    {sortedOptions.map((option) => (
                      <ToggleGroupItem
                        key={option.id}
                        value={option.id.toString()}
                      >
                        {option.value}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                )}
              />
            </div>
          );
        })}

        {/* Age Range Dual Slider */}

        <div className="flex flex-col gap-3 relative">
          <div className="flex justify-between items-center mb-2">
            <label className="block body_large text-dark-grey">Age Range</label>
            <span className="body_large text-dark-grey">
              {watchedMinAge}yr - {watchedMaxAge}yrs
            </span>
          </div>
          <div className="w-full">
            <DualRangeSlider
              value={[watchedMinAge, watchedMaxAge]}
              onValueChange={handleAgeRangeChange}
              min={0}
              max={15}
              step={1}
              className="w-full"
            />
          </div>
          {(errors.minAge || errors.maxAge) && (
            <p className="mt-1 text-sm text-red-500">
              {errors.minAge?.message || errors.maxAge?.message}
            </p>
          )}
        </div>
        <div className="fixed bottom-0 left-0 md:relative py-5 w-full bg-white shadow-[0px_-4px_12.8px_-3px_#00000012] md:shadow-none flex justify-center md:block">
          <Button
            type="submit"
            className="w-[calc(100%-40px)] md:w-full"
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
                Saving...
              </span>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MatchingPetForm;
