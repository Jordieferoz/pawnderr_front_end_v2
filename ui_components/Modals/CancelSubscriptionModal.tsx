"use client";

import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { InputField } from "@/ui_components/Shared";
import { cancelSubscription } from "@/utils/api";
import { showToast } from "../Shared/ToastMessage";

interface CancelSubscriptionModalProps {
  onCancel: () => void;
  onSuccess: () => void;
}

interface CancelFormValues {
  cancellation_reason?: string;
}

const CancelSubscriptionModal: FC<CancelSubscriptionModalProps> = ({
  onCancel,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CancelFormValues>({
    defaultValues: {
      cancellation_reason: ""
    }
  });

  const onSubmit = async (data: CancelFormValues) => {
    setIsSubmitting(true);

    try {
      const payload: { cancellation_reason?: string } = {};
      if (data.cancellation_reason?.trim()) {
        payload.cancellation_reason = data.cancellation_reason.trim();
      }

      await cancelSubscription(payload);

      showToast({
        type: "success",
        message: "Subscription cancelled successfully"
      });

      onSuccess();
    } catch (error: any) {
      console.error("Failed to cancel subscription:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to cancel subscription. Please try again.";

      showToast({
        type: "error",
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Cancel Subscription
        </h2>
        <p className="text-sm text-gray-600">
          Are you sure you want to cancel your subscription? Your subscription
          will remain active until the end of the current billing period.
        </p>
      </div>

      <form
        className="mb-6 flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="relative">
          <Controller
            control={control}
            name="cancellation_reason"
            render={({ field }) => (
              <InputField
                label="Reason for cancellation (Optional)"
                placeholder="e.g., Not using the app frequently"
                type="text"
                {...field}
                aria-invalid={Boolean(errors.cancellation_reason)}
                aria-describedby={
                  errors.cancellation_reason
                    ? "cancellation-reason-error"
                    : undefined
                }
              />
            )}
          />
          {errors.cancellation_reason && (
            <p
              id="cancellation-reason-error"
              className="mt-1 text-sm text-red-500"
            >
              {errors.cancellation_reason.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:justify-center">
          <Button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full md:w-auto bg-gray-200 text-gray-800 hover:bg-gray-300 border-gray-300 shadow-none"
          >
            Keep Subscription
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto"
            suppressHydrationWarning
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Cancelling...
              </span>
            ) : (
              "Cancel Subscription"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CancelSubscriptionModal;
