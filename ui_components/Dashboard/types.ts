import { IPetData } from "../Profile/types";

export type NearbyPet = {
  id: number;
  name: string;
  nickname: string;
  age: number;
  gender: string;
  bark_o_graphy: string;
  is_founding_dog: boolean;
  is_verified: boolean;
  primary_image: {
    id: number;
    image_url: string;
  };
};

export type ISwipingCard = {
  id: number;
  name: string;
  info: string;
  url: string;
  desc: string;
  gender: string;
  isFoundingDog: boolean;
  isVerified: boolean;
};

export interface ISwipingCardsProps {
  petData: IPetData | null;
  loading: boolean;
  isSubscribed: boolean;
  containerHeight?: number;
}
