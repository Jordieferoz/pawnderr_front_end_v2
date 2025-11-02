"use client";

import { FC } from "react";
import { useDispatch } from "react-redux";
import { BackBtnRegister } from ".";

export const playDateVibe = [
  "Party in The Park",
  "Zoomie Zone",
  "Swim & Splash",
  "Home Sweet Home",
  "Restaurant Rendezvous",
];

const MatchingPetForm: FC = () => {
  const dispatch = useDispatch();

  //   const {
  //     control,
  //     handleSubmit,
  //     formState: { errors, isValid },
  //   } = useForm<PetMatchingProfileValues>({
  //     resolver: zodResolver(matchingPetSchema),
  //     mode: "onChange",
  //     defaultValues: {
  //       interestedIn: undefined,
  //       playDateVibe: [],
  //       personalityPreference: [],
  //       vaccinationStatus: "",
  //       funFact: "",
  //       barkography: "",
  //     },
  //   });

  //   const onSubmit = (data: PetProfileValues) => {
  //     dispatch(updateStepData({ ...data, step: 4 }));
  //   };

  return (
    <div>
      <BackBtnRegister
        title="What Kind of Pet Are You Looking to Connect With?"
        desc="Tell us what kind of companion would be a great match for your pet."
        note="*Remember: More information = Better matches"
      />
    </div>
  );
};

export default MatchingPetForm;
