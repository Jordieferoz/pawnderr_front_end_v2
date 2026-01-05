export type PricingType = "monthly" | "annually";

export interface Plan {
  id: number;
  name: string;
  description: string;
  duration_type: string;
  duration_value: number;
  price: string;
  currency: string;
}

export interface PricingCardProps {
  type: PricingType;
  features: string[];
  plan: Plan | null;
}
