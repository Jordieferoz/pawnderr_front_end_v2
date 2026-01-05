// utils/razorpay.ts
interface RazorpayOptions {
  order_id: string;
  amount: number;
  currency: string;
  razorpay_key: string;
  plan: {
    id: number;
    name: string;
    duration_type: string;
    price: string;
  };
  onSuccess: (response: any, planId: number) => void;
  onFailure: (error: any) => void;
}

export const initiateRazorpayPayment = ({
  order_id,
  amount,
  currency,
  razorpay_key,
  plan,
  onSuccess,
  onFailure
}: RazorpayOptions) => {
  const options = {
    key: razorpay_key,
    amount: amount,
    currency: currency,
    name: "PAWnderr",
    description: `${plan.name} - ${plan.duration_type}`,
    order_id: order_id,
    handler: function (response: any) {
      // Payment successful - pass plan_id to onSuccess
      onSuccess(response, plan.id);
    },
    prefill: {
      name: "",
      email: "",
      contact: ""
    },
    theme: {
      color: "#F59E0B" // Your primary color
    },
    modal: {
      ondismiss: function () {
        onFailure({ message: "Payment cancelled by user" });
      }
    }
  };

  const razorpay = new (window as any).Razorpay(options);
  razorpay.on("payment.failed", function (response: any) {
    onFailure(response.error);
  });
  razorpay.open();
};
