import { ICard } from "@/ui_components/Activities/types";
import { images } from "@/utils/images";

export const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
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
  "Digging for treasure",
];
export const vaccinationOptions = [
  { value: "up_to_date", label: "Up to Date" },
  { value: "not_sure", label: "Not Sure" },
  { value: "not_vaccinated", label: "Not Vaccinated" },
];

export const interestedIn = ["Playdate", "Mating", "Dog Party"];
export const playDateVibe = [
  "Party in The Park",
  "Zoomie Zone",
  "Swim & Splash",
  "Home Sweet Home",
  "Restaurant Rendezvous",
];
export const personalityPreference = [
  "The Social Butterfly",
  "The Cuddler",
  "The Adventure Seeker",
  "The Introvert",
  "The Gentle Giant",
  "The Playtime Pro",
];

export const tabs = [
  { id: "likes-me", label: "Likes Me", count: 4 },
  { id: "you-like", label: "You Like", count: 4 },
  { id: "viewed-profile", label: "Who viewed Profile", count: 0 },
  { id: "suitable-1", label: "Suitable", count: 10 },
  { id: "suitable-2", label: "Suitable", count: 10 },
  { id: "suitable-3", label: "Suitable", count: 10 },
];

export const cardsData: ICard[] = [
  {
    name: "Buddy",
    info: "(Male, 2 Years)",
    url: images.doggo1.src,
    desc: "A cheerful retriever who loves belly rubs and chasing tennis balls.",
    details:
      "Golden Retriever\nLoves long walks\nFully vaccinated\nWeight: 25kg",
  },
  {
    name: "Buddy",
    info: "(Male, 2 Years)",
    url: images.doggo1.src,
    desc: "A cheerful retriever who loves belly rubs and chasing tennis balls.",
    details:
      "Golden Retriever\nLoves long walks\nFully vaccinated\nWeight: 25kg",
  },
  {
    name: "Buddy",
    info: "(Male, 2 Years)",
    url: images.doggo1.src,
    desc: "A cheerful retriever who loves belly rubs and chasing tennis balls.",
    details:
      "Golden Retriever\nLoves long walks\nFully vaccinated\nWeight: 25kg",
  },
];
