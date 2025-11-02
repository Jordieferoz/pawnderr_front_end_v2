import addMore from "public/assets/images/add_more.svg";
import addPetPhoto from "public/assets/images/add_pet_photo.svg";
import authPattern from "public/assets/images/auth_pattern.svg";
import backBtn from "public/assets/images/back.svg";
import facebook from "public/assets/images/facebook.svg";
import google from "public/assets/images/google.svg";
import logo from "public/assets/images/logo.svg";
import x from "public/assets/images/x.svg";

export type ImageType =
  | "logo"
  | "authPattern"
  | "google"
  | "facebook"
  | "x"
  | "addPetPhoto"
  | "addMore"
  | "backBtn";

export type NextImage = {
  src: string;
  height: number | string;
  width: number | string;
};

export const images: Record<ImageType, NextImage> = {
  logo,
  authPattern,
  google,
  facebook,
  x,
  backBtn,
  addPetPhoto,
  addMore,
};
