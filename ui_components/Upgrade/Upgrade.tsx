"use client";

import {
  createSubscriptionOrder,
  fetchSubscriptionFeatures,
  fetchSubscriptionPlans,
  verifySubscriptionPayment
} from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { images } from "@/utils/images";
import { initiateRazorpayPayment } from "@/utils/razorPay";

import { PricingCard } from ".";
import { showToast } from "../Shared/ToastMessage";
import { PricingType } from "./types";

interface Plan {
  id: number;
  name: string;
  description: string;
  duration_type: string;
  duration_value: number;
  price: string;
  currency: string;
}

interface Feature {
  id: number;
  feature_key: string;
  feature_name: string;
  description: string;
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
  const [features, setFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);

  const pricingType: PricingType = isAnnual ? "annually" : "monthly";
  const selectedPlan = isAnnual ? plans.yearly : plans.monthly;

  useEffect(() => {
    const run = async () => {
      try {
        const [plansResp, featuresResp] = await Promise.all([
          fetchSubscriptionPlans(),
          fetchSubscriptionFeatures()
        ]);

        if (plansResp.data?.plans) {
          const monthlyPlan = plansResp.data.plans.find(
            (p: Plan) => p.duration_type === "monthly"
          );
          const yearlyPlan = plansResp.data.plans.find(
            (p: Plan) => p.duration_type === "yearly"
          );

          setPlans({
            monthly: monthlyPlan || null,
            yearly: yearlyPlan || null
          });
        }

        if (featuresResp.data?.features) {
          const featureNames = featuresResp.data.features.map(
            (f: Feature) => f.feature_name
          );
          setFeatures(featureNames);
        }
      } catch (error: any) {
        showToast({
          type: "error",
          message: "Failed to load subscription plans"
        });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const handlePaymentSuccess = async (paymentResponse: any, planId: number) => {
    try {
      const verifyResponse = await verifySubscriptionPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        plan_id: planId
      });

      if (verifyResponse.data) {
        showToast({
          type: "success",
          message: "Subscription activated successfully! 🎉"
        });

        router.push("/dashboard");
      }
    } catch (error) {
      showToast({
        type: "error",
        message: "Payment verification failed. Please contact support."
      });
    } finally {
      setProcessingPlanId(null);
    }
  };

  const handlePaymentFailure = (error: any) => {
    showToast({
      type: "error",
      message: error.message || "Payment failed. Please try again."
    });

    setProcessingPlanId(null);
  };

  const handleSubscribe = async (planId: number) => {
    if (!planId || processingPlanId !== null) return;

    try {
      setProcessingPlanId(planId);
      const response = await createSubscriptionOrder(planId);

      if (response.data) {
        if (!response.data.order_id || !response.data.plan) {
          throw new Error("Invalid response from server");
        }

        initiateRazorpayPayment({
          order_id: response.data.order_id,
          amount: response.data.amount,
          currency: response.data.currency,
          razorpay_key: response.data.razorpay_key,
          plan: response.data.plan,
          onSuccess: handlePaymentSuccess,
          onFailure: handlePaymentFailure
        });
      } else {
        throw new Error("No data received from server");
      }
    } catch (error) {
      showToast({
        type: "error",
        message: "Failed to initiate payment. Please try again."
      });

      setProcessingPlanId(null);
    }
  };

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
      <div className="flex gap-5 my-6 mb-22">
        <img
          onClick={() => router.back()}
          className="w-10 h-10 md:hidden cursor-pointer"
          src={images.backBtn.src}
          alt="Go back"
        />
        <h4 className="display4_medium text-accent-900 relative w-full">
          PAWnderr+
          <span className="body_large_medium text-neutral-white absolute w-full left-0 top-full">
            More matches. More treats. More <br className="block md:hidden" />{" "}
            tail-wagging perks.
          </span>
        </h4>
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
            plan={selectedPlan}
            features={features}
            onSubscribe={handleSubscribe}
            processingPlanId={processingPlanId}
          />
        </div>
        <div className="hidden md:block">
          <PricingCard
            type={"annually"}
            plan={plans.yearly}
            features={features}
            onSubscribe={handleSubscribe}
            processingPlanId={processingPlanId}
          />
        </div>
      </div>
      <Button
        className="w-full md:hidden"
        onClick={() => selectedPlan && handleSubscribe(selectedPlan.id)}
        disabled={!selectedPlan || processingPlanId !== null}
      >
        {processingPlanId === selectedPlan?.id ? "Processing..." : "Go Premium"}
      </Button>
    </div>
  );
};

export default Upgrade;
