"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FC } from "react";

const BlockModalContent: FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl px-4 py-6 text-center">
      <h5 className="mb-2.5 display4_medium text-accent-900">Block Match</h5>

      <p className="body_large_medium text-dark-brown mb-8.5">
        Your match will be blocked. Are you sure you want to block this Match?
      </p>

      <RadioGroup className="mt-6 flex flex-col items-center">
        <div className="flex items-center justify-between gap-3">
          <RadioGroupItem
            value="report-before-block"
            id="report-before-block"
          />
          <span className="text-light-grey2 heading4">
            I want to report this user before blocking.
          </span>
        </div>
      </RadioGroup>

      <div className="mt-11">
        <Button className="w-full">Block</Button>
      </div>
    </div>
  );
};

export default BlockModalContent;
