"use client";

import {
  FIND_CONNECTIONS_CARDS,
  FIND_CONNECTIONS_DECORATIONS
} from "@/constants/home";

const FindConnections = () => {
  return (
    <section className="w-full bg-[#DAF8ED] relative my-30 py-10 flex items-center justify-center">
      {FIND_CONNECTIONS_DECORATIONS.map((decoration) => (
        <img
          key={decoration.id}
          src={decoration.image}
          alt={decoration.alt}
          className={decoration.className}
        />
      ))}

      <div className="container mx-auto px-4 md:px-0 relative z-10">
        <div className="mb-10">
          <h3 className="md:text-[49px] md:leading-[52px] font_fredoka font-medium text-dark-brown text-center mb-15">
            Where Pets Find <br /> Genuine Connections
          </h3>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-9 items-center relative">
          {FIND_CONNECTIONS_CARDS.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl h-full shadow-[0px_4px_16px_0px_#0000000D]"
            >
              <img
                src={card.image}
                alt={card.title}
                className="h-[210px] w-full object-cover rounded-xl"
              />
              <div className="px-4 py-5">
                <h5 className="text-dark-brown md:text-[22px] font-medium font_fredoka mb-3">
                  {card.title}
                </h5>
                <p className="mb-2 text-base font-medium text-dark-brown/70">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FindConnections;
