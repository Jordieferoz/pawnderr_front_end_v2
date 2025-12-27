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
    <section className="py-10 relative">
      <div className="container mx-auto bg-primary-500 relative rounded-xl">
        <div className="py-16 pl-30 relative z-10">
          <h5 className="mb-9 text-white font_fredoka font-medium md:text-[70px] md:leading-[74px]">
            Ready to Find <br /> a Match?
          </h5>
          <p className="text-white font_fredoka font-medium text-2xl mb-8">
            Join a trusted community of pet lovers. <br /> Helping you find safe
            and happy.
          </p>
          <Button onClick={handleCreateAccount} className="font-medium px-20">
            Browse Profiles
          </Button>
        </div>

        <img
          src={images.browseRightRibbon.src}
          className="absolute top-0 right-0 z-10"
          alt="ribbon"
        />
        <img
          src={images.browseLeftRibbon.src}
          className="absolute bottom-0 left-0 pointer-events-none z-10"
          alt="ribbon"
        />
        <img
          src={images.browseLeftShape.src}
          className="absolute bottom-0 left-0 pointer-events-none z-0"
          alt="shape"
        />
        <img
          src={images.browseRightShape.src}
          className="absolute top-0 right-0 pointer-events-none z-0"
          alt="shape"
        />
        <img
          src={images.browseProfileDogs.src}
          className="absolute -bottom-30 right-0 pointer-events-none z-20 w-[50vw]"
          alt="shape"
        />
      </div>
    </section>
  );
};

export default BrowseProfiles;
