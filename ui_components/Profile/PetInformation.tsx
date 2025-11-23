"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { activities, energyLevels, vaccinationOptions } from "@/constants";
import { updateStepData } from "@/store/registrationSlice";
import { images } from "@/utils/images";

import { petProfileSchema, PetProfileValues } from "@/utils/personalInfoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { InputField } from "../Shared";

const PetInformation: FC = () => {
  const dispatch = useDispatch();

  const [imageSlots, setImageSlots] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<PetProfileValues>({
    resolver: zodResolver(petProfileSchema),
    mode: "onChange",
    defaultValues: {
      images: [],
      petName: "",
      nicknames: "",
      petGender: undefined,
      age: "",
      energyLevel: [],
      favoriteActivities: [],
      vaccinationStatus: "",
      funFact: "",
      barkography: "",
    },
  });

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newSlots = [...imageSlots];
        newSlots[index] = base64String;
        setImageSlots(newSlots);
        setValue("images", newSlots.filter(Boolean) as string[], {
          shouldValidate: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: PetProfileValues) => {
    dispatch(updateStepData({ ...data, step: 4 }));
  };

  return (
    <form
      className="my-7 flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* Upload Images */}
      <div>
        <div className="flex gap-3 mb-4 flex-wrap">
          {imageSlots.map((img, idx) => (
            <label
              key={idx}
              htmlFor={`image-upload-${idx}`}
              className="cursor-pointer"
            >
              <img
                className="w-20 h-20 object-cover rounded-2xl"
                src={
                  img
                    ? typeof img === "string"
                      ? img
                      : URL.createObjectURL(img)
                    : images.addPetPhoto.src
                }
              />

              <input
                id={`image-upload-${idx}`}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageUpload(e, idx)}
              />
            </label>
          ))}
          <label htmlFor="image-upload-add" className="cursor-pointer">
            <img
              src={images.addMore.src}
              alt="Add pet images"
              className="w-18 h-18"
            />
            <input
              id="image-upload-add"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64String = reader.result as string;
                    const newSlots = [...imageSlots, base64String];
                    setImageSlots(newSlots);
                    setValue("images", newSlots.filter(Boolean) as string[], {
                      shouldValidate: true,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
        <label className="block text-sm font-medium text-neutral-white mb-2">
          Upload some cute photos (Size ≤ 100KB)
        </label>
        {errors.images && (
          <p className="mt-1 text-sm text-red-500">{errors.images.message}</p>
        )}
      </div>

      {/* Pet Name */}
      <div className="relative">
        <Controller
          control={control}
          name="petName"
          render={({ field }) => (
            <InputField
              label="Pet’s Name"
              placeholder="Enter your Pet’s Name"
              type="text"
              {...field}
              aria-invalid={!!errors.petName}
              aria-describedby={errors.petName ? "petname-error" : undefined}
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
          Pets a
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
            >
              <ToggleGroupItem value="male">Male</ToggleGroupItem>
              <ToggleGroupItem value="female">Female</ToggleGroupItem>
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
              placeholder="Enter your Pet’s Age"
              type="number"
              {...field}
              aria-invalid={!!errors.age}
              aria-describedby={errors.age ? "age-error" : undefined}
            />
          )}
        />
        {errors.age && (
          <p id="age-error" className="mt-1 text-sm text-red-500">
            {errors.age.message}
          </p>
        )}
      </div>

      {/* Energy Level */}
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium text-dark-grey">
          Energy Level{" "}
          <span className="text-neutral-white"> (Select at least 1)</span>
        </label>
        <Controller
          control={control}
          name="energyLevel"
          render={({ field }) => (
            <ToggleGroup
              type="multiple"
              value={field.value ?? ""}
              onValueChange={field.onChange}
              className="flex gap-3 flex-wrap"
            >
              {energyLevels.map((level) => (
                <ToggleGroupItem key={level} value={level}>
                  {level}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        />
        {errors.energyLevel && (
          <p className="mt-1 text-sm text-red-500">
            {errors.energyLevel.message}
          </p>
        )}
      </div>

      {/* Favorite Activities */}
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium text-dark-grey">
          Favorite Activities{" "}
          <span className="text-neutral-white"> (Select at least 3)</span>
        </label>
        <Controller
          control={control}
          name="favoriteActivities"
          render={({ field }) => (
            <ToggleGroup
              type="multiple"
              value={field.value}
              onValueChange={field.onChange}
              className="flex flex-wrap gap-3"
            >
              {activities.map((activity) => (
                <ToggleGroupItem key={activity} value={activity}>
                  {activity}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        />
        {errors.favoriteActivities && (
          <p className="mt-1 text-sm text-red-500">
            {errors.favoriteActivities.message}
          </p>
        )}
      </div>

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
            <Select value={field.value} onValueChange={field.onChange}>
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
            />
          )}
        />
      </div>

      <Button type="submit" disabled={!isValid} suppressHydrationWarning>
        Save Changes
      </Button>
    </form>
  );
};

export default PetInformation;
