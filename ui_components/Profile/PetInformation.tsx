"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  petProfileEditSchema,
  PetProfileEditValues
} from "@/utils/personalInfoSchema";
import { FC, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { updateAttribute } from "@/store/registrationSlice";
import { updatePetInfo } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";

import { Attribute, RegistrationMetadata } from "../Register/types";
import { InputField } from "../Shared";
import Loader from "../Shared/Loader";
import { showToast } from "../Shared/ToastMessage";
import { IPetData } from "./types";

interface PetInformationProps {
  petData?: IPetData | null;
  loading?: boolean;
  metadata: RegistrationMetadata | null;
}

const PetInformation: FC<PetInformationProps> = ({
  petData,
  loading = false,
  metadata
}) => {
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] =
    useState<PetProfileEditValues | null>(null);

  // Sort attributes by display_order
  const sortedAttributes = useMemo(
    () =>
      metadata?.attributes
        ? [...metadata.attributes].sort(
          (a, b) => a.display_order - b.display_order
        )
        : [],
    [metadata]
  );

  // Get breeds for the pet's category
  const categoryId = petData?.category?.id?.toString() || "1";
  const breeds = useMemo(
    () => metadata?.breeds?.[categoryId] || [],
    [metadata, categoryId]
  );

  // Get gender and vaccination options
  const genderOptions = useMemo(
    () => metadata?.pet_gender_options || [],
    [metadata]
  );

  const vaccinationOptions = useMemo(
    () => metadata?.vaccination_status_options || [],
    [metadata]
  );

  // Prepare default values for attributes
  const getDefaultAttributeValues = (): Record<string, number[]> => {
    const defaultAttrs: Record<string, number[]> = {};
    sortedAttributes.forEach((attr) => {
      defaultAttrs[attr.id.toString()] = [];
    });
    return defaultAttrs;
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<PetProfileEditValues>({
    resolver: zodResolver(petProfileEditSchema),
    mode: "onChange",
    defaultValues: {
      images: [],
      petName: "",
      nicknames: "",
      petGender: undefined,
      age: "",
      breed: undefined,
      attributes: getDefaultAttributeValues(),
      vaccinationStatus: "",
      funFact: "",
      barkography: ""
    }
  });

  // Watch form values
  const currentValues = watch();

  // Pre-populate form when petData and metadata are available
  useEffect(() => {
    if (petData && !loading && metadata && sortedAttributes.length > 0) {
      // Map attributes from API to form structure
      const attributesForForm: Record<string, number[]> = {};

      // Initialize all attributes with empty arrays
      sortedAttributes.forEach((attr) => {
        attributesForForm[attr.id.toString()] = [];
      });

      // Populate with pet's attribute selections
      petData.attributes?.forEach((petAttr) => {
        // Find matching attribute in metadata by name
        const metadataAttr = sortedAttributes.find(
          (attr) => attr.name === petAttr.attribute_name
        );

        if (metadataAttr) {
          // Find option IDs that match the selected values
          const selectedOptionIds = petAttr.selected_options
            .map((selected) => {
              const matchingOption = metadataAttr.options.find(
                (opt) => opt.value === selected.value
              );
              return matchingOption?.id;
            })
            .filter((id): id is number => id !== undefined);

          attributesForForm[metadataAttr.id.toString()] = selectedOptionIds;
        }
      });

      // Map API response to form values
      const formValues: PetProfileEditValues = {
        images: petData.images?.map((img) => img.image_url) || [],
        petName: petData.name || "",
        nicknames: petData.nickname || "",
        petGender: (petData.gender as "male" | "female") || undefined,
        age: petData.age?.toString() || "",
        breed: petData.breed?.id || undefined,
        attributes: attributesForForm,
        vaccinationStatus: petData.vaccination_status || "",
        funFact: petData.fun_fact_or_habit || "",
        barkography: petData.bark_o_graphy || ""
      };

      reset(formValues);
      setInitialValues(formValues);
    }
  }, [petData, loading, metadata, sortedAttributes, reset]);

  // Check if form values have changed from initial values
  const hasChanges = useMemo(() => {
    if (!initialValues) return false;

    // Helper to compare arrays
    const arraysEqual = (a: number[], b: number[]): boolean => {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((val, idx) => val === sortedB[idx]);
    };

    // Check basic fields
    if (
      currentValues.petName !== initialValues.petName ||
      currentValues.nicknames !== initialValues.nicknames ||
      currentValues.petGender !== initialValues.petGender ||
      currentValues.age !== initialValues.age ||
      currentValues.breed !== initialValues.breed ||
      currentValues.vaccinationStatus !== initialValues.vaccinationStatus ||
      currentValues.funFact !== initialValues.funFact ||
      currentValues.barkography !== initialValues.barkography
    ) {
      return true;
    }

    // Check attributes
    const currentAttrs = currentValues.attributes || {};
    const initialAttrs = initialValues.attributes || {};

    for (const key in currentAttrs) {
      if (!arraysEqual(currentAttrs[key] || [], initialAttrs[key] || [])) {
        return true;
      }
    }

    return false;
  }, [currentValues, initialValues]);

  const renderAttributeField = (attribute: Attribute) => {
    const isSingleSelect = attribute.max_selections === 1;

    // Create a copy of options array before sorting to avoid mutation
    const sortedOptions = [...attribute.options].sort(
      (a, b) => a.display_order - b.display_order
    );

    return (
      <div key={attribute.id} className="flex flex-col gap-2">
        <label className="block text-sm font-medium text-dark-grey">
          {attribute.name}
          {attribute.is_required && (
            <span className="text-neutral-white">
              {" "}
              (Select at least {attribute.min_selections})
            </span>
          )}
        </label>
        <Controller
          control={control}
          name={`attributes.${attribute.id}`}
          render={({ field }) => {
            const fieldValue = field.value || [];

            if (isSingleSelect) {
              return (
                <ToggleGroup
                  type="single"
                  value={fieldValue[0]?.toString() ?? ""}
                  onValueChange={(value) => {
                    const selectedIds = value ? [parseInt(value)] : [];
                    field.onChange(selectedIds);

                    // Update Redux
                    dispatch(
                      updateAttribute({
                        attributeId: attribute.id,
                        optionIds: selectedIds
                      })
                    );
                  }}
                  className="flex gap-3 flex-wrap"
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
              return (
                <ToggleGroup
                  type="multiple"
                  value={fieldValue.map((id) => id.toString())}
                  onValueChange={(value) => {
                    const selectedIds = Array.isArray(value)
                      ? value.map((v) => parseInt(v))
                      : [];
                    field.onChange(selectedIds);

                    // Update Redux
                    dispatch(
                      updateAttribute({
                        attributeId: attribute.id,
                        optionIds: selectedIds
                      })
                    );
                  }}
                  className="flex gap-3 flex-wrap"
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
        {errors.attributes?.[attribute.id] && (
          <p className="mt-1 text-sm text-red-500">
            {errors.attributes[attribute.id]?.message}
          </p>
        )}
      </div>
    );
  };

  const onSubmit = async (data: PetProfileEditValues) => {
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
      // Convert attributes from Record<string, number[]> to API format
      const attributeSelections: Record<string, number[]> = {};
      if (data.attributes) {
        Object.entries(data.attributes).forEach(([key, value]) => {
          attributeSelections[key] = value;
        });
      }

      // Prepare API payload
      const payload = {
        name: data.petName,
        nickname: data.nicknames || "",
        age: parseInt(data.age),
        bark_o_graphy: data.barkography || "",
        fun_fact_or_habit: data.funFact || "",
        vaccination_status: data.vaccinationStatus || "",
        is_spayed_neutered: petData.is_spayed_neutered || false,
        attribute_selections: attributeSelections
      };

      // Call update API
      const response = await updatePetInfo(petData.id, payload);

      if (response.statusCode === 200 || response.statusCode === 201) {
        // Update initial values to reflect saved state
        setInitialValues(data);

        showToast({
          type: "success",
          message: "Pet profile updated successfully"
        });
      }
    } catch (error: any) {
      console.error("❌ Failed to update pet profile:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update pet profile. Please try again.";

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
          <Loader size={40} text="Loading form..." />
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
        {/* Image Preview Thumbnails */}
        {petData?.images && petData.images.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-dark-grey mb-3">
              Pet Photos
            </label>
            <div className="flex gap-3 flex-wrap">
              {[...petData.images]
                .sort((a, b) => a.display_order - b.display_order)
                .map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-200"
                  >
                    <img
                      src={img.image_url}
                      alt={`Pet photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {img.is_primary && (
                      <div className="absolute top-1 right-1 bg-blue text-white text-[10px] px-1.5 py-0.5 rounded">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              To update photos, go to Update Gallery
            </p>
          </div>
        )}

        {/* Pet Name */}
        <div className="relative">
          <Controller
            control={control}
            name="petName"
            render={({ field }) => (
              <InputField
                label="Pet's Name"
                placeholder="Enter your Pet's Name"
                type="text"
                {...field}
                aria-invalid={!!errors.petName}
                aria-describedby={errors.petName ? "petname-error" : undefined}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.petName && (
            <p id="petname-error" className="mt-1 text-sm text-red-500">
              {errors.petName.message}
            </p>
          )}
        </div>

        {/* Nicknames */}
        <div className="relative">
          <label className="block text-sm font-medium text-dark-grey mb-1">
            Nickname(s)
          </label>
          <Controller
            control={control}
            name="nicknames"
            render={({ field }) => (
              <Textarea
                {...field}
                className="w-full"
                placeholder="Enter Nickname(s)"
                aria-invalid={!!errors.nicknames}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.nicknames && (
            <p className="mt-1 text-sm text-red-500">
              {errors.nicknames.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-dark-grey">
            Pet's a
          </label>
          <Controller
            control={control}
            name="petGender"
            render={({ field }) => (
              <ToggleGroup
                type="single"
                value={field.value ?? ""}
                onValueChange={field.onChange}
                className="flex gap-4"
                disabled={isSubmitting}
              >
                {genderOptions.map((option) => (
                  <ToggleGroupItem key={option.value} value={option.value}>
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
          />
          {errors.petGender && (
            <p className="mt-1 text-sm text-red-500">
              {errors.petGender.message}
            </p>
          )}
        </div>

        {/* Age */}
        <div className="relative">
          <Controller
            control={control}
            name="age"
            render={({ field }) => (
              <InputField
                label="Age"
                placeholder="Enter your Pet's Age"
                type="number"
                {...field}
                aria-invalid={!!errors.age}
                aria-describedby={errors.age ? "age-error" : undefined}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.age && (
            <p id="age-error" className="mt-1 text-sm text-red-500">
              {errors.age.message}
            </p>
          )}
        </div>

        {/* Breed Selection - Read Only */}
        <div className="relative">
          <label className="block text-sm font-medium text-dark-grey mb-1">
            Breed
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
            {petData?.breed?.name || "Not specified"}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Breed cannot be changed after registration
          </p>
        </div>

        {/* Dynamic Attributes */}
        {sortedAttributes.map((attribute) => renderAttributeField(attribute))}

        {/* Vaccination Status */}
        <div className="relative">
          <label className="block text-sm font-medium text-dark-grey mb-1">
            Vaccination Status
            <span className="text-neutral-white"> (optional)</span>
          </label>
          <Controller
            control={control}
            name="vaccinationStatus"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select vaccination status" />
                </SelectTrigger>
                <SelectContent>
                  {vaccinationOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Fun Fact or Habit */}
        <div className="relative">
          <label className="block text-sm font-medium text-dark-grey mb-1">
            Fun Fact or Habit
          </label>
          <Controller
            control={control}
            name="funFact"
            render={({ field }) => (
              <Textarea
                {...field}
                className="w-full"
                placeholder="Fun Fact or Habit"
                disabled={isSubmitting}
              />
            )}
          />
        </div>

        {/* Barkography */}
        <div className="relative">
          <label className="block text-sm font-medium text-dark-grey mb-1">
            Bark-o-graphy
          </label>
          <Controller
            control={control}
            name="barkography"
            render={({ field }) => (
              <Textarea
                {...field}
                className="w-full"
                placeholder="Short Bio (aka Bark-o-graphy)"
                disabled={isSubmitting}
              />
            )}
          />
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

export default PetInformation;
