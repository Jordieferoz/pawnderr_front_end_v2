"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { fetchSubscriptionPlans } from "@/utils/api";
import { images } from "@/utils/images";

import PricingCard from "./PricingCard";
import { PricingType } from "./types";

const FEATURES = [
  "See who sniffed you first",
  "Unlimited right swipes",
  "Premium-only pet profiles",
  "Instant playdate scheduling",
  "Verified good boys & girls only"
];

interface Plan {
  id: number;
  name: string;
  description: string;
  duration_type: string;
  duration_value: number;
  price: string;
  currency: string;
}

const Upgrade = () => {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);
  const [plans, setPlans] = useState<{
    monthly: Plan | null;
    yearly: Plan | null;
  }>({
    monthly: null,
    yearly: null
  });
  const [loading, setLoading] = useState(true);

  const pricingType: PricingType = isAnnual ? "annually" : "monthly";

  useEffect(() => {
    const run = async () => {
      try {
        const resp = await fetchSubscriptionPlans();
        if (resp.data?.plans) {
          const monthlyPlan = resp.data.plans.find(
            (p: Plan) => p.duration_type === "monthly"
          );
          const yearlyPlan = resp.data.plans.find(
            (p: Plan) => p.duration_type === "yearly"
          );

          setPlans({
            monthly: monthlyPlan || null,
            yearly: yearlyPlan || null
          });
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <div className="upgrade_wrapper common_container">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="body_large_medium text-neutral-white">
            Loading plans...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="upgrade_wrapper common_container">
      <div className="flex flex-col gap-5 my-6 md:mb-15">
        <img
          onClick={() => router.back()}
          className="w-10 h-10 md:hidden cursor-pointer"
          src={images.backBtn.src}
          alt="Go back"
        />
        <h4 className="display4_medium text-accent-900">
          Upgrade to <br className="block md:hidden" /> PAWnderr+
        </h4>
        <p className="body_large_medium text-neutral-white">
          More matches. More treats. More <br className="block md:hidden" />{" "}
          tail-wagging perks.
        </p>
      </div>
      <div className="flex items-center gap-3 mb-4 md:hidden">
        <h3 className="heading3 text-dark-brown">Monthly</h3>
        <Switch
          id="billing-period"
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
        <h3 className="heading3 text-dark-brown">Annually</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mb-8 gap-12">
        <div className="">
          <PricingCard
            type={pricingType}
            plan={isAnnual ? plans.yearly : plans.monthly}
            features={FEATURES}
          />
        </div>
        <div className="hidden md:block">
          <PricingCard
            type={"annually"}
            plan={plans.yearly}
            features={FEATURES}
          />
        </div>
      </div>
      <Button className="w-full md:hidden">Go Premium</Button>
    </div>
  );
};

export default Upgrade;
