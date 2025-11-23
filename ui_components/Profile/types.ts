export interface IProfileCardProps {
  name: string;
  gender: "Male" | "Female";
  age: number;
  breed: string;
  location: string;
  image: string;
}
export interface IInfoCardProps {
  image: string;
  desc: string;
  list?: IInfoCardListItem[];
  title: string;
  type: "list" | "desc";
}

export interface IInfoCardListItem {
  left: string;
  right: string;
}

export interface IProfileHeaderProps {
  title: string;
}
