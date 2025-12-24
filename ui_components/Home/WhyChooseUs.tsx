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
    <section className="w-full bg-primary-500 relative my-30 py-10 flex items-center justify-center">
      <img
        src={images.blueTopPattern.src}
        alt="top"
        className="absolute -top-26 left-0 w-full"
      />
      <img
        src={images.blueBottomPattern.src}
        alt="top"
        className="absolute -bottom-26 left-0 w-full"
      />
      <img
        src={images.blueLeftShape.src}
        alt="top"
        className="absolute -top-8 left-0"
      />
      <img
        src={images.blueRightShape.src}
        alt="top"
        className="absolute -bottom-15 right-10"
      />

      <div className="container mx-auto px-4 md:px-0 relative z-10">
        <div className="mb-10">
          <h3 className="md:text-[60px] font_fredoka font-medium text-white text-center mb-4">
            Why Choose PAWnderr
          </h3>
          <p className="text-xl font-semibold text-center text-white">
            A trusted space where pets connect, play, <br /> and build
            friendships
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-16 items-center relative">
          <div className="space-y-6 lg:space-y-8 relative z-10">
            <div className="space-y-6">
              <div className="mb-16">
                <h3 className="text-[32px] font_fredoka font-semibold text-accent-500 mb-2">
                  For Their Happiness
                </h3>
                <p className="body_regular text-blue-100">
                  Nuclear families and hectic lives often leave pets lonely.
                  This community keeps them happily connected.
                </p>
              </div>

              <div>
                <h3 className="text-[32px] font_fredoka font-semibold text-accent-500 mb-2">
                  Local Playdates
                </h3>
                <p className="body_regular text-blue-100">
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
            className=" scale-150 relative top-20"
          />

          <div>
            <h3 className="text-[32px] font_fredoka font-semibold text-accent-500 mb-2">
              Personalized Matching
            </h3>
            <p className="body_regular text-blue-100 mb-8">
              Set your preferences and let us suggest <br /> the best companions
              for your pet.
            </p>
            <Button onClick={handleCreateAccount} className="font-medium px-20">
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
