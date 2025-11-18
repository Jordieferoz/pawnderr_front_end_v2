import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { interestedIn, personalityPreference, playDateVibe } from "@/constants";
import { updateStepData } from "@/store/registrationSlice";
import { images } from "@/utils/images";
import {
  PetMatchingProfileValues,
  matchingPetSchema,
} from "@/utils/schemas/registrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import router from "next/router";

import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const FilterContent = () => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PetMatchingProfileValues>({
    resolver: zodResolver(matchingPetSchema),
    mode: "onChange",
    defaultValues: {
      interestedIn: [],
      playDateVibe: [],
      ageRange: [0, 15],
      preferredBreeds: undefined,
      distanceRadius: undefined,
      personalityPreference: [],
    },
  });

  const onSubmit = (data: PetMatchingProfileValues) => {
    dispatch(updateStepData({ ...data, step: 4 }));
    router.push("/dashboard");
  };

  return (
    <div className="">
      <div className="flex items-center gap-3">
        <img src={images.backBtn.src} className="w-10 h-10" />
        <h4 className="display4_medium text-accent-900">Filter</h4>
      </div>
      <form
        className="my-7 flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Interested In */}
        <div className="flex flex-col gap-2">
          <label className="block body_large text-dark-grey">
            Interested In
          </label>
          <Controller
            control={control}
            name="interestedIn"
            render={({ field }) => (
              <ToggleGroup
                type="multiple"
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-wrap gap-3"
              >
                {interestedIn.map((activity) => (
                  <ToggleGroupItem key={activity} value={activity}>
                    {activity}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
          />
          {errors.interestedIn && (
            <p className="mt-1 text-sm text-red-500">
              {errors.interestedIn.message}
            </p>
          )}
        </div>

        {/* Playdate Vibe */}
        <div className="flex flex-col gap-2">
          <label className="block body_large text-dark-grey">
            Playdate Vibe
          </label>
          <Controller
            control={control}
            name="playDateVibe"
            render={({ field }) => (
              <ToggleGroup
                type="multiple"
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-wrap gap-3"
              >
                {playDateVibe.map((activity) => (
                  <ToggleGroupItem key={activity} value={activity}>
                    {activity}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
          />
          {errors.playDateVibe && (
            <p className="mt-1 text-sm text-red-500">
              {errors.playDateVibe.message}
            </p>
          )}
        </div>

        {/* Age Range Slider */}
        <div className="flex flex-col gap-3 relative">
          <label className="block body_large text-dark-grey">Age Range</label>
          <Controller
            control={control}
            name="ageRange"
            render={({ field }) => (
              <div className="space-y-4">
                <Slider
                  min={0}
                  max={15}
                  step={1}
                  value={field.value}
                  onValueChange={field.onChange}
                  className="w-full"
                />
                <div className="flex justify-between absolute top-0 right-0">
                  <span>
                    {field.value[0]}yr - {field.value[1]}yrs
                  </span>
                </div>
              </div>
            )}
          />
          {errors.ageRange && (
            <p className="mt-1 text-sm text-red-500">
              {errors.ageRange.message}
            </p>
          )}
        </div>

        {/* Preferred Breeds */}
        <div className="flex flex-col gap-2">
          <label className="block body_large text-dark-grey">
            Preferred Breeds
          </label>
          <Controller
            control={control}
            name="preferredBreeds"
            render={({ field }) => (
              <ToggleGroup
                type="single"
                value={field.value ?? ""}
                onValueChange={field.onChange}
                className="flex gap-4"
              >
                <ToggleGroupItem value="exact_match">
                  Exact Match
                </ToggleGroupItem>
                <ToggleGroupItem value="open_to_all">
                  Open to All
                </ToggleGroupItem>
              </ToggleGroup>
            )}
          />
          {errors.preferredBreeds && (
            <p className="mt-1 text-sm text-red-500">
              {errors.preferredBreeds.message}
            </p>
          )}
        </div>

        {/* Distance Radius */}
        <div className="flex flex-col gap-2">
          <label className="block body_large text-dark-grey">
            Distance Radius
          </label>
          <Controller
            control={control}
            name="distanceRadius"
            render={({ field }) => (
              <ToggleGroup
                type="single"
                value={field.value ?? ""}
                onValueChange={field.onChange}
                className="flex gap-4"
              >
                <ToggleGroupItem value="5">5km</ToggleGroupItem>
                <ToggleGroupItem value="10">10km</ToggleGroupItem>
                <ToggleGroupItem value="20">20km</ToggleGroupItem>
                <ToggleGroupItem value="30-35">30-35km</ToggleGroupItem>
              </ToggleGroup>
            )}
          />
          {errors.distanceRadius && (
            <p className="mt-1 text-sm text-red-500">
              {errors.distanceRadius.message}
            </p>
          )}
        </div>

        {/* Personality Preference */}
        <div className="flex flex-col gap-2">
          <label className="block body_large text-dark-grey">
            Personality Preference
          </label>
          <Controller
            control={control}
            name="personalityPreference"
            render={({ field }) => (
              <ToggleGroup
                type="multiple"
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-wrap gap-3"
              >
                {personalityPreference.map((option) => (
                  <ToggleGroupItem key={option} value={option}>
                    {option}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
          />
          {errors.personalityPreference && (
            <p className="mt-1 text-sm text-red-500">
              {errors.personalityPreference.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={!isValid} suppressHydrationWarning>
          Match Preferences
        </Button>
      </form>
    </div>
  );
};

export default FilterContent;
