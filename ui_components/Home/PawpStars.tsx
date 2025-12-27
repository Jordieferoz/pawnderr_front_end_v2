"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PAWP_STARS_PROFILES } from "@/constants/home";
import { images } from "@/utils/images";

const PawpStars = () => {
  const router = useRouter();

  const handleJoin = () => {
    router.push("/sign-up");
  };

  return (
    <section className="min-h-screen py-10 md:py-20 relative">
      <div className="container mx-auto px-5 md:px-10">
        <h3 className="display4_medium text-center text-dark-brown mb-5">
          Pawp Stars
        </h3>
        <p className="text-center text-light-grey2 text-xl font-semibold mb-8">
          Premium profiles trusted by the <br /> PAWnderr community
        </p>

        <div className="grid md:grid-cols-3 gap-x-10 gap-y-5 mb-20">
          {PAWP_STARS_PROFILES.map((profile) => (
            <div key={profile.id} className="rounded-[32px] relative h-[346px]">
              <div className="img_gradient shadow-[0px_8.25px_16.5px_0px_#00000040] rounded-[32px] absolute inset-0" />
              <img
                src={profile.image}
                className="w-full h-[inherit] object-cover rounded-[32px]"
                alt={profile.name}
              />
              <img
                src={images.premiumYellow.src}
                className="absolute right-5 top-5"
                alt="premium badge"
              />
              <div className="px-2 md:px-6 absolute bottom-6.5 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] md:w-[calc(100%-52px)]">
                <h4 className="text-white text-[32px] mb-2 font_fredoka font-medium">
                  {profile.name}
                </h4>
                <hr className="text-white mb-2" />
                <p className="text-2xl font-semibold text-white">
                  {profile.breed}{" "}
                  <span className="block font-medium text-lg">
                    {profile.gender}, {profile.age}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center">
          <Button
            onClick={handleJoin}
            className="font-medium md:w-auto w-full md:px-20"
          >
            Join PAWnderr
          </Button>
        </div>
      </div>

      <img
        src={images.pawpStarsRibbon.src}
        className="absolute -top-60 left-0 -z-10 hidden md:block"
        alt="ribbon"
      />
    </section>
  );
};

export default PawpStars;
