"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  petProfileSchema,
  type PetProfileValues
} from "@/utils/schemas/registrationSchema";
import { useRouter } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RootState } from "@/store";
import { updateAttribute, updateStepData } from "@/store/registrationSlice";
import { petRegisterInfo, uploadPetPhoto } from "@/utils/api";
import { compressImage } from "@/utils/image-utils";
import { images } from "@/utils/images";
import { tokenStorage } from "@/utils/token-storage";
import { zodResolver } from "@hookform/resolvers/zod";

import { BackBtnRegister } from ".";
import { InputField } from "../Shared";
import { showToast } from "../Shared/ToastMessage";
import { Attribute } from "./types";

interface ImageSlot {
  url: string;
  temporaryId: string;
}

const MIN_IMAGES = 5;
const MAX_IMAGES = 10;

const DoggoPersonalForm: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const registrationData = useSelector(
    (state: RootState) => state.registration
  );

  const [imageSlots, setImageSlots] = useState<(ImageSlot | null)[]>([
    null,
    null,
    null,
    null,
    null
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const metadata = registrationData.metadata;

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

  // Get breeds for the Dog category (category ID 1)
  const dogBreeds = useMemo(() => metadata?.breeds?.["1"] || [], [metadata]);

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
  const getDefaultAttributeValues = () => {
    const defaultAttrs: Record<string, number[]> = {};
    sortedAttributes.forEach((attr) => {
      defaultAttrs[attr.id.toString()] = [];
    });
    return defaultAttrs;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<PetProfileValues>({
    resolver: zodResolver(petProfileSchema),
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

  // Count uploaded images
  const uploadedImagesCount = imageSlots.filter((slot) => slot !== null).length;
  const canAddMore = uploadedImagesCount < MAX_IMAGES;
  const hasMinimumImages = uploadedImagesCount >= MIN_IMAGES;

  // Check authentication and restore state on mount
  useEffect(() => {
    // Redirect if no metadata is loaded
    if (!metadata) {
      router.push("/sign-up");
      return;
    }

    // Check if user is authenticated
    if (!tokenStorage.hasValidSession()) {
      router.push("/sign-up");
      return;
    }

    // Restore form data from Redux (persisted in localStorage)
    if (registrationData.step >= 3) {
      // Restore images with URLs and temporary IDs
      if (registrationData.images && registrationData.images.length > 0) {
        const restoredSlots: (ImageSlot | null)[] = registrationData.images.map(
          (url, idx) => ({
            url,
            temporaryId: registrationData.temporaryPhotoIds?.[idx] || ""
          })
        );

        // Fill remaining slots with null up to MIN_IMAGES
        while (restoredSlots.length < MIN_IMAGES) {
          restoredSlots.push(null);
        }

        setImageSlots(restoredSlots);
      }

      // Convert attributes from Record<number, number[]> to Record<string, number[]>
      const attributesForForm: Record<string, number[]> = {};
      if (registrationData.attributes) {
        Object.entries(registrationData.attributes).forEach(([key, value]) => {
          attributesForForm[key] = value;
        });
      }

      // Restore all form fields
      reset({
        images: registrationData.images || [],
        petName: registrationData.petName || "",
        nicknames: registrationData.nicknames || "",
        petGender: registrationData.petGender || undefined,
        age: registrationData.age || "",
        breed: registrationData.breed || undefined,
        attributes: attributesForForm,
        vaccinationStatus: registrationData.vaccinationStatus || "",
        funFact: registrationData.funFact || "",
        barkography: registrationData.barkography || ""
      });
    }
  }, [router, registrationData, reset, metadata]);

  // Compress and convert File to Blob
  const compressAndConvertFile = async (file: File): Promise<Blob> => {
    try {
      // Compress image to base64
      const base64String = await compressImage(file, 1920, 1080, 0.8);
      const compressedSize = (base64String.length * 3) / 4;

      let finalBase64 = base64String;

      // If still too large, compress more aggressively
      if (compressedSize > 500 * 1024) {
        finalBase64 = await compressImage(file, 1280, 720, 0.6);
      }

      // Convert base64 to Blob
      const base64Data = finalBase64.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: file.type });
    } catch (error) {
      console.error("Failed to compress image:", error);
      // If compression fails, return original file as blob
      return new Blob([await file.arrayBuffer()], { type: file.type });
    }
  };

  // Upload a single image
  const uploadSingleImage = async (file: File): Promise<ImageSlot | null> => {
    try {
      // Compress the image first
      const compressedBlob = await compressAndConvertFile(file);

      // Upload compressed blob to API
      const uploadResponse = await uploadPetPhoto(compressedBlob);

      if (
        uploadResponse.statusCode === 200 ||
        uploadResponse.statusCode === 201
      ) {
        // API response structure: { data: { data: { temporary_id, image_url, ... } } }
        const apiData = uploadResponse.data?.data;

        if (!apiData) {
          console.error("No data in response:", uploadResponse);
          throw new Error("Invalid API response: missing data");
        }

        const { temporary_id, image_url } = apiData;

        if (!temporary_id || !image_url) {
          console.error("Missing required fields in response:", apiData);
          throw new Error(
            "Invalid API response: missing temporary_id or image_url"
          );
        }

        return {
          url: image_url,
          temporaryId: temporary_id
        };
      }

      console.error("Unexpected status code:", uploadResponse.statusCode);
      return null;
    } catch (error) {
      console.error("Failed to upload single image:", error);
      throw error;
    }
  };

  // Handle single OR multiple image upload for specific slot
  const handleSlotImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    startIndex: number
  ) => {
    const files = Array.from(e.target.files || []);

    // Clear the input
    e.target.value = "";

    if (files.length === 0) return;

    // Check if adding these images would exceed the maximum
    const availableSlots = MAX_IMAGES - uploadedImagesCount;
    if (files.length > availableSlots) {
      showToast({
        type: "error",
        message: `You can only upload ${availableSlots} more image(s). Maximum is ${MAX_IMAGES} images.`
      });
      return;
    }

    // Validate file sizes
    const maxSize = 10 * 1024 * 1024; // 10MB
    const invalidFiles = files.filter((file) => file.size > maxSize);
    if (invalidFiles.length > 0) {
      showToast({
        type: "error",
        message:
          "Some images are larger than 10MB. Please choose smaller images."
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      const newSlots: ImageSlot[] = [];

      // Upload all selected images sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          const imageSlot = await uploadSingleImage(file);
          if (imageSlot) {
            newSlots.push(imageSlot);
          }
          setUploadProgress({ current: i + 1, total: files.length });
        } catch (error) {
          console.error(`Failed to upload image ${i + 1}:`, error);
        }
      }

      if (newSlots.length > 0) {
        const updatedSlots = [...imageSlots];

        // If only one file was selected and the slot is empty, replace that specific slot
        if (files.length === 1 && updatedSlots[startIndex] === null) {
          updatedSlots[startIndex] = newSlots[0];
        } else {
          // For multiple files or if slot is occupied, find available slots starting from startIndex
          let insertIndex = startIndex;

          for (const newSlot of newSlots) {
            // Find next available null slot starting from startIndex
            while (
              insertIndex < updatedSlots.length &&
              updatedSlots[insertIndex] !== null
            ) {
              insertIndex++;
            }

            if (insertIndex < MAX_IMAGES) {
              if (insertIndex < updatedSlots.length) {
                updatedSlots[insertIndex] = newSlot;
              } else {
                updatedSlots.push(newSlot);
              }
              insertIndex++;
            }
          }
        }

        setImageSlots(updatedSlots);

        // Update form and Redux
        const validUrls = updatedSlots
          .filter((slot) => slot !== null)
          .map((slot) => slot!.url);
        const validTempIds = updatedSlots
          .filter((slot) => slot !== null)
          .map((slot) => slot!.temporaryId);

        setValue("images", validUrls, { shouldValidate: true });

        dispatch(
          updateStepData({
            images: validUrls,
            temporaryPhotoIds: validTempIds
          })
        );

        showToast({
          type: "success",
          message: `Successfully uploaded ${newSlots.length} image(s)`
        });
      }

      if (newSlots.length < files.length) {
        showToast({
          type: "error",
          message: `${files.length - newSlots.length} image(s) failed to upload.`
        });
      }
    } catch (error: any) {
      console.error("Failed to upload images:", error);
      showToast({
        type: "error",
        message: "Failed to upload images. Please try again."
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Handle multiple image uploads from "Add More" button
  const handleMultipleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    // Clear the input
    e.target.value = "";

    if (files.length === 0) return;

    // Check if adding these images would exceed the maximum
    const availableSlots = MAX_IMAGES - uploadedImagesCount;
    if (files.length > availableSlots) {
      showToast({
        type: "error",
        message: `You can only upload ${availableSlots} more image(s). Maximum is ${MAX_IMAGES} images.`
      });
      return;
    }

    // Validate file sizes
    const maxSize = 10 * 1024 * 1024; // 10MB
    const invalidFiles = files.filter((file) => file.size > maxSize);
    if (invalidFiles.length > 0) {
      showToast({
        type: "error",
        message:
          "Some images are larger than 10MB. Please choose smaller images."
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      const newSlots: ImageSlot[] = [];

      // Upload images sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          const imageSlot = await uploadSingleImage(file);
          if (imageSlot) {
            newSlots.push(imageSlot);
          }
          setUploadProgress({ current: i + 1, total: files.length });
        } catch (error) {
          console.error(`Failed to upload image ${i + 1}:`, error);
        }
      }

      if (newSlots.length > 0) {
        // Find first null slot and add images
        const updatedSlots = [...imageSlots];
        let insertIndex = 0;

        for (const newSlot of newSlots) {
          // Find next available null slot
          while (
            insertIndex < updatedSlots.length &&
            updatedSlots[insertIndex] !== null
          ) {
            insertIndex++;
          }

          if (insertIndex < MAX_IMAGES) {
            if (insertIndex < updatedSlots.length) {
              updatedSlots[insertIndex] = newSlot;
            } else {
              updatedSlots.push(newSlot);
            }
            insertIndex++;
          }
        }

        setImageSlots(updatedSlots);

        // Update form and Redux
        const validUrls = updatedSlots
          .filter((slot) => slot !== null)
          .map((slot) => slot!.url);
        const validTempIds = updatedSlots
          .filter((slot) => slot !== null)
          .map((slot) => slot!.temporaryId);

        setValue("images", validUrls, { shouldValidate: true });

        dispatch(
          updateStepData({
            images: validUrls,
            temporaryPhotoIds: validTempIds
          })
        );

        showToast({
          type: "success",
          message: `Successfully uploaded ${newSlots.length} image(s)`
        });
      }

      if (newSlots.length < files.length) {
        showToast({
          type: "error",
          message: `${files.length - newSlots.length} image(s) failed to upload.`
        });
      }
    } catch (error: any) {
      console.error("Failed to upload images:", error);
      showToast({
        type: "error",
        message: "Failed to upload images. Please try again."
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newSlots = [...imageSlots];
    newSlots.splice(index, 1);

    // Ensure we always have at least MIN_IMAGES slots
    while (newSlots.length < MIN_IMAGES) {
      newSlots.push(null);
    }

    setImageSlots(newSlots);

    // Update form and Redux
    const validUrls = newSlots
      .filter((slot) => slot !== null)
      .map((slot) => slot!.url);
    const validTempIds = newSlots
      .filter((slot) => slot !== null)
      .map((slot) => slot!.temporaryId);

    setValue("images", validUrls, { shouldValidate: true });

    dispatch(
      updateStepData({
        images: validUrls,
        temporaryPhotoIds: validTempIds
      })
    );
  };

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
            // Separate rendering for single vs multiple select
            if (isSingleSelect) {
              return (
                <ToggleGroup
                  type="single"
                  value={field.value?.[0]?.toString() ?? ""}
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
                  value={field.value?.map((id) => id.toString()) ?? []}
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

  const onSubmit = async (data: PetProfileValues) => {
    // Validate minimum images
    if (!hasMinimumImages) {
      showToast({
        type: "error",
        message: `Please upload at least ${MIN_IMAGES} photos`
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get all temporary photo IDs
      const temporaryPhotoIds = imageSlots
        .filter((slot) => slot !== null && slot.temporaryId)
        .map((slot) => slot!.temporaryId);

      // Convert attributes from Record<string, number[]> to Record<number, number[]>
      const attributesForRedux: Record<number, number[]> = {};
      const attributeSelections: Record<string, number[]> = {};

      Object.entries(data.attributes).forEach(([key, value]) => {
        const attrId = parseInt(key);
        attributesForRedux[attrId] = value;
        attributeSelections[key] = value;
      });

      // Prepare API payload
      const payload = {
        pet_category_id: 1, // Dog category
        pet_breed_id: data.breed,
        name: data.petName,
        nickname: data.nicknames || "",
        gender: data.petGender,
        age: parseInt(data.age),
        bark_o_graphy: data.barkography || "",
        fun_fact_or_habit: data.funFact || "",
        vaccination_status: data.vaccinationStatus || "",
        is_spayed_neutered: false,
        attribute_selections: attributeSelections,
        temporary_photo_ids: temporaryPhotoIds
      };

      // Call API
      const response = await petRegisterInfo(payload);

      if (response.statusCode === 200 || response.statusCode === 201) {
        // Extract pet_id from nested response structure
        // Response structure: response.data.data.pet_id
        const petId = response.data?.data?.pet_id;

        if (!petId) {
          console.error("Pet ID not found in response:", response);
          showToast({
            type: "error",
            message: "Pet registration succeeded but pet ID is missing."
          });
          return;
        }

        // Save all data to Redux including petId
        dispatch(
          updateStepData({
            petId: petId, // IMPORTANT: Save pet ID for preferences
            images: data.images,
            temporaryPhotoIds: temporaryPhotoIds,
            petName: data.petName,
            nicknames: data.nicknames,
            petGender: data.petGender,
            age: data.age,
            breed: data.breed,
            attributes: attributesForRedux,
            vaccinationStatus: data.vaccinationStatus,
            funFact: data.funFact,
            barkography: data.barkography,
            step: 4
          })
        );

        showToast({
          type: "success",
          message: "Pet registered successfully!"
        });
      }
    } catch (error: any) {
      console.error("Pet registration error:", error);

      if (error?.response?.data?.message) {
        showToast({ type: "error", message: error.response.data.message });
      } else if (error?.message) {
        showToast({ type: "error", message: error.message });
      } else {
        showToast({
          type: "error",
          message: "Failed to register pet. Please try again."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state if metadata is not available
  if (!metadata) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackBtnRegister
        title={"Tell Us About \n Your Doggo"}
        desc="Help us understand your pet's personality, habits, and quirks."
        note="*Remember: More information = Better matches"
      />

      <form
        className="my-7 flex flex-col gap-6 md:px-20"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Upload Images */}
        <div>
          <div className="flex gap-3 mb-4 flex-wrap">
            {imageSlots.map((slot, idx) => (
              <div key={idx} className="relative">
                <label
                  htmlFor={`image-upload-${idx}`}
                  className={`cursor-pointer ${isUploading ? "opacity-50" : ""}`}
                >
                  <img
                    className="w-20 h-20 object-cover rounded-2xl"
                    src={slot?.url || images.addPetPhoto.src}
                    alt={slot ? `Pet photo ${idx + 1}` : "Add photo"}
                  />
                  <input
                    id={`image-upload-${idx}`}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    multiple
                    hidden
                    onChange={(e) => handleSlotImageUpload(e, idx)}
                    disabled={isUploading || isSubmitting}
                  />
                </label>
                {slot && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    disabled={isUploading || isSubmitting}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {canAddMore && (
              <label
                htmlFor="image-upload-multiple"
                className={`cursor-pointer ${isUploading ? "opacity-50" : ""}`}
              >
                <img
                  src={images.addMore.src}
                  alt="Add more pet images"
                  className="w-18 h-18"
                />
                <input
                  id="image-upload-multiple"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  multiple
                  hidden
                  onChange={handleMultipleImageUpload}
                  disabled={isUploading || isSubmitting}
                />
              </label>
            )}
          </div>

          <div className="text-center mb-2">
            <label className="block text-sm font-medium text-neutral-white mb-1">
              Upload some cute photos (Size Max 10MB each)
              <br />
              <span className="text-xs text-gray-400">
                Hold Ctrl/Cmd to select multiple images at once
              </span>
            </label>
            {uploadProgress && (
              <p className="text-xs text-gray-500 mt-1">
                Uploading {uploadProgress.current} / {uploadProgress.total}{" "}
                images...
              </p>
            )}
          </div>

          {errors.images && (
            <p className="mt-1 text-sm text-red-500 text-center">
              {errors.images.message}
            </p>
          )}
        </div>

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
                onChange={(e) => {
                  field.onChange(e);
                  dispatch(updateStepData({ petName: e.target.value }));
                }}
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
                onChange={(e) => {
                  field.onChange(e);
                  dispatch(updateStepData({ nicknames: e.target.value }));
                }}
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
                onValueChange={(value) => {
                  if (value === "male" || value === "female" || value === "") {
                    field.onChange(value);
                    dispatch(updateStepData({ petGender: value }));
                  }
                }}
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
                onChange={(e) => {
                  field.onChange(e);
                  dispatch(updateStepData({ age: e.target.value }));
                }}
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

        {/* Breed Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-dark-grey mb-1">
            Breed
          </label>
          <Controller
            control={control}
            name="breed"
            render={({ field }) => (
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => {
                  const breedId = parseInt(value);
                  field.onChange(breedId);
                  dispatch(updateStepData({ breed: breedId }));
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select breed" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {dogBreeds.map((breed) => (
                    <SelectItem key={breed.id} value={breed.id.toString()}>
                      {breed.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.breed && (
            <p className="mt-1 text-sm text-red-500">{errors.breed.message}</p>
          )}
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
                  dispatch(updateStepData({ vaccinationStatus: value }));
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Vaccination status" />
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
                onChange={(e) => {
                  field.onChange(e);
                  dispatch(updateStepData({ funFact: e.target.value }));
                }}
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
                onChange={(e) => {
                  field.onChange(e);
                  dispatch(updateStepData({ barkography: e.target.value }));
                }}
                disabled={isSubmitting}
              />
            )}
          />
        </div>
        <div className="fixed bottom-0 left-0 md:relative py-5 w-full bg-white shadow-[0px_-4px_12.8px_-3px_#00000012] md:shadow-none flex justify-center md:block">
          <Button
            type="submit"
            disabled={!hasMinimumImages || isUploading || isSubmitting}
            suppressHydrationWarning
            className="w-[calc(100%-40px)] md:w-full"
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
                Submitting...
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

export default DoggoPersonalForm;
