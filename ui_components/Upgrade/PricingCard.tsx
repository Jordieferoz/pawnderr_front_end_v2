import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";
import { FC } from "react";
import { PricingCardProps } from "./types";

const PricingCard: FC<PricingCardProps> = ({ type, features }) => {
  const price = type === "annually" ? "₹999/Annually" : "₹199/Month";

  return (
    <div
      className={`py-8 px-6 rounded-4xl ${
        type === "annually"
          ? " border bg-white border-primary-500"
          : "bg-primary-500"
      }`}
    >
      <div className="flex items-center gap-2 mb-5">
        <img src={images.pawYellow.src} className="w-6" />
        <h2
          className={`heading2_medium ${type === "annually" ? "text-dark-grey" : "text-white"}`}
        >
          {price}
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
            />
            {feature}
          </li>
        ))}
      </ul>
      <Button className="w-[calc(100%-80px)] mx-auto hidden md:flex mt-11">
        Go Premium
      </Button>
    </div>
  );
};

export default PricingCard;
