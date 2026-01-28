import { CreditCard, FileText, Settings, Shield, User } from "lucide-react";

import { ICard } from "@/ui_components/Activities/types";
import { images } from "@/utils/images";

export const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" }
];

export const energyLevels = ["Chill", "Playful", "Zoomies All Day", "Balanced"];
export const activities = [
  "Belly Rubs/cuddles",
  "Car Rides",
  "Playing Fetch",
  "Sleeping all Day",
  "Going on walks",
  "Swimtime",
  "Rolling in the Grass",
  "Chasing cats, squirrels etc.",
  "Chewing Toys",
  "Digging for treasure"
];
export const vaccinationOptions = [
  { value: "up_to_date", label: "Up to Date" },
  { value: "not_sure", label: "Not Sure" },
  { value: "not_vaccinated", label: "Not Vaccinated" }
];

export const interestedIn = ["Playdate", "Mating", "Dog Party"];
export const playDateVibe = [
  "Party in The Park",
  "Zoomie Zone",
  "Swim & Splash",
  "Home Sweet Home",
  "Restaurant Rendezvous"
];
export const personalityPreference = [
  "The Social Butterfly",
  "The Cuddler",
  "The Adventure Seeker",
  "The Introvert",
  "The Gentle Giant",
  "The Playtime Pro"
];

export const tabs = [
  { id: "likes-me", label: "Who Likes Me", count: 4 },
  { id: "you-like", label: "You Like Them", count: 4 },
  { id: "viewed-profile", label: "Profiles Near Me", count: 0 }
];

export const cardsData: ICard[] = [
  {
    id: 1,
    name: "Buddy",
    info: "(Male, 2 Years)",
    url: images.doggo1.src,
    desc: "A cheerful retriever who loves belly rubs and chasing tennis balls.",
    details:
      "Golden Retriever\nLoves long walks\nFully vaccinated\nWeight: 25kg"
  },
  {
    id: 2,
    name: "Buddy",
    info: "(Male, 2 Years)",
    url: images.doggo1.src,
    desc: "A cheerful retriever who loves belly rubs and chasing tennis balls.",
    details:
      "Golden Retriever\nLoves long walks\nFully vaccinated\nWeight: 25kg"
  },
  {
    id: 3,
    name: "Buddy",
    info: "(Male, 2 Years)",
    url: images.doggo1.src,
    desc: "A cheerful retriever who loves belly rubs and chasing tennis balls.",
    details:
      "Golden Retriever\nLoves long walks\nFully vaccinated\nWeight: 25kg"
  }
];

export const mobileMenuItems = [
  {
    key: "matches",
    label: "Matches",
    href: "/matches",
    img: images.matches.src,
    imgActive: images.matchesActive.src,
    imgWidth: 18
  },
  {
    key: "activities",
    label: "Activities",
    href: "/activities",
    img: images.activities.src,
    imgActive: images.activitiesActive.src,
    imgWidth: 21
  },
  {
    key: "discover",
    label: "Discover",
    href: "/dashboard",
    img: images.discover.src,
    imgActive: images.discoverActive.src,
    imgWidth: 38
  },
  {
    key: "messages",
    label: "Messages",
    href: "/messages",
    img: images.messages.src,
    imgActive: images.messagesActive.src,
    imgWidth: 24
  },
  {
    key: "upgrade",
    label: "Upgrade",
    href: "/upgrade",
    img: images.pawnderr.src,
    imgActive: images.pawnderrActive.src,
    imgWidth: 26
  }
];
export const headerMenuItems = [
  {
    key: "discover",
    label: "Discover",
    href: "/dashboard",
    img: images.discover.src,
    imgActive: images.discoverActive.src,
    imgWidth: 22
  },
  {
    key: "matches",
    label: "Matches",
    href: "/matches",
    img: images.matches.src,
    imgActive: images.matchesActive.src,
    imgWidth: 18
  },
  {
    key: "activities",
    label: "Activities",
    href: "/activities",
    img: images.activities.src,
    imgActive: images.activitiesActive.src,
    imgWidth: 20
  },

  {
    key: "messages",
    label: "Messages",
    href: "/messages",
    img: images.messages.src,
    imgActive: images.messagesActive.src,
    imgWidth: 22
  }
];

export const dropdownMenuItems = [
  { icon: User, label: "My Profile", href: "/profile" },
  { icon: CreditCard, label: "My Subscription", href: "/my-subscription" },
  { icon: Settings, label: "Account Settings", href: "/settings" },
  { icon: Shield, label: "Privacy Policy", href: "/" },
  { icon: FileText, label: "Terms of Service", href: "/" },
  { icon: FileText, label: "Community", href: "/" },
  { icon: FileText, label: "FAQ's", href: "/" },
  { icon: FileText, label: "Safety Tips", href: "/" },
  { icon: FileText, label: "Support", href: "/" }
];
