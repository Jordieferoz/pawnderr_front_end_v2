import { IPetData } from "../Profile/types";

export type NearbyPet = {
  id: number;
  name: string;
  nickname: string;
  age: number;
  gender: string;
  bark_o_graphy: string;
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
};

export interface ISwipingCardsProps {
  petData: IPetData | null;
  loading: boolean;
  isSubscribed: boolean;
}
