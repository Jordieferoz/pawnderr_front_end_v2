"use client";

import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { setStep } from "@/store/profileInfoSlice";
import { CancelSubscriptionModal } from "@/ui_components/Modals";
import { Modal } from "@/ui_components/Shared";
import { images } from "@/utils/images";

interface Plan {
  id: number;
  name: string;
  duration_type: string;
  price: string;
  currency: string;
}

interface Subscription {
  id: number;
  plan: Plan;
  status: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  expires_at: string;
}

interface SubscriptionData {
  is_premium: boolean;
  subscription: Subscription | null;
  message?: string;
}

interface CurrentPlanProps {
  subscriptionData: SubscriptionData | null;
  onSubscriptionUpdated?: () => void;
}

const CurrentPlan: FC<CurrentPlanProps> = ({
  subscriptionData,
  onSubscriptionUpdated
}) => {
  const dispatch = useDispatch();
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    dispatch(setStep(1));
  }, [dispatch]);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: string, currency: string): string => {
    const numPrice = parseFloat(price);
    if (currency === "INR") {
      return `₹${numPrice.toLocaleString("en-IN")}`;
    }
    return `${currency} ${numPrice.toLocaleString()}`;
  };

  const getDurationLabel = (durationType: string): string => {
    return durationType === "yearly" ? "Year" : "Month";
  };

  const getPlanDisplayName = (plan: Plan): string => {
    if (plan.name) {
      return plan.name;
    }
    return plan.duration_type === "yearly" ? "Annual Plan" : "Monthly Plan";
  };

  if (!subscriptionData?.subscription) {
    return (
      <div className="bg-white shadow-[0px_4px_16.4px_0px_#0000001A] p-8 md:rounded-[40px] rounded-lg mt-10 md:mt-0">
        <div className="text-center py-8">
          <p className="text-light-grey2 heading4_medium">
            {subscriptionData?.message || "No active subscription"}
          </p>
        </div>
      </div>
    );
  }

  const subscription = subscriptionData.subscription;
  const plan = subscription.plan;
  const isCancelled = subscription.cancelled_at !== null;
  const isExpired = subscription.status === "expired";

  return (
    <div className="bg-white shadow-[0px_4px_16.4px_0px_#0000001A] p-8 md:rounded-[40px] rounded-lg mt-10 md:mt-0">
      <div className="flex items-center justify-between gap-3 pb-7 border-b border-grey-700">
        <img src={images.pawYellowBlueBg.src} alt="plan" className="w-20" />
        <div>
          <p className="text-lg md:text-xl font-medium text-accent-900 font_fredoka mb-1.5">
            {getPlanDisplayName(plan)}
          </p>
          <p className="text-neutral-white heading4_medium text-right">
            {formatPrice(plan.price, plan.currency)}/
            {getDurationLabel(plan.duration_type)}
          </p>
        </div>
      </div>
      <ul className="mt-4 mb-8 flex flex-col gap-4">
        <li className="flex items-center gap-2 justify-between heading4_medium text-accent-900">
          Start Date:{" "}
          <span className="text-neutral-white">
            {formatDate(subscription.start_date)}
          </span>
        </li>
        <li className="flex items-center gap-2 justify-between heading4_medium text-accent-900">
          {isExpired || isCancelled ? "Expired Date:" : "Subscription Due:"}
          <span className="text-neutral-white">
            {formatDate(subscription.end_date || subscription.expires_at)}
          </span>
        </li>
        {subscription.status && (
          <li className="flex items-center gap-2 justify-between heading4_medium text-accent-900">
            Status:{" "}
            <span
              className={`${
                subscription.status === "active"
                  ? "text-green-500"
                  : subscription.status === "expired"
                    ? "text-red-500"
                    : "text-orange-500"
              }`}
            >
              {subscription.status.charAt(0).toUpperCase() +
                subscription.status.slice(1)}
            </span>
          </li>
        )}
        {subscription.auto_renew !== undefined && (
          <li className="flex items-center gap-2 justify-between heading4_medium text-accent-900">
            Auto Renew:{" "}
            <span className="text-neutral-white">
              {subscription.auto_renew ? "Enabled" : "Disabled"}
            </span>
          </li>
        )}
      </ul>
      {!isCancelled && !isExpired && (
        <Button
          className="w-full md:w-auto mb-3 md:mx-auto block md:px-20"
          onClick={() => setShowCancelModal(true)}
        >
          Cancel Subscription
        </Button>
      )}

      {/* Cancel Subscription Modal */}
      <Modal
        open={showCancelModal}
        setOpen={setShowCancelModal}
        content={
          <CancelSubscriptionModal
            onCancel={() => setShowCancelModal(false)}
            onSuccess={() => {
              setShowCancelModal(false);
              // Refresh subscription data
              if (onSubscriptionUpdated) {
                onSubscriptionUpdated();
              }
            }}
          />
        }
        className="max-w-md"
      />
    </div>
  );
};

export default CurrentPlan;
