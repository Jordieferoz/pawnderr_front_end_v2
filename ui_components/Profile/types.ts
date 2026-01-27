export interface IProfileCardProps {
  name?: string;
  gender?: string;
  age?: number;
  breed?: string;
  location?: string;
  image?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  showActions?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
}
export interface IInfoCardProps {
  image: string;
  className?: string;
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
  title: string | { base: string; md: string };
  desc?: string | { base: string; md: string };
}

export interface IPetData {
  id: number;
  name: string;
  nickname: string;
  gender: string;
  age: number;
  bark_o_graphy: string;
  fun_fact_or_habit: string;
  vaccination_status: string;
  is_spayed_neutered: boolean;
  breed: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  is_verified: boolean;
  attributes: Array<{
    attribute_id: number;
    attribute_name: string;
    selected_options: Array<{
      option_id: number;
      value: string;
    }>;
  }>;
  images: Array<{
    id: number;
    image_url: string;
    is_primary: boolean;
    display_order: number;
  }>;
  preferences: any;
  user: {
    id: number;
    name: string;
    is_premium_user: boolean;
  };
}

export interface IProfileProps {
  loading: boolean;
  petData: IPetData | null;
  error?: boolean;
}
