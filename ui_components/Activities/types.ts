export interface IActivityCardProps {
  className?: string;
  cards: ICard[];
  activeTab: "likes-me" | "you-like" | "viewed-profile";
  onLike?: (card: ICard) => void;
  onPass?: (card: ICard) => void;
  onUndo?: (card: ICard) => void;
}

export type ICard = {
  id: number;
  name: string;
  info: string;
  url: string;
  desc: string;
  details: string;
};
