"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";

const HowItWorks = () => {
  const router = useRouter();

  const handleJoin = () => {
    router.push("/sign-up");
  };
  return (
    <section className="md:pt-25 pt-16 scroll-mt-[90px]" id="how-it-works">
      <div className="container mx-auto px-5 md:px-10">
        <h3 className="heading1_medium text-center text-dark-brown mb-10 md:mb-15">
          Sniff. Swipe. Match. Meet.
        </h3>

        <div className="grid md:grid-cols-3 gap-6 mb-8 md:mb-20">
          <div className="bg-[#67D6AD] rounded-xl p-5 relative flex flex-col">
            <p className="text-[#3569561A] font_fredoka font-semibold text-[200px] absolute left-5 -top-15">
              01
            </p>
            <h3 className="heading2_semibold text-[#356956] mt-25 mb-3">
              Create a Profile
            </h3>
            <p className="body_regular text-[#356956] mb-6 flex-1">
              Add your Pet’s standout photo and highlight their favourite
              activities, fun facts & personality traits.
            </p>
            <div className="aspect-video bg-white/20 rounded-lg overflow-hidden">
              <img
                src={images.createProfile.src}
                alt="Create Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="bg-accent-500 rounded-xl p-5 relative flex flex-col">
            <p className="text-accent-900/10 font_fredoka font-semibold text-[200px] absolute left-5 -top-15">
              02
            </p>
            <h3 className="heading2_semibold text-accent-900 mt-25 mb-3">
              Sniff. Swipe.
            </h3>
            <p className="body_regular text-accent-900 mb-6 flex-1">
              Discover nearby profiles, review compatibility details, and
              connect with matches that fit your Pet’s energy level.
            </p>
            <div className="aspect-video bg-white/20 rounded-lg overflow-hidden">
              <img
                src={images.sniffSwipe.src}
                alt="Sniff Swipe"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="bg-secondary-600 rounded-xl p-5 relative flex flex-col">
            <p className="text-white/10 font_fredoka font-semibold text-[200px] absolute left-5 -top-15">
              03
            </p>
            <h3 className="heading2_semibold text-white mt-25 mb-3">
              Match. Meet.
            </h3>
            <p className="body_regular text-white mb-6 flex-1">
              Start a conversation and set up a secure, well-matched meet-up for
              both pets and their parents.
            </p>
            <div className="aspect-video bg-white/20 rounded-lg overflow-hidden">
              <img
                src={images.matchMeet.src}
                alt="Create Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button
            onClick={handleJoin}
            className="font-medium w-full md:w-auto md:px-20"
          >
            Join PAWnderr
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
