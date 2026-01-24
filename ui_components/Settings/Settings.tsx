"use client";

import { images } from "@/utils/images";
import { FC, useEffect, useState } from "react";
import PersonalInfo from "./PersonalInfo";
import SettingsHeader from "./SettingsHeader";

const stepTitles: Record<number, string> = {
  0: "Settings",
  1: "Personal Information"
};

const Settings: FC = () => {
  // Step 0: Menu (Mobile), Step 1+: Content
  const [step, setStep] = useState(0);

  // Set first item as default on desktop
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768; // md breakpoint
    if (isDesktop && step === 0) {
      setStep(1);
    }
  }, [step]);

  // Handle window resize to auto-select step 1 on desktop if on step 0
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      if (isDesktop && step === 0) {
        setStep(1);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [step]);

  const currentTitle = stepTitles[step] || "Settings";

  const handleBack = () => {
    if (window.innerWidth < 768 && step !== 0) {
      setStep(0);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="settings_wrapper common_container">
      <div className="mb-7">
        <SettingsHeader
          title={
            step === 0 ? currentTitle : { base: currentTitle, md: "Settings" }
          }
          onBack={handleBack}
        />

        {/* Desktop: Grid layout with sidebar and content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
          {/* Left Sidebar Navigation - Always visible on desktop, only when step=0 on mobile */}
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
                onClick={() => setStep(1)}
              >
                <p className="body_large_medium">Personal Information</p>
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
            {step === 1 && <PersonalInfo />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
