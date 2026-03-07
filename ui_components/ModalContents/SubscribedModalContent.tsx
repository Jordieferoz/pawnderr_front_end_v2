"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { AppDispatch } from "@/store";
import { closeSubscribedModal } from "@/store/modalSlice";
import { getSubscriptionStatus } from "@/store/subscriptionSlice";
import { getGenderColor } from "@/utils";
import { images } from "@/utils/images";

interface SubscribedModalContentProps {
  primaryImage?: string;
  gender?: string;
}

const SubscribedModalContent: FC<SubscribedModalContentProps> = ({
  primaryImage,
  gender = "male"
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const borderColor = getGenderColor(gender);

  useEffect(() => {
    dispatch(getSubscriptionStatus());
  }, [dispatch]);

  const handleViewActivities = () => {
    dispatch(closeSubscribedModal());
    router.push("/activities");
  };

  return (
    <div className="w-full bg-white rounded-2xl px-6 py-8 text-center flex flex-col items-center">
      {/* Crown Icon */}
      <img
        src={images.crownYellowBg.src}
        alt="Premium Crown"
        className="w-16 h-16 mb-4"
      />

      {/* Heading */}
      <h3 className="display4_medium text-accent-900 mb-1">Congratulations!</h3>
      <p className="body_large_medium text-dark-brown mb-9">
        You are now a{" "}
        <span className="text-accent-500 font-semibold">premium member</span>
      </p>

      <div
        className="w-[220px] rounded-2xl border-3 overflow-hidden mb-9"
        style={{ borderColor }}
      >
        <img
          src={primaryImage}
          alt="Happy doggo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* CTA Button */}
      <Button className="w-full" onClick={handleViewActivities}>
        View Activities
      </Button>
    </div>
  );
};

export default SubscribedModalContent;
