"use client";

import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { setStep } from "@/store/profileInfoSlice";
import { fetchSubscriptionStatus } from "@/utils/api";
import { images } from "@/utils/images";

import { BillingHistory, CurrentPlan, SubscriptionHeader } from ".";
import Loader from "../Shared/Loader";

const stepTitles: Record<number, string> = {
  0: "My Subscription",
  1: "Current Plan",
  2: "Billing History"
};

interface SubscriptionData {
  is_premium: boolean;
  subscription: any;
  message: string;
}

const MySubscription: FC = () => {
  const dispatch = useDispatch();
  const step = useSelector((state: RootState) => state.profileInfo.step);

  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);
  const lastFetchRef = useRef<number>(0);

  // Function to refresh subscription data
  const refreshSubscriptionData = async () => {
    try {
      isLoadingRef.current = true;
      lastFetchRef.current = Date.now();
      setLoading(true);
      const resp = await fetchSubscriptionStatus();
      setSubscriptionData(resp.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch subscription status:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load subscription"
      );
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  // Fetch subscription status on component mount
  useEffect(() => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      return;
    }

    const loadSubscriptionStatus = async () => {
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchRef.current;

      // Throttle: Don't fetch if we fetched less than 2 seconds ago
      if (timeSinceLastFetch < 2000) {
        setLoading(false);
        return;
      }

      isLoadingRef.current = true;
      lastFetchRef.current = now;

      try {
        setLoading(true);
        const resp = await fetchSubscriptionStatus();
        setSubscriptionData(resp.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch subscription status:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load subscription"
        );
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    };

    loadSubscriptionStatus();
  }, []);

  // Set first item as default on desktop
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    if (isDesktop && step === 0) {
      dispatch(setStep(1));
    }
  }, [step, dispatch]);

  const currentTitle = stepTitles[step] || "My Subscription";

  // Loading state
  if (loading) {
    return (
      <div className="my_sub_wrapper common_container">
        <div className="mb-7">
          <SubscriptionHeader title="My Subscription" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
            <div className="md:col-span-12 flex items-center justify-center min-h-[400px]">
              <Loader size="lg" text="Loading subscription details..." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="my_sub_wrapper common_container">
        <div className="mb-7">
          <SubscriptionHeader title="My Subscription" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
            <div className="md:col-span-12 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-red-500 text-lg">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my_sub_wrapper common_container">
      <div className="mb-7">
        <SubscriptionHeader
          title={
            step === 0
              ? currentTitle
              : { base: currentTitle, md: "My Subscription" }
          }
        />

        {/* Show centered message for non-premium users */}
        {!subscriptionData?.is_premium ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
            <div className="md:col-span-12 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-xl md:text-2xl font-medium text-light-grey2 mb-6">
                  {subscriptionData?.message || "No active subscription"}
                </p>

                <Link href={"/upgrade"} className="cursor-pointer">
                  <Button>Upgrade to Premium</Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Show normal layout for premium users
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
            {/* Left Sidebar Navigation */}
            <div
              className={`md:col-span-4 ${step === 0 ? "block" : "hidden md:block"}`}
            >
              <ul className="py-5 px-6 md:px-5 bg-white shadow-[0px_4px_16.4px_0px_#0000001A] rounded-lg md:rounded-[40px] mt-6 md:mt-0">
                <li
                  className={`py-4 px-5 border-b md:border-0 md:rounded-full last:border-0 border-grey-700 flex items-center justify-between cursor-pointer transition-colors ${
                    step === 1
                      ? "md:bg-[#DBEAFF] md:text-blue"
                      : "text-light-grey2"
                  }`}
                  onClick={() => dispatch(setStep(1))}
                >
                  <p className="body_large_medium">Current Plan</p>
                  <img
                    src={images.chevronRight.src}
                    className="w-2 block md:hidden"
                    alt="Navigate"
                  />
                </li>
                <li
                  className={`py-4 px-5 border-b md:border-0 md:rounded-full last:border-0 border-grey-700 flex items-center justify-between cursor-pointer transition-colors ${
                    step === 2
                      ? "md:bg-[#DBEAFF] md:text-blue"
                      : "text-light-grey2"
                  }`}
                  onClick={() => dispatch(setStep(2))}
                >
                  <p className="body_large_medium">Billing History</p>
                  <img
                    src={images.chevronRight.src}
                    className="w-2 block md:hidden"
                    alt="Navigate"
                  />
                </li>
              </ul>
            </div>

            <div
              className={`md:col-span-8 ${step === 0 ? "hidden md:hidden" : "block"}`}
            >
              {step === 1 && (
                <CurrentPlan
                  subscriptionData={subscriptionData}
                  onSubscriptionUpdated={refreshSubscriptionData}
                />
              )}
              {step === 2 && <BillingHistory />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubscription;
