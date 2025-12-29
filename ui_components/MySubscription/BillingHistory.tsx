"use client";

import Link from "next/link";
import { FC } from "react";

const BillingHistory: FC = () => {
  return (
    <div className="bg-white shadow-[0px_4px_16.4px_0px_#0000001A] px-5 py-5 md:px-10 md:py-10 md:rounded-[40px] rounded-lg mt-10 md:mt-0">
      <ul className="flex flex-col divide-y divide-grey-700">
        <li className="flex items-center gap-2 justify-between heading4_medium text-accent-900 py-4">
          Last Subscription:
          <Link href={"/"} className="text-primary-500 underline">
            View Invoice
          </Link>
        </li>
        <li className="flex items-center gap-2 justify-between heading4_medium text-accent-900 py-4">
          Subscription Due:
          <Link href={"/"} className="text-primary-500 underline">
            View Invoice
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default BillingHistory;
