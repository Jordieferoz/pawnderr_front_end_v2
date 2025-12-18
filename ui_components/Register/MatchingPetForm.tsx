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
import { Slider } from "@/components/ui/slider";
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

      console.log("Submitting pet preferences:", payload);

      // Call API
      const response = await petPreferencesInfo(payload);

      if (response.statusCode === 200 || response.statusCode === 201) {
        console.log("Pet preferences saved successfully:", response);

        // Save to Redux
        dispatch(
          updateStepData({
            preferenceSelections: data.preferenceSelections,
            minAge: data.minAge,
            maxAge: data.maxAge,
            preferredBreedIds: data.preferredBreedIds,
            step: 5
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
        {preferenceTypes.map((preferenceType) => (
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
                  {preferenceType.options
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((option) => (
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
        ))}

        {/* Age Range Sliders */}
        <div className="flex flex-col gap-3">
          <label className="block body_large text-dark-grey">
            Age Range: {watchedMinAge}yr - {watchedMaxAge}yrs
          </label>
          <div className="space-y-4">
            {/* Min Age Slider */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Minimum Age
              </label>
              <Controller
                control={control}
                name="minAge"
                render={({ field }) => (
                  <Slider
                    min={0}
                    max={15}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => {
                      field.onChange(value[0]);
                      dispatch(updateStepData({ minAge: value[0] }));
                    }}
                    className="w-full"
                  />
                )}
              />
            </div>

            {/* Max Age Slider */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Maximum Age
              </label>
              <Controller
                control={control}
                name="maxAge"
                render={({ field }) => (
                  <Slider
                    min={0}
                    max={15}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => {
                      field.onChange(value[0]);
                      dispatch(updateStepData({ maxAge: value[0] }));
                    }}
                    className="w-full"
                  />
                )}
              />
            </div>
          </div>
          {errors.minAge && (
            <p className="mt-1 text-sm text-red-500">{errors.minAge.message}</p>
          )}
          {errors.maxAge && (
            <p className="mt-1 text-sm text-red-500">{errors.maxAge.message}</p>
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
              Saving...
            </span>
          ) : (
            "Complete Registration"
          )}
        </Button>
      </form>
    </div>
  );
};

export default MatchingPetForm;
