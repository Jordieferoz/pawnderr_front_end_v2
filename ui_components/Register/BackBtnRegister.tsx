"use client";

import { RootState } from "@/store";
import { images } from "@/utils/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBackBtnRegisterProps } from "./types";

const BackBtnRegister: FC<IBackBtnRegisterProps> = ({ title, desc, note }) => {
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
    <div className="relative">
      <div className="cursor-pointer mb-5" onClick={handleBackClick}>
        <Image
          src={images.backBtn.src}
          alt="back"
          className="w-10 h-10 rounded-full"
          width={40}
          height={40}
          role="button"
          aria-label="Go back"
        />
      </div>

      <h2 className="mb-2 display3 text-accent-900 pr-16">{title}</h2>
      <p className="mb-4.5 body_large text-neutral-white pr-16">{desc}</p>
      {note && <p className="text-sm italic">{note}</p>}
    </div>
  );
};

export default BackBtnRegister;
