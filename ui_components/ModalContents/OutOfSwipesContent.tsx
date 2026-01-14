"use client";

import { FC } from "react";

import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";

const OutOfSwipesContent: FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl">
      <h4 className="display4_medium text-dark-brown text-center mb-3">
        Whoops! <br /> You’re Out of Swipes
      </h4>
      <p className="text-light-grey2 text-center body_large_medium mb-6">
        Your daily sniff spree of XX swipes is over… but{" "}
        <br className="hidden md:block" /> love (and tail wags) waits for no
        one!
      </p>
      <img
        src={images.sadPug.src}
        alt="sad pug"
        className="w-[248px] mx-auto object-cover"
      />
      <div className="mt-8 w-full md:w-[60%] mx-auto">
        <Button className="w-full">Get More Swipes</Button>
        <p className="body_large_medium text-center text-light-grey2 mt-4">
          Wait for 24 Hours
        </p>
      </div>
    </div>
  );
};

export default OutOfSwipesContent;
