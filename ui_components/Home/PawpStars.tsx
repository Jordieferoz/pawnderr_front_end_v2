"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";

const PawpStars = () => {
  const router = useRouter();

  const handleJoin = () => {
    router.push("/sign-up");
  };
  return (
    <section className="min-h-screen py-20 relative">
      <div className="container mx-auto px-10">
        <h3 className="display4_medium text-center text-dark-brown mb-5">
          Pawp Stars
        </h3>
        <p className="text-center text-light-grey2 text-xl font-semibold mb-8">
          Premium profiles trusted by the <br /> PAWnderr community
        </p>

        <div className="grid md:grid-cols-3 gap-x-15 gap-y-5 mb-20">
          <div className="rounded-[32px] relative h-[346px]">
            <div className="img_gradient shadow-[0px_8.25px_16.5px_0px_#00000040] rounded-[32px] absolute inset-0" />
            <img
              src={images.doggo1.src}
              className="w-full h-[inherit] object-cover rounded-[32px]"
              alt="doggo"
            />
            <img
              src={images.premiumYellow.src}
              className="absolute right-5 top-5"
              alt="doggo"
            />
            <div className="px-6 absolute bottom-6.5 left-1/2 -translate-x-1/2 w-[calc(100%-52px)]">
              <h4 className="text-white text-[32px] mb-2 font_fredoka font-medium">
                Hydro
              </h4>
              <hr className="text-white mb-2" />
              <p className="text-2xl font-semibold text-white">
                Golden Retriver{" "}
                <span className="block font-medium text-lg"> Female, 1Y </span>
              </p>
            </div>
          </div>
          <div className="rounded-[32px] relative h-[346px]">
            <div className="img_gradient shadow-[0px_8.25px_16.5px_0px_#00000040] rounded-[32px] absolute inset-0" />
            <img
              src={images.doggo1.src}
              className="w-full h-[inherit] object-cover rounded-[32px]"
              alt="doggo"
            />
            <img
              src={images.premiumYellow.src}
              className="absolute right-5 top-5"
              alt="doggo"
            />
            <div className="px-6 absolute bottom-6.5 left-1/2 -translate-x-1/2 w-[calc(100%-52px)]">
              <h4 className="text-white text-[32px] mb-2 font_fredoka font-medium">
                Hydro
              </h4>
              <hr className="text-white mb-2" />
              <p className="text-2xl font-semibold text-white">
                Golden Retriver{" "}
                <span className="block font-medium text-lg"> Female, 1Y </span>
              </p>
            </div>
          </div>{" "}
          <div className="rounded-[32px] relative h-[346px]">
            <div className="img_gradient shadow-[0px_8.25px_16.5px_0px_#00000040] rounded-[32px] absolute inset-0" />
            <img
              src={images.doggo1.src}
              className="w-full h-[inherit] object-cover rounded-[32px]"
              alt="doggo"
            />
            <img
              src={images.premiumYellow.src}
              className="absolute right-5 top-5"
              alt="doggo"
            />
            <div className="px-6 absolute bottom-6.5 left-1/2 -translate-x-1/2 w-[calc(100%-52px)]">
              <h4 className="text-white text-[32px] mb-2 font_fredoka font-medium">
                Hydro
              </h4>
              <hr className="text-white mb-2" />
              <p className="text-2xl font-semibold text-white">
                Golden Retriver{" "}
                <span className="block font-medium text-lg"> Female, 1Y </span>
              </p>
            </div>
          </div>{" "}
          <div className="rounded-[32px] relative h-[346px]">
            <div className="img_gradient shadow-[0px_8.25px_16.5px_0px_#00000040] rounded-[32px] absolute inset-0" />
            <img
              src={images.doggo1.src}
              className="w-full h-[inherit] object-cover rounded-[32px]"
              alt="doggo"
            />
            <img
              src={images.premiumYellow.src}
              className="absolute right-5 top-5"
              alt="doggo"
            />
            <div className="px-6 absolute bottom-6.5 left-1/2 -translate-x-1/2 w-[calc(100%-52px)]">
              <h4 className="text-white text-[32px] mb-2 font_fredoka font-medium">
                Hydro
              </h4>
              <hr className="text-white mb-2" />
              <p className="text-2xl font-semibold text-white">
                Golden Retriver{" "}
                <span className="block font-medium text-lg"> Female, 1Y </span>
              </p>
            </div>
          </div>{" "}
          <div className="rounded-[32px] relative h-[346px]">
            <div className="img_gradient shadow-[0px_8.25px_16.5px_0px_#00000040] rounded-[32px] absolute inset-0" />
            <img
              src={images.doggo1.src}
              className="w-full h-[inherit] object-cover rounded-[32px]"
              alt="doggo"
            />
            <img
              src={images.premiumYellow.src}
              className="absolute right-5 top-5"
              alt="doggo"
            />
            <div className="px-6 absolute bottom-6.5 left-1/2 -translate-x-1/2 w-[calc(100%-52px)]">
              <h4 className="text-white text-[32px] mb-2 font_fredoka font-medium">
                Hydro
              </h4>
              <hr className="text-white mb-2" />
              <p className="text-2xl font-semibold text-white">
                Golden Retriver{" "}
                <span className="block font-medium text-lg"> Female, 1Y </span>
              </p>
            </div>
          </div>{" "}
          <div className="rounded-[32px] relative h-[346px]">
            <div className="img_gradient shadow-[0px_8.25px_16.5px_0px_#00000040] rounded-[32px] absolute inset-0" />
            <img
              src={images.doggo1.src}
              className="w-full h-[inherit] object-cover rounded-[32px]"
              alt="doggo"
            />
            <img
              src={images.premiumYellow.src}
              className="absolute right-5 top-5"
              alt="doggo"
            />
            <div className="px-6 absolute bottom-6.5 left-1/2 -translate-x-1/2 w-[calc(100%-52px)]">
              <h4 className="text-white text-[32px] mb-2 font_fredoka font-medium">
                Hydro
              </h4>
              <hr className="text-white mb-2" />
              <p className="text-2xl font-semibold text-white">
                Golden Retriver{" "}
                <span className="block font-medium text-lg"> Female, 1Y </span>
              </p>
            </div>
          </div>{" "}
          <div className="rounded-[32px] relative h-[346px]">
            <div className="img_gradient shadow-[0px_8.25px_16.5px_0px_#00000040] rounded-[32px] absolute inset-0" />
            <img
              src={images.doggo1.src}
              className="w-full h-[inherit] object-cover rounded-[32px]"
              alt="doggo"
            />
            <img
              src={images.premiumYellow.src}
              className="absolute right-5 top-5"
              alt="doggo"
            />
            <div className="px-6 absolute bottom-6.5 left-1/2 -translate-x-1/2 w-[calc(100%-52px)]">
              <h4 className="text-white text-[32px] mb-2 font_fredoka font-medium">
                Hydro
              </h4>
              <hr className="text-white mb-2" />
              <p className="text-2xl font-semibold text-white">
                Golden Retriver{" "}
                <span className="block font-medium text-lg"> Female, 1Y </span>
              </p>
            </div>
          </div>{" "}
          <div className="rounded-[32px] relative h-[346px]">
            <div className="img_gradient shadow-[0px_8.25px_16.5px_0px_#00000040] rounded-[32px] absolute inset-0" />
            <img
              src={images.doggo1.src}
              className="w-full h-[inherit] object-cover rounded-[32px]"
              alt="doggo"
            />
            <img
              src={images.premiumYellow.src}
              className="absolute right-5 top-5"
              alt="doggo"
            />
            <div className="px-6 absolute bottom-6.5 left-1/2 -translate-x-1/2 w-[calc(100%-52px)]">
              <h4 className="text-white text-[32px] mb-2 font_fredoka font-medium">
                Hydro
              </h4>
              <hr className="text-white mb-2" />
              <p className="text-2xl font-semibold text-white">
                Golden Retriver{" "}
                <span className="block font-medium text-lg"> Female, 1Y </span>
              </p>
            </div>
          </div>{" "}
          <div className="rounded-[32px] relative h-[346px]">
            <div className="img_gradient shadow-[0px_8.25px_16.5px_0px_#00000040] rounded-[32px] absolute inset-0" />
            <img
              src={images.doggo1.src}
              className="w-full h-[inherit] object-cover rounded-[32px]"
              alt="doggo"
            />
            <img
              src={images.premiumYellow.src}
              className="absolute right-5 top-5"
              alt="doggo"
            />
            <div className="px-6 absolute bottom-6.5 left-1/2 -translate-x-1/2 w-[calc(100%-52px)]">
              <h4 className="text-white text-[32px] mb-2 font_fredoka font-medium">
                Hydro
              </h4>
              <hr className="text-white mb-2" />
              <p className="text-2xl font-semibold text-white">
                Golden Retriver{" "}
                <span className="block font-medium text-lg"> Female, 1Y </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button onClick={handleJoin} className="font-medium px-20">
            Join PAWnderr
          </Button>
        </div>
      </div>

      <img
        src={images.pawpStarsRibbon.src}
        className="absolute -top-60 left-0 -z-10"
        alt="ribbon"
      />
    </section>
  );
};

export default PawpStars;
