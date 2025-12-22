import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";

const Hero = () => {
  return (
    <section className="w-full min-h-screen relative pt-20 bg-primary-theme/8 flex items-center justify-center overflow-clip">
      <img
        src={images.heroTopShape.src}
        alt="blur"
        className="absolute left-20 -top-10 md:h-[440px] pointer-events-none z-0"
      />
      <img
        src={images.heroBottomShape.src}
        alt="blur"
        className="absolute left-10 -bottom-60 md:h-[440px] pointer-events-none z-0"
      />
      <img
        src={images.heroLeftBlur.src}
        alt="blur"
        className="absolute left-0 top-1/2 -translate-y-1/2 lg:h-[520px] pointer-events-none z-0"
      />
      <img
        src={images.heroRightBlur.src}
        alt="blur"
        className="absolute right-0 bottom-0 lg:h-[520px] pointer-events-none z-0"
      />
      <div className="container mx-auto px-4 md:px-0 py-8 md:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="">
            <p className="text-dark-grey md:text-base font_fredoka">
              Verified connections for happy pets
            </p>
            <h1 className="md:text-[64px] md:leading-[64px] text-dark-black font_fredoka mb-6">
              Find a <span className="font-semibold">PAWfect</span>
              <br />
              Companion for
              <br />
              Your Pet.
            </h1>
            <p className="text-2xl text-grey-900 font-medium font_fredoka">
              Join a trusted community of pet lovers. Helping you find safe and
              happy friendships for your pet.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Button className="px-12 font-medium">Create Account</Button>
              <div className="flex items-center gap-2">
                <img src={images.playBlue.src} alt="" />
                <p className="text-accent-900 text-base font-medium font_fredoka">
                  Watch Our Demo
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src={images.heroCircle.src}
              alt="blur"
              className="absolute right-0 top-1/2 -translate-y-1/2 lg:h-[520px] pointer-events-none z-0"
            />

            <div className="">
              <img
                src={images.heroImg.src}
                alt="Happy Dogs"
                className="w-full h-full object-cover relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
