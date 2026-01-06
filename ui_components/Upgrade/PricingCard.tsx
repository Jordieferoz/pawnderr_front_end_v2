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
  const getPriceParts = () => {
    if (!plan) return null;

    const amount = parseFloat(plan.price);
    const currencySymbol = plan.currency === "INR" ? "₹" : plan.currency;
    const period = type === "annually" ? "Year" : "Month";

    return { currencySymbol, amount, period };
  };

  const handleClick = () => {
    if (plan && onSubscribe && processingPlanId === null) {
      onSubscribe(plan.id);
    }
  };

  const isProcessing = processingPlanId === plan?.id;
  const isAnyProcessing = processingPlanId !== null;

  const price = getPriceParts();

  return (
    <div
      className={`p-8 rounded-4xl ${
        type === "annually"
          ? "border bg-white border-primary-500"
          : "bg-primary-500"
      }`}
    >
      <div
        className={`flex items-center gap-2 pb-5 border-b border-dashed ${
          type === "annually" ? "border-dark-grey" : " border-white"
        }`}
      >
        <img src={images.crownYellow.src} className="w-10" alt="pawnderr" />

        {price && (
          <h2
            className={`flex items-end gap-1 ${
              type === "annually" ? "text-dark-grey" : "text-white"
            }`}
          >
            {/* Price */}
            <span className="display5_medium">
              {price.currencySymbol}
              {price.amount.toFixed(0)}
            </span>

            {/* Period */}
            <span className="heading2 font_fredoka font-medium mb-2">
              /{price.period}
            </span>
          </h2>
        )}
      </div>

      <ul className="flex flex-col gap-4 pt-5">
        {features.map((feature, idx) => (
          <li
            key={idx}
            className={`heading4 flex items-center gap-2.5 ${
              type === "annually" ? "text-dark-grey" : "text-white"
            }`}
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
