import activities from "public/assets/images/activities.svg";
import activitiesActive from "public/assets/images/activities_active.svg";
import addMore from "public/assets/images/add_more.svg";
import addPetPhoto from "public/assets/images/add_pet_photo.svg";
import alert from "public/assets/images/alert.svg";
import attachment from "public/assets/images/attachment.svg";
import authPattern from "public/assets/images/auth_pattern.svg";
import backBtn from "public/assets/images/back.svg";
import block from "public/assets/images/block.svg";
import chatYellow from "public/assets/images/chat_yellow.svg";
import chevronRight from "public/assets/images/chevron_right.svg";
import chevronRightGrey from "public/assets/images/chevron_right_grey.svg";
import discover from "public/assets/images/discover.svg";
import discoverActive from "public/assets/images/discover_active.svg";
import dislike from "public/assets/images/dislike.svg";
import doggo1 from "public/assets/images/doggo1.png";
import doggo2 from "public/assets/images/doggo2.png";
import doggo3 from "public/assets/images/doggo3.png";
import doggo4 from "public/assets/images/doggo4.png";
import doggo5 from "public/assets/images/doggo5.png";
import doggoProfilePlaceholder from "public/assets/images/doggo_profile_placeholder.png";
import editIcon from "public/assets/images/edit_icon.svg";
import ellipsisHorizontal from "public/assets/images/ellipsis_horizontal.svg";
import eyeBlue from "public/assets/images/eye_blue.svg";
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
import pawnderrPlus from "public/assets/images/pawnderr_plus.svg";
import searchGrey from "public/assets/images/search_grey.svg";
import send from "public/assets/images/send.svg";
import smiley from "public/assets/images/smiley.svg";
import starBlack from "public/assets/images/star_black.svg";
import starWhite from "public/assets/images/star_white.svg";
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
  | "pawnderrPlus"
  | "editIcon"
  | "starWhite"
  | "starBlack"
  | "chevronRight"
  | "searchGrey"
  | "ellipsisHorizontal"
  | "send"
  | "smiley"
  | "attachment"
  | "alert"
  | "block"
  | "chevronRightGrey"
  | "eyeBlue"
  | "chatYellow"
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
  pawnderrPlus,
  editIcon,
  starWhite,
  starBlack,
  chevronRight,
  searchGrey,
  ellipsisHorizontal,
  send,
  smiley,
  attachment,
  alert,
  block,
  chevronRightGrey,
  eyeBlue,
  chatYellow,
};
