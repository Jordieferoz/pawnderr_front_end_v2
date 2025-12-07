"use client";
import { images } from "@/utils/images";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

type Card = {
  name: string;
  info: string;
  url: string;
  desc: string;
  details: string;
};

const cardsData: Card[] = [
  {
    name: "Buddy",
    info: "(Male, 2 Years)",
    url: images.doggo1.src,
    desc: "A cheerful retriever who loves belly rubs and chasing tennis balls.",
    details:
      "Golden Retriever\nLoves long walks\nFully vaccinated\nWeight: 25kg",
  },
  {
    name: "Buddy",
    info: "(Male, 2 Years)",
    url: images.doggo1.src,
    desc: "A cheerful retriever who loves belly rubs and chasing tennis balls.",
    details:
      "Golden Retriever\nLoves long walks\nFully vaccinated\nWeight: 25kg",
  },
  {
    name: "Buddy",
    info: "(Male, 2 Years)",
    url: images.doggo1.src,
    desc: "A cheerful retriever who loves belly rubs and chasing tennis balls.",
    details:
      "Golden Retriever\nLoves long walks\nFully vaccinated\nWeight: 25kg",
  },
  {
    name: "Buddy",
    info: "(Male, 2 Years)",
    url: images.doggo1.src,
    desc: "A cheerful retriever who loves belly rubs and chasing tennis balls.",
    details:
      "Golden Retriever\nLoves long walks\nFully vaccinated\nWeight: 25kg",
  },
];

const FlipCard: FC<{ card: Card }> = ({ card }) => {
  const router = useRouter();

  const [isFlipped, setIsFlipped] = useState(false);

  const handleOpenChat = (id: string) => {
    router.push(`/messages/${id}`);
  };

  return (
    <div className="flex flex-col items-center gap-4 relative perspective-[1000px]">
      <div
        className="relative w-full h-[420px] rounded-[24px] border-[5px] border-white shadow-[0px_4px_10px_rgba(0,0,0,0.1)] transition-all duration-700 ease-in-out hover:shadow-[0px_8px_25px_rgba(0,0,0,0.2)] [transform-style:preserve-3d] cursor-pointer group"
        style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Face */}
        <div className="absolute inset-0 rounded-[24px] [backface-visibility:hidden]">
          <img
            src={card.url}
            alt={card.name}
            className="w-full h-full object-cover rounded-[24px]"
          />
          <div className="absolute inset-0 card_gradient rounded-[24px]" />
          <div className="absolute bottom-17 left-5 right-5 text-white z-10">
            <h3 className="text-2xl font-semibold leading-tight">
              {card.name}{" "}
              <span className="text-base font-normal opacity-90">
                {card.info}
              </span>
            </h3>
            <p className="text-sm opacity-90 mt-1 leading-snug">{card.desc}</p>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-blue-500 to-purple-600 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-center items-center  text-white p-8 text-center gap-4">
          <h3 className="text-2xl font-bold">{card.name}</h3>
          <div className="text-lg opacity-90 space-y-2">
            {card.details.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <p className="text-sm opacity-75 mt-2 max-w-[280px] leading-relaxed">
            {card.desc}
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center gap-5 absolute -bottom-6 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={() => handleOpenChat("1")}
          className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-[0px_4px_28px_0px_#00000040] hover:scale-105 active:scale-95 transition-transform"
        >
          <img src={images.chatYellow.src} alt="message" className="w-7" />
        </button>
        <button className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-[0px_4px_28px_0px_#00000040] hover:scale-105 active:scale-95 transition-transform">
          <img src={images.like.src} alt="like" className="w-7.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFlipped(!isFlipped);
          }}
          className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-[0px_4px_28px_0px_#00000040] hover:scale-105 active:scale-95 transition-transform"
        >
          <img src={images.eyeBlue.src} alt="view" className="w-[28px]" />
        </button>
      </div>
    </div>
  );
};

const MatchedCard: FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14">
        {cardsData.map((card) => (
          <FlipCard key={card.name} card={card} />
        ))}
      </div>
    </div>
  );
};

export default MatchedCard;
