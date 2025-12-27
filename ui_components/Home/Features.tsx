import { images } from "@/utils/images";

import { HowItWorks } from ".";

const Features = () => {
  return (
    <div className="min-h-screen py-10 pb-10 md:pb-20 relative">
      <div className="container mx-auto shadow-[0px_4px_19.1px_7px_#0000000A] relative bg-white rounded-xl p-5 md:py-15 md:px-8">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-0">
          <div className="text-center md:pr-14 md:border-r border-grey-1000 border-dashed">
            <div className="md:w-30 md:h-30 mx-auto mb-7">
              <img
                src={images.yellowStar.src}
                alt="companion"
                className="mx-auto"
              />
            </div>
            <h3 className="heading3_medium text-dark-brown mb-3">
              Find Real Connections for <br /> Your Four-Legged Companion
            </h3>
            <p className="text-light-grey2 text-base">
              PAWnderr is built to help pet parents discover{" "}
              <br className="block md:hidden" /> playdates, friendships, and
              more.
            </p>
          </div>
          <div className="text-center md:px-14 md:border-r border-grey-1000 border-dashed">
            <div className="md:w-30 md:h-30 mx-auto mb-7">
              <img
                src={images.purpleIcon.src}
                alt="connection"
                className="mx-auto"
              />
            </div>
            <h3 className="heading3_medium text-dark-brown mb-3">
              Every moment can spark <br /> a connection
            </h3>
            <p className="text-light-grey2 text-base">
              Designed for all pets, from the shy to <br /> the social.
            </p>
          </div>{" "}
          <div className="text-center md:pl-14">
            <div className="md:w-30 md:h-30 mx-auto mb-7">
              <img
                src={images.greenHeart.src}
                alt="companion"
                className="mx-auto"
              />
            </div>
            <h3 className="heading3_medium text-dark-brown mb-3">
              A trusted place to connect <br /> nearby, with care and purpose.
            </h3>
            <p className="text-light-grey2 text-base">
              Join us early and be part of the journey.
            </p>
          </div>
        </div>
      </div>
      <HowItWorks />
      <img
        src={images.featureRibbonLeft.src}
        className="absolute top-70 left-0 -z-10 hidden md:block"
        alt="ribbon"
      />
      <img
        src={images.featureRibbonRight.src}
        className="absolute -bottom-20 right-0 -z-10 hidden md:block"
        alt="ribbon"
      />
    </div>
  );
};

export default Features;
