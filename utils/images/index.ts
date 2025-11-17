import activities from "public/assets/images/activities.svg";
import activitiesActive from "public/assets/images/activities_active.svg";
import addMore from "public/assets/images/add_more.svg";
import addPetPhoto from "public/assets/images/add_pet_photo.svg";
import authPattern from "public/assets/images/auth_pattern.svg";
import backBtn from "public/assets/images/back.svg";
import discover from "public/assets/images/discover.svg";
import discoverActive from "public/assets/images/discover_active.svg";
import dislike from "public/assets/images/dislike.svg";
import doggo1 from "public/assets/images/doggo1.png";
import doggo2 from "public/assets/images/doggo2.png";
import doggo3 from "public/assets/images/doggo3.png";
import doggo4 from "public/assets/images/doggo4.png";
import doggo5 from "public/assets/images/doggo5.png";
import doggoProfilePlaceholder from "public/assets/images/doggo_profile_placeholder.png";
import facebook from "public/assets/images/facebook.svg";
import filterIcon from "public/assets/images/filter_icon.svg";
import google from "public/assets/images/google.svg";
import like from "public/assets/images/like.svg";
import logo from "public/assets/images/logo.svg";
import matches from "public/assets/images/matches.svg";
import matchesActive from "public/assets/images/matches_active.svg";
import messages from "public/assets/images/messages.svg";
import messagesActive from "public/assets/images/messages_active.svg";
import pawYellow from "public/assets/images/paw_yellow.svg";
import pawnderr from "public/assets/images/pawnderr.svg";
import pawnderrActive from "public/assets/images/pawnderr_active.svg";
import x from "public/assets/images/x.svg";

export type ImageType =
  | "logo"
  | "authPattern"
  | "google"
  | "facebook"
  | "x"
  | "addPetPhoto"
  | "addMore"
  | "doggoProfilePlaceholder"
  | "matches"
  | "matchesActive"
  | "activities"
  | "activitiesActive"
  | "discover"
  | "discoverActive"
  | "messages"
  | "messagesActive"
  | "pawnderr"
  | "pawnderrActive"
  | "doggo1"
  | "doggo2"
  | "doggo3"
  | "doggo4"
  | "doggo5"
  | "dislike"
  | "like"
  | "pawYellow"
  | "filterIcon"
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
  doggoProfilePlaceholder,
  matches,
  matchesActive,
  activities,
  activitiesActive,
  discover,
  discoverActive,
  messages,
  messagesActive,
  pawnderr,
  pawnderrActive,
  doggo1,
  doggo2,
  doggo3,
  doggo4,
  doggo5,
  dislike,
  like,
  pawYellow,
  filterIcon,
};
