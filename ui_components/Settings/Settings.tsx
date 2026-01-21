"use client";

import { images } from "@/utils/images";
import { FC, useEffect, useState } from "react";
import PersonalInfo from "./PersonalInfo";

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

  return (
    <div className="settings_wrapper common_container">
      <div className="mb-7">
        {/* We might need a custom header or wrapped header because ProfileHeader is coupled to Redux for mobile back button */}
        {/* For now, let's use a simplified header structure matching EditProfile but handling back manually if possible, 
             OR we just assume ProfileHeader is what we want BUT it uses Redux.
             The ProfileHeader accepts title/desc. The back button logic in ProfileHeader imports dispatch.
             
             Let's re-read ProfileHeader.
             It imports useSelector and useDispatch. 
             If I use it here, it will try to read state.profileInfo.step which is 0 or whatever from Redux.
             The back button on mobile:
             if (step !== 0) dispatch(setStep(0)) else router.back().
             
             Since 'step' in Redux is likely unrelated to this Settings page, we might have a conflict if we rely on ProfileHeader's internal back logic involving Redux.
             A generic Header would be better.
             
             However, I can just create the UI directly here to avoid the coupling.
         */}

        <div className="relative my-4">
          <div className="flex items-center gap-3">
            <img
              src={images.backBtn.src}
              alt="back"
              className="w-10 h-10 rounded-full cursor-pointer"
              role="button"
              aria-label="Go back"
              onClick={() => {
                if (window.innerWidth < 768 && step !== 0) {
                  setStep(0);
                } else {
                  // Go back to previous page
                  window.history.back();
                }
              }}
            />

            <div className="flex-1 relative">
              <h4 className="display4_medium text-accent-900 md:hidden">
                {step === 0 ? "Settings" : currentTitle}
              </h4>
              <h4 className="display4_medium text-accent-900 pr-16 hidden md:block">
                Settings
              </h4>
            </div>
          </div>
        </div>

        {/* Desktop: Grid layout with sidebar and content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-16">
          {/* Left Sidebar Navigation - Always visible on desktop, only when step=0 on mobile */}
          <div
            className={`md:col-span-4 ${step === 0 ? "block" : "hidden md:block"}`}
          >
            <ul className="py-5 px-6 md:px-5 bg-white shadow-[0px_4px_16.4px_0px_#0000001A] rounded-lg md:rounded-[40px]">
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
