"use client";

import { Progress } from "@/components/ui/progress";
import { RootState } from "@/store";
import { images } from "@/utils/images";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { useSelector } from "react-redux";
import { DoggoPersonalForm, MatchingPetForm, OTP, UserDetailsForm } from ".";

const totalSteps = 5;

const Register: FC = () => {
  const step = useSelector((state: RootState) => state.registration.step);
  const formData = useSelector((state: RootState) => state.registration);
  // console.log(formData, "formData");
  const progressValue = (step / totalSteps) * 100;

  return (
    <div className="relative  px-5 pt-12 pb-20 lg:px-8">
      <div className="mx-auto w-full md:max-w-md">
        <Progress value={progressValue} />

        <Link href={"/"} className="mb-1 mt-6 flex justify-center">
          <Image
            src={images.logo.src}
            className="logo w-30"
            width={120}
            height={80}
            alt="PAWnderr Logo"
          />
        </Link>

        {step === 1 && <UserDetailsForm />}
        {step === 2 && <OTP />}
        {step === 3 && <DoggoPersonalForm />}
        {step === 4 && <MatchingPetForm />}
      </div>
    </div>
  );
};

export default Register;
