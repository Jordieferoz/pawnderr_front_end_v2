"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { updatePetPreferences } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegistrationMetadata } from "../Register/types";
import Loader from "../Shared/Loader";
import { showToast } from "../Shared/ToastMessage";
import { IPetData } from "./types";

interface MatchPreferencesProps {
  petData?: IPetData | null;
  loading?: boolean;
  metadata: RegistrationMetadata | null;
}

// Schema for match preferences
const matchPreferencesSchema = z.object({
  preferenceSelections: z
    .record(z.string(), z.union([z.number(), z.array(z.number())]))
    .optional(),
  minAge: z.number().min(0).max(15),
  maxAge: z.number().min(0).max(15),
  preferredBreedIds: z.array(z.number()).optional()
});

type MatchPreferencesValues = z.infer<typeof matchPreferencesSchema>;

const MatchPreferences: FC<MatchPreferencesProps> = ({
  petData,
  loading = false,
  metadata
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] =
    useState<MatchPreferencesValues | null>(null);

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
  } = useForm<MatchPreferencesValues>({
    resolver: zodResolver(matchPreferencesSchema),
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
  const currentValues = watch();

  // Pre-populate form when petData and metadata are available
  useEffect(() => {
    if (petData && !loading && metadata && preferenceTypes.length > 0) {
      const preferences = petData.preferences;

      // Map preference selections from API to form structure
      const preferenceSelections: Record<string, number | number[]> = {};

      if (preferences?.preference_selections && !Array.isArray(preferences.preference_selections)) {
        // Handle object format: { "1": 1, "2": 4, ... }
        Object.entries(preferences.preference_selections).forEach(([key, val]) => {
          const typeId = parseInt(key);
          if (!isNaN(typeId)) {
            preferenceSelections[typeId.toString()] = val as number | number[];
          }
        });
      }

      // Existing array handling (if present)
      preferences?.selections?.forEach((selection: any) => {
        // Find matching preference type in metadata by ID or Name
        // The API might return 'preference_type_id' or 'id' inside the selection object
        const typeId = selection.preference_type_id || selection.id;

        let metadataPreferenceType = preferenceTypes.find(
          (pt) => pt.id === typeId
        );

        // Fallback to name matching if ID lookup fails
        if (!metadataPreferenceType && selection.type_name) {
          metadataPreferenceType = preferenceTypes.find(
            (pt) => pt.name === selection.type_name
          );
        }

        if (metadataPreferenceType) {
          const optionId = selection.selected_option?.option_id || selection.selected_option?.id || 0;

          if (metadataPreferenceType.allow_multiple) {
            // For multiple selections, store as array
            // Check if it's already an array (some APIs return array of selected options directly)
            const existing = preferenceSelections[metadataPreferenceType.id.toString()];
            const currentArray = Array.isArray(existing) ? existing : [];
            if (optionId) {
              // validation to avoid duplicates if loop runs multiple times (though unlikely here)
              if (!currentArray.includes(optionId)) {
                preferenceSelections[metadataPreferenceType.id.toString()] = [...currentArray, optionId];
              }
            }
          } else {
            // For single selection, store as number
            if (optionId) {
              preferenceSelections[metadataPreferenceType.id.toString()] = optionId;
            }
          }
        }
      });

      // Get preferred breed IDs (if using exact match)
      const preferredBreedIds = preferences?.preferred_breed_ids || [];

      const formValues: MatchPreferencesValues = {
        preferenceSelections,
        minAge: preferences?.min_age || 0,
        maxAge: preferences?.max_age || 15,
        preferredBreedIds
      };

      reset(formValues);
      setInitialValues(formValues);
    }
  }, [petData, loading, metadata, preferenceTypes, reset]);

  // Check if form values have changed from initial values
  const hasChanges = useMemo(() => {
    if (!initialValues) return false;

    // Check age range
    if (
      currentValues.minAge !== initialValues.minAge ||
      currentValues.maxAge !== initialValues.maxAge
    ) {
      return true;
    }

    // Check preference selections
    const currentSelections = currentValues.preferenceSelections || {};
    const initialSelections = initialValues.preferenceSelections || {};

    for (const key in currentSelections) {
      const currentVal = currentSelections[key];
      const initialVal = initialSelections[key];

      if (Array.isArray(currentVal) && Array.isArray(initialVal)) {
        if (currentVal.length !== initialVal.length) return true;
        const sortedCurrent = [...currentVal].sort();
        const sortedInitial = [...initialVal].sort();
        if (!sortedCurrent.every((v, i) => v === sortedInitial[i])) return true;
      } else if (currentVal !== initialVal) {
        return true;
      }
    }

    // Check if any initial selections are missing in current
    for (const key in initialSelections) {
      if (!(key in currentSelections)) {
        return true;
      }
    }

    // Check preferred breed IDs
    const currentBreeds = currentValues.preferredBreedIds || [];
    const initialBreeds = initialValues.preferredBreedIds || [];

    if (currentBreeds.length !== initialBreeds.length) {
      return true;
    }

    const sortedCurrentBreeds = [...currentBreeds].sort();
    const sortedInitialBreeds = [...initialBreeds].sort();

    if (
      !sortedCurrentBreeds.every((id, idx) => id === sortedInitialBreeds[idx])
    ) {
      return true;
    }

    return false;
  }, [currentValues, initialValues]);

  // Handle age range change from dual slider
  const handleAgeRangeChange = (values: number[]) => {
    const [min, max] = values;
    setValue("minAge", min, { shouldValidate: true });
    setValue("maxAge", max, { shouldValidate: true });
  };

  const onSubmit = async (data: MatchPreferencesValues) => {
    if (!hasChanges) {
      showToast({
        type: "info",
        message: "No changes to save"
      });
      return;
    }

    if (!petData?.id) {
      showToast({
        type: "error",
        message: "Pet ID is missing"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert preference selections from Record<string, number | number[]> to Record<number, number | number[]>
      const preferenceSelections: Record<number, number | number[]> = {};
      if (data.preferenceSelections) {
        Object.entries(data.preferenceSelections).forEach(([key, value]) => {
          preferenceSelections[parseInt(key)] = value;
        });
      }

      // Prepare API payload
      const payload = {
        preference_selections: preferenceSelections,
        min_age: data.minAge,
        max_age: data.maxAge,
        ...(data.preferredBreedIds &&
          data.preferredBreedIds.length > 0 && {
          preferred_breed_ids: data.preferredBreedIds
        })
      };

      // Call update API
      const response = await updatePetPreferences(petData.id, payload);

      if (response.statusCode === 200 || response.statusCode === 201) {
        // Update initial values to reflect saved state
        setInitialValues(data);

        showToast({
          type: "success",
          message: "Match preferences updated successfully"
        });
      }
    } catch (error: any) {
      console.error("❌ Failed to update preferences:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update preferences. Please try again.";

      showToast({
        type: "error",
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state if metadata is not available
  if (!metadata) {
    return (
      <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:p-8 md:rounded-[40px]">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader size={40} text="Loading preferences..." />
        </div>
      </div>
    );
  }

  // Show loading state while fetching pet data
  if (loading) {
    return (
      <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:p-8 md:rounded-[40px]">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader size={40} text="Loading pet data..." />
        </div>
      </div>
    );
  }

  return (
    <div className="md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] md:p-8 md:rounded-[40px]">
      <form
        className="mb-7 flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Dynamic Preference Types */}
        {preferenceTypes.map((preferenceType) => {
          // Create a copy before sorting to avoid mutation
          const sortedOptions = [...preferenceType.options].sort(
            (a, b) => a.display_order - b.display_order
          );

          const allowMultiple = preferenceType.allow_multiple;

          return (
            <div key={preferenceType.id} className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-dark-grey">
                {preferenceType.name}
                {allowMultiple && (
                  <span className="text-neutral-white"> (Select multiple)</span>
                )}
              </label>
              <p className="text-xs text-gray-500 mb-1">
                {preferenceType.description}
              </p>
              <Controller
                control={control}
                name="preferenceSelections"
                render={({ field }) => {
                  const currentSelections = field.value || {};
                  const currentValue = currentSelections[preferenceType.id];

                  if (allowMultiple) {
                    // Multiple selection
                    const currentArray = Array.isArray(currentValue)
                      ? currentValue
                      : [];

                    return (
                      <ToggleGroup
                        type="multiple"
                        value={currentArray.map((id) => id.toString())}
                        onValueChange={(values) => {
                          const optionIds = values.map((v) => parseInt(v));

                          // Update the entire preferenceSelections object
                          const updatedSelections = {
                            ...currentSelections,
                            [preferenceType.id]: optionIds
                          };

                          field.onChange(updatedSelections);
                        }}
                        className="flex flex-wrap gap-3"
                        disabled={isSubmitting}
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
                    );
                  } else {
                    // Single selection
                    const currentNumber =
                      typeof currentValue === "number" ? currentValue : 0;

                    return (
                      <ToggleGroup
                        type="single"
                        value={currentNumber?.toString() ?? ""}
                        onValueChange={(value) => {
                          const optionId = value ? parseInt(value) : 0;

                          // Update the entire preferenceSelections object
                          const updatedSelections = {
                            ...currentSelections,
                            [preferenceType.id]: optionId
                          };

                          field.onChange(updatedSelections);
                        }}
                        className="flex flex-wrap gap-3"
                        disabled={isSubmitting}
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
                    );
                  }
                }}
              />
            </div>
          );
        })}

        {/* Age Range Dual Slider */}
        <div className="flex flex-col gap-3 relative">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-dark-grey">
              Age Range
            </label>
            <span className="text-sm font-medium text-dark-grey">
              {watchedMinAge} yr - {watchedMaxAge} yrs
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
              disabled={isSubmitting}
            />
          </div>
          {(errors.minAge || errors.maxAge) && (
            <p className="mt-1 text-sm text-red-500">
              {errors.minAge?.message || errors.maxAge?.message}
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

export default MatchPreferences;
