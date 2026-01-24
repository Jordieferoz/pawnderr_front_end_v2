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
    <div className="relative min-h-[100dvh] px-5 py-6 md:px-8 pb-20 md:pb-6">
      <div className="container">
        <Link
          href={"/register"}
          className="mb-7.5 md:inline-flex justify-start hidden relative z-20"
        >
          <Image
            src={images.logoHorizontal.src}
            className="logo w-[240px]"
            width={147}
            height={97}
            alt="PAWnderr Logo"
          />
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-[766px] md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] rounded-4xl md:px-20 md:py-10 relative z-20">
        <div className="md:hidden">
          <Progress value={progressValue} highlightColor="#0C16E0" />
        </div>

        <Link
          href={"/register"}
          className="mb-1 mt-6 inline-flex justify-center md:hidden"
        >
          <Image
            src={images.logoHorizontal.src}
            className="logo w-[220px]"
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
      <div className="hidden md:block z-20 fixed right-6 bottom-6">
        <Progress
          variant="circular"
          value={progressValue}
          size={56}
          strokeWidth={5}
          highlightColor="#0C16E0"
        />
      </div>
    </div>
  );
};

export default Register;
