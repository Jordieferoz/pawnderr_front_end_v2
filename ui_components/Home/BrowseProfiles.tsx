"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";

const BrowseProfiles = () => {
  const router = useRouter();

  const handleCreateAccount = () => {
    router.push("/sign-up");
  };

  return (
    <section className="py-10 px-5 md:px-0 relative">
      <div className="container mx-auto bg-primary-500 relative rounded-xl">
        <div className="py-16 px-10 md:pl-30 md:pr-0 relative z-10">
          <h5 className="mb-9 text-white font_fredoka font-medium text-[48px] md:text-[70px] md:leading-[74px] leading-[54px]">
            Ready to Find <br /> a Match?
          </h5>
          <p className="text-white font_fredoka font-medium text-2xl mb-8">
            Join a trusted community of pet lovers.{" "}
            <br className="hidden md:block" /> Helping you find safe and happy.
          </p>
          <Button
            onClick={handleCreateAccount}
            className="font-medium px-20 w-full md:w-auto"
          >
            Browse Profiles
          </Button>
        </div>

        <img
          src={images.browseRightRibbon.src}
          className="absolute top-0 right-0 z-10 hidden md:block"
          alt="ribbon"
        />
        <img
          src={images.browseLeftRibbon.src}
          className="absolute bottom-0 left-0 pointer-events-none z-10 hidden md:block"
          alt="ribbon"
        />
        <img
          src={images.browseLeftShape.src}
          className="absolute bottom-0 left-0 pointer-events-none z-0 md:w-auto w-[40vw]"
          alt="shape"
        />
        <img
          src={images.browseRightShape.src}
          className="absolute top-0 right-0 pointer-events-none z-0 md:w-auto w-[40vw]"
          alt="shape"
        />
        <img
          src={images.browseProfileDogs.src}
          className=" relative md:absolute -bottom-16 md:-bottom-30 mx-auto right-0 pointer-events-none z-20 md:w-[50vw] w-full"
          alt="dogs"
        />
      </div>
    </section>
  );
};

export default BrowseProfiles;
