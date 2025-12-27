"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { images } from "@/utils/images";

const LoyalCompanions = () => {
  const router = useRouter();

  const handleCreateAccount = () => {
    router.push("/sign-up");
  };

  return (
    <section className="min-h-screen pt-10 relative">
      <div className="container mx-auto px-5 md:px-0">
        <div className="flex flex-col md:flex-row">
          <div className="basis-[100vw] md:basis-[55vw]">
            <h3 className="text-[32px] leading-[38px] text-center md:text-[49px] md:leading-[52px] font_fredoka font-medium text-dark-brown md:text-left mb-9">
              Loyal Companions, <br className="hidden md:block" /> Just Like
              Yours
            </h3>
            <p className="text-center md:text-left text-light-grey2 text-xl font-medium font_fredoka mb-10 text-balance">
              Finding the right match shouldn’t be a guessing game. At{" "}
              <br className="hidden md:block" /> PAWnderr, every profile is
              carefully reviewed to connect genuine
              <br className="hidden md:block" />
              pet parents who want their companions to enjoy meaningful{" "}
              <br className="hidden md:block" />
              friendships. No distractions, just real connections.
            </p>
            <Button
              onClick={handleCreateAccount}
              className="font-medium px-20 mb-10 hidden md:block"
            >
              Create Account
            </Button>
            <img
              src={images.companionDogs.src}
              alt="companion dogs"
              className="w-full md:scale-125"
            />
          </div>
          <div className="bg-white mt-10 md:mt-0 basis-[100vw] md:basis-[40vw] flex flex-col gap-5">
            <div className="px-5.5 py-6 bg-white rounded-lg border-4 border-[#67D6AD]">
              <h6 className="mb-1.5 font-medium font_fredoka text-dark-brown text-2xl">
                Interests Match:
              </h6>
              <p className="text-xl font-medium mb-5 text-dark-brown/60">
                Shared love for playtime, walks, <br /> and favorite treats.
              </p>
              <div className="relative">
                <Progress
                  value={50}
                  baseColor="bg-grey-1100"
                  highlightColor="#489A7C"
                />
                <p className="text-accent-900 font-medium font_fredoka text-2xl absolute right-0 -top-10">
                  58%
                </p>
              </div>
            </div>
            <div className="px-5.5 py-6 bg-white rounded-lg border-4 border-secondary-300">
              <h6 className="mb-1.5 font-medium font_fredoka text-dark-brown text-2xl">
                Habits Match:
              </h6>
              <p className="text-xl font-medium mb-5 text-dark-brown/60">
                He enjoys early morning activity, she prefers <br /> afternoon
                rest; a good balance.
              </p>
              <div className="relative">
                <Progress
                  value={92}
                  baseColor="bg-grey-1100"
                  highlightColor="bg-accent-500"
                />
                <p className="text-accent-900 font-medium font_fredoka text-2xl absolute right-0 -top-10">
                  92%
                </p>
              </div>
            </div>
            <div className="px-5.5 py-6 bg-white rounded-lg border-4 border-secondary-400">
              <h6 className="mb-1.5 font-medium font_fredoka text-dark-brown text-2xl">
                Personality Match:
              </h6>
              <p className="text-xl font-medium mb-5 text-dark-brown/60">
                Both pets are gentle and affectionate, <br /> preferring calm
                over chaos.
              </p>
              <div className="relative">
                <Progress
                  value={74}
                  baseColor="bg-grey-1100"
                  highlightColor="#7766FF"
                />
                <p className="text-accent-900 font-medium font_fredoka text-2xl absolute right-0 -top-10">
                  74%
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleCreateAccount}
            className="font-medium px-20 mt-10 block md:hidden"
          >
            Create Account
          </Button>
        </div>
      </div>

      <img
        src={images.loyalRibbon.src}
        className="absolute -top-63 right-6 -z-10 w-[16vw]"
        alt="ribbon"
      />
    </section>
  );
};

export default LoyalCompanions;
