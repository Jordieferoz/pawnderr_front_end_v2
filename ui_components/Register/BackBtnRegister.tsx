"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { images } from "@/utils/images";

import { IBackBtnRegisterProps } from "./types";

const BackBtnRegister: FC<IBackBtnRegisterProps> = ({
  title,
  desc,
  note,
  titleClassName,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const step = useSelector((state: RootState) => state.registration.step);

  const handleBackClick = () => {
    if (step === 1) {
      router.back();
    } else {
      dispatch({ type: "registration/setStep", payload: step - 1 });
    }
  };

  return (
    <div className="relative md:static">
      <div className="mb-5 md:absolute md:top-6 md:left-6">
        <Image
          onClick={handleBackClick}
          src={images.backBtn.src}
          alt="back"
          className="w-10 h-10 rounded-full cursor-pointer "
          width={40}
          height={40}
          role="button"
          aria-label="Go back"
        />
      </div>

      <h2
        className={`mb-2 display3 text-accent-900 md:px-18 md:text-center pr-16 md:whitespace-pre-line ${titleClassName ?? ""}`}
      >
        {title}
      </h2>
      <p className="mb-4.5 body_large text-neutral-white md:px-18 md:text-center pr-16 md:whitespace-pre-line">
        {desc}
      </p>
      {note && <p className="text-sm italic md:px-18 md:text-center">{note}</p>}
    </div>
  );
};

export default BackBtnRegister;
