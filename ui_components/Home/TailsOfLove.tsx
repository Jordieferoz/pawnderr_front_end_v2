"use client";

import {
  TAIL_OF_LOVE_DECORATIONS,
  TAILS_OF_LOVE_CARDS
} from "@/constants/home";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const TailsOfLove = () => {
  const router = useRouter();

  const handleCreateAccount = () => {
    router.push("/sign-up");
  };

  return (
    <section className="w-full bg-[#FFEBF3] relative my-30 py-10">
      {TAIL_OF_LOVE_DECORATIONS.map((decoration) => (
        <img
          key={decoration.id}
          src={decoration.image}
          alt={decoration.alt}
          className={decoration.className}
        />
      ))}

      <div className="container mx-auto mb-15 relative">
        <div className="flex justify-between">
          <h3 className="md:text-[49px] md:leading-[52px] font_fredoka font-medium text-dark-brown text-left">
            Tails of Love
          </h3>
          <Button onClick={handleCreateAccount} className="font-medium px-20">
            My PAWnderr Story
          </Button>
        </div>
      </div>

      {/* Scrollable container aligned with container's left edge */}
      <div className="container mx-auto relative">
        <ul className="flex gap-5 overflow-x-auto overflow-y-hidden hide-scrollbar pb-4 -mr-[calc((100vw-100%)/2)]">
          {TAILS_OF_LOVE_CARDS.map((card) => (
            <li
              key={card.id}
              className="bg-white rounded-xl md:w-[500px] h-full border border-[#EFF0F6] shadow-[0px_5px_14px_0px_#080F340A] p-5 flex-shrink-0 w-[350px]"
            >
              <img
                src={card.image}
                alt={card.title}
                className="h-[228px] w-full object-cover rounded-xl"
              />
              <div className="px-2 py-5">
                <h5 className="text-accent-900 md:text-[28px] font-medium font_fredoka mb-3">
                  {card.title}
                </h5>
                <p className="mb-2 text-2xl font-medium text-accent-500 font_fredoka">
                  {card.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TailsOfLove;
