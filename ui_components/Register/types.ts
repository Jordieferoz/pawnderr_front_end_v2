export interface IBackBtnRegisterProps {
  title: string;
  desc: string;
  note?: string;
  titleClassName?: string;
}

// types/registration.ts
export interface RegistrationMetadata {
  categories: Category[];
  breeds: Record<string, Breed[]>;
  attributes: Attribute[];
  preference_types: PreferenceType[];
  vaccination_status_options: Option[];
  pet_gender_options: Option[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  display_order: number;
}

export interface Breed {
  id: number;
  name: string;
  description: string;
  display_order: number;
}

export interface Attribute {
  id: number;
  name: string;
  type: string;
  is_required: boolean;
  min_selections: number;
  max_selections: number | null;
  display_order: number;
  options: AttributeOption[];
}

export interface AttributeOption {
  id: number;
  value: string;
  display_order: number;
}

export interface PreferenceType {
  id: number;
  name: string;
  description: string;
  allow_multiple: boolean;
  display_order: number;
  options: PreferenceOption[];
}

export interface PreferenceOption {
  id: number;
  value: string;
  display_order: number;
}

export interface Option {
  value: string;
  label: string;
}
