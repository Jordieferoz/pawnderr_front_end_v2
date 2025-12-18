"use client";

import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { useSelector } from "react-redux";

import { Progress } from "@/components/ui/progress";
import { RootState } from "@/store";
import { images } from "@/utils/images";

import { DoggoPersonalForm, MatchingPetForm, OTP, UserDetailsForm } from ".";

const totalSteps = 5;

const Register: FC = () => {
  const step = useSelector((state: RootState) => state.registration.step);
  // const formData = useSelector((state: RootState) => state.registration);
  console.log(step, "step");
  const progressValue = (step / totalSteps) * 100;

  return (
    <div className="relative min-h-[100dvh] px-5 pt-12 pb-20 md:px-8">
      <Link
        href={"/"}
        className="mb-7.5 md:flex justify-center hidden relative z-20"
      >
        <Image
          src={images.logoBig.src}
          className="w-[250px]"
          width={147}
          height={97}
          alt="PAWnderr Logo"
        />
      </Link>
      <div className="sm:mx-auto sm:w-full sm:max-w-[766px] md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] rounded-4xl md:px-20 md:py-14 relative z-20">
        <div className="md:hidden">
          <Progress value={progressValue} />
        </div>

        <Link href={"/"} className="mb-1 mt-6 flex justify-center md:hidden">
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
      {step === 1 ? (
        <img
          alt=""
          src={images.userFormBg.src}
          className="absolute -top-10 left-0 w-full z-10 pointer-events-none hidden md:block"
        />
      ) : step === 2 ? (
        <img
          alt=""
          src={images.userFormBg.src}
          className="absolute -top-10 left-0 w-full z-10 pointer-events-none hidden md:block"
        />
      ) : step === 3 ? (
        <img
          alt=""
          src={images.userFormBg.src}
          className="absolute -top-10 left-0 w-full z-10 pointer-events-none hidden md:block"
        />
      ) : step === 4 ? (
        <img
          alt=""
          src={images.userFormBg.src}
          className="absolute -top-10 left-0 w-full z-10 pointer-events-none hidden md:block"
        />
      ) : null}
      <div className="hidden md:block fixed right-6 bottom-6">
        <Progress
          variant="circular"
          value={progressValue}
          size={56}
          strokeWidth={5}
        />
      </div>
    </div>
  );
};

export default Register;
