"use client";

import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";

import { fetchSubscriptionHistory } from "@/utils/api";
import Loader from "../Shared/Loader";

interface Plan {
  id: number;
  name: string;
  duration_type: string;
  price: string;
  currency: string;
}

interface Payment {
  id: number;
  amount: string;
  status: string;
  created_at: string;
}

interface BillingHistoryItem {
  id: number;
  plan_id: number;
  plan_type: string;
  start_date: string;
  end_date: string;
  status: string;
  auto_renew: boolean;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  plan: Plan;
  payment: Payment;
}

interface BillingHistoryData {
  subscriptions: BillingHistoryItem[];
  total: number;
  message?: string;
}

const BillingHistory: FC = () => {
  const [billingHistory, setBillingHistory] =
    useState<BillingHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);
  const lastFetchRef = useRef<number>(0);

  useEffect(() => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      return;
    }

    const loadBillingHistory = async () => {
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
        setError(null);
        const response = await fetchSubscriptionHistory();
        setBillingHistory(response.data);
      } catch (err) {
        console.error("Failed to fetch billing history:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load billing history"
        );
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    };

    loadBillingHistory();
  }, []);

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

  if (loading) {
    return (
      <div className="bg-white shadow-[0px_4px_16.4px_0px_#0000001A] p-8 md:rounded-[40px] rounded-lg">
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader size={40} text="Loading billing history..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-[0px_4px_16.4px_0px_#0000001A] p-8 md:rounded-[40px] rounded-lg mt-10 md:mt-0">
        <div className="text-center py-8">
          <p className="text-red-500 heading4_medium">{error}</p>
        </div>
      </div>
    );
  }

  if (
    !billingHistory?.subscriptions ||
    billingHistory.subscriptions.length === 0
  ) {
    return (
      <div className="bg-white shadow-[0px_4px_16.4px_0px_#0000001A] p-8 md:rounded-[40px] rounded-lg mt-10 md:mt-0">
        <div className="text-center py-8">
          <p className="text-light-grey2 heading4_medium">
            {billingHistory?.message || "No billing history found"}
          </p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string, currency: string): string => {
    const numPrice = parseFloat(price);
    if (currency === "INR") {
      return `₹${numPrice.toLocaleString("en-IN")}`;
    }
    return `${currency} ${numPrice.toLocaleString()}`;
  };

  return (
    <div className="bg-white shadow-[0px_4px_16.4px_0px_#0000001A] p-8 md:rounded-[40px] rounded-lg">
      <ul className="flex flex-col divide-y divide-grey-700">
        {billingHistory.subscriptions.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 justify-between heading4_medium text-accent-900 py-4"
          >
            <div className="flex flex-col gap-1 flex-1">
              <span className="font-medium">{item.plan.name}</span>
              <div className="flex flex-col gap-1 text-sm text-light-grey2">
                <span>
                  {formatDate(item.start_date)} - {formatDate(item.end_date)}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      item.status === "active"
                        ? "bg-green-100 text-green-700"
                        : item.status === "expired"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  {item.payment && (
                    <span>
                      Payment:{" "}
                      {formatPrice(item.payment.amount, item.plan.currency)} (
                      {item.payment.status})
                    </span>
                  )}
                </div>
                {item.cancelled_at && (
                  <span className="text-xs">
                    Cancelled: {formatDate(item.cancelled_at)}
                    {item.cancellation_reason &&
                      ` - ${item.cancellation_reason}`}
                  </span>
                )}
              </div>
            </div>
            {item.payment ? (
              <Link
                href={`/invoice/${item.payment.id}`}
                className="text-primary-500 underline whitespace-nowrap ml-4"
              >
                View Invoice
              </Link>
            ) : (
              <span className="text-light-grey2 whitespace-nowrap ml-4">
                No invoice
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BillingHistory;
