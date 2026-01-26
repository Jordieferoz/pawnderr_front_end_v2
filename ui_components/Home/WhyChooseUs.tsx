"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";

const WhyChooseUs = () => {
  const router = useRouter();

  const handleCreateAccount = () => {
    router.push("/sign-up");
  };

  return (
    <section
      className="w-full bg-primary-500 relative my-10 md:my-30 py-10 flex items-center justify-center scroll-mt-[120px]"
      id="why-pawnderr"
    >
      <img
        src={images.blueTopPattern.src}
        alt="top"
        className="absolute -top-26 left-0 w-full hidden md:block"
      />
      <img
        src={images.blueBottomPattern.src}
        alt="top"
        className="absolute -bottom-26 left-0 w-full hidden md:block"
      />
      <img
        src={images.blueLeftShape.src}
        alt="top"
        className="absolute top-8 md:-top-8 left-0 md:w-auto w-[40vw]"
      />
      <img
        src={images.blueRightShape.src}
        alt="top"
        className="absolute bottom-10 right-4 md:w-auto w-[40vw]"
      />

      <div className="container mx-auto px-4 md:px-0 relative z-10">
        <div className="mb-10">
          <h3 className="text-[38px] md:text-[60px] font_fredoka font-medium text-white text-center mb-4">
            Why Choose PAWnderr
          </h3>
          <p className="text-lg md:text-xl font-semibold text-center text-white">
            A trusted space where pets connect, play, <br /> and build
            friendships
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-16 items-center relative">
          <div className="space-y-6 lg:space-y-8 relative z-10 order-1">
            <div className="space-y-6">
              <div className="mb-8 md:mb-16">
                <h3 className="text-[32px] font_fredoka text-center md:text-left font-semibold text-accent-500 mb-2">
                  For Their Happiness
                </h3>
                <p className="body_regular text-blue-100 text-center md:text-left">
                  Nuclear families and hectic lives often leave pets lonely.
                  This community keeps them happily connected.
                </p>
              </div>

              <div>
                <h3 className="text-[32px] font_fredoka font-semibold text-accent-500 mb-2 text-center md:text-left">
                  Local Playdates
                </h3>
                <p className="body_regular text-blue-100 text-center md:text-left">
                  Connect with pets nearby for walks and social time at local
                  parks.
                </p>
              </div>
            </div>
          </div>
          {/* empty */}
          <img
            src={images.whyChooseDogs.src}
            alt="top"
            className="md:scale-150 relative md:top-20 order-3 md:order-2"
          />

          <div className="order-2 md:order-3">
            <h3 className="text-[32px] font_fredoka font-semibold text-accent-500 mb-2 text-center md:text-left">
              Personalized Matching
            </h3>
            <p className="body_regular text-blue-100 text-center md:text-left mb-8">
              Set your preferences and let us suggest <br /> the best companions
              for your pet.
            </p>
            <Button
              onClick={handleCreateAccount}
              className="font-medium md:w-auto w-full md:px-20"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
