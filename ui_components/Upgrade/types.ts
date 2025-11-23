export type PricingType = "monthly" | "annually";

export interface PricingCardProps {
  type: PricingType;
  price: string;
  features: string[];
}
