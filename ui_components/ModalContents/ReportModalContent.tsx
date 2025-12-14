"use client";

import { FC } from "react";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const REPORT_OPTIONS = [
  "Spam",
  "Harassment",
  "Hate Speech / Discrimination",
  "Violence / Threats",
  "Inappropriate / Explicit Content",
  "Misinformation",
  "Scam / Fraud",
  "Impersonation",
  "Other / Not Listed",
];

const ReportModalContent: FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl px-4 py-6">
      <RadioGroup className="flex flex-col gap-10">
        {REPORT_OPTIONS.map((option) => (
          <div
            key={option}
            className="flex items-center justify-between w-full"
          >
            <span className="heading4 text-dark-grey/70">{option}</span>

            <RadioGroupItem value={option} id={option} />
          </div>
        ))}
      </RadioGroup>

      <div className="mt-10">
        <Button className="w-full">Report</Button>
      </div>
    </div>
  );
};

export default ReportModalContent;
