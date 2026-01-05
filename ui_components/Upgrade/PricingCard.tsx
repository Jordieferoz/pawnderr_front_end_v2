import { FC } from "react";

import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";

import { PricingCardProps } from "./types";

const PricingCard: FC<PricingCardProps> = ({
  type,
  features,
  plan,
  onSubscribe,
  processingPlanId
}) => {
  const formatPrice = () => {
    if (!plan) return "Price unavailable";

    const amount = parseFloat(plan.price);
    const currencySymbol = plan.currency === "INR" ? "₹" : plan.currency;
    const period = type === "annually" ? "/Year" : "/Month";

    return `${currencySymbol}${amount.toFixed(0)}${period}`;
  };

  const handleClick = () => {
    if (plan && onSubscribe && processingPlanId === null) {
      onSubscribe(plan.id);
    }
  };

  const isProcessing = processingPlanId === plan?.id;
  const isAnyProcessing = processingPlanId !== null;

  return (
    <div
      className={`py-8 px-6 rounded-4xl ${
        type === "annually"
          ? " border bg-white border-primary-500"
          : "bg-primary-500"
      }`}
    >
      <div className="flex items-center gap-2 mb-5">
        <img src={images.pawYellow.src} className="w-6" alt="pawnderr" />
        <h2
          className={`heading2_medium ${type === "annually" ? "text-dark-grey" : "text-white"}`}
        >
          {formatPrice()}
        </h2>
      </div>
      <ul className={`flex flex-col gap-4 md:pl-5`}>
        {features.map((feature, idx) => (
          <li
            key={idx}
            className={`heading4 ${type === "annually" ? "text-dark-grey" : "text-white"} flex items-center gap-2.5`}
          >
            <img
              className="w-6"
              src={
                type === "annually"
                  ? images.starBlack.src
                  : images.starWhite.src
              }
              alt="billing"
            />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        className="w-[calc(100%-80px)] mx-auto hidden md:flex mt-11"
        onClick={handleClick}
        disabled={!plan || isAnyProcessing}
      >
        {isProcessing ? "Processing..." : "Go Premium"}
      </Button>
    </div>
  );
};

export default PricingCard;
