export interface IActivityCardProps {
  className?: string;
  cards: ICard[];
  onMiddleAction?: (card: ICard) => void;
}

export type ICard = {
  id: number;
  name: string;
  info: string;
  url: string;
  desc: string;
  details: string;
};
