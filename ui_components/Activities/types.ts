export interface IActivityCardProps {
  className?: string;
  cards: ICard[];
}

export type ICard = {
  name: string;
  info: string;
  url: string;
  desc: string;
  details: string;
};
