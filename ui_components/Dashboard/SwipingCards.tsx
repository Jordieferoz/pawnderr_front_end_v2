"use client";
import { images } from "@/utils/images";
import React, { useMemo, useState } from "react";
import TinderCard from "react-tinder-card";

type Card = {
  name: string;
  info: string;
  url: string;
  desc: string;
};

const cardsData: Card[] = [
  {
    name: "Buddy",
    info: "(Male, 2 Years)",
    url: images.doggo1.src,
    desc: "A cheerful retriever who loves belly rubs and chasing tennis balls.",
  },
  {
    name: "Luna",
    info: "(Female, 1.5 Years)",
    url: images.doggo2.src,
    desc: "A playful husky with bright blue eyes and endless energy for adventures.",
  },
  {
    name: "Rocky",
    info: "(Male, 3 Years)",
    url: images.doggo3.src,
    desc: "This gentle giant loves naps in the sun and snuggling on cold days.",
  },
  {
    name: "Daisy",
    info: "(Female, 2.5 Years)",
    url: images.doggo4.src,
    desc: "Smart, loyal, and always ready to pose for the camera — a real charmer.",
  },
  {
    name: "Max",
    info: "(Male, 1 Year)",
    url: images.doggo5.src,
    desc: "Small in size but big in personality, Max never misses a treat!",
  },
];

export default function SwipingCards() {
  const [cards, setCards] = useState(cardsData);
  const [currentIndex, setCurrentIndex] = useState(cardsData.length - 1);

  const childRefs = useMemo(
    () =>
      Array(cardsData.length)
        .fill(0)
        .map(() => React.createRef<any>()),
    []
  );

  const canSwipe = currentIndex >= 0;

  const swipe = (dir: "left" | "right") => {
    if (canSwipe && currentIndex >= 0 && childRefs[currentIndex]?.current) {
      childRefs[currentIndex].current.swipe(dir);
    }
  };

  const handleSwipe = (dir: string, name: string, index: number) => {
    console.log(`You swiped ${dir} on ${name}`);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const onCardLeftScreen = (name: string) => {
    console.log(`${name} left the screen`);
  };

  return (
    <div className="w-[340px] h-[520px] relative mx-auto">
      <div className="relative h-full">
        {cards.map((card, idx) => {
          const isActive = idx <= currentIndex;
          const isTop = idx === currentIndex;
          const isSecond = idx === currentIndex - 1;

          if (!isActive) return null;

          let translateY = 0;
          let translateX = 0;
          let scale = 1;
          let opacity = 1;
          let rotateZ = 0;

          if (isSecond) {
            translateY = -85;
            translateX = 30;
            scale = 0.85;
            opacity = 0.8;
            rotateZ = -3;
          }

          return (
            <div
              key={card.name}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full"
              style={{
                zIndex: idx,
                pointerEvents: isTop ? "auto" : "none",
              }}
            >
              <TinderCard
                ref={childRefs[idx]}
                onSwipe={(dir) => handleSwipe(dir, card.name, idx)}
                onCardLeftScreen={() => onCardLeftScreen(card.name)}
                preventSwipe={["up", "down"]}
                swipeRequirementType="position"
                swipeThreshold={100}
                flickOnSwipe={true}
                className="absolute"
              >
                <div
                  className="relative w-[340px] h-[420px] rounded-[24px] border-[5px] border-white 
                    shadow-[0px_4px_10px_0px_rgba(0,0,0,0.1)] flex items-end justify-center overflow-hidden"
                  style={{
                    transform: `translateY(${translateY}px) translateX(${translateX}px) scale(${scale}) rotate(${rotateZ}deg)`,
                    opacity,
                    transition: isTop
                      ? "none"
                      : "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    transformOrigin: "center bottom",
                  }}
                >
                  <img
                    src={card.url}
                    alt={card.name}
                    className="w-full h-full absolute top-0 left-0 rounded-[24px] object-cover"
                    draggable="false"
                  />

                  <div className="absolute inset-0 card_gradient rounded-[24px]" />

                  <div className="absolute bottom-17 left-6 right-6 z-10 text-white">
                    <h3 className="text-2xl font-semibold leading-tight">
                      {card.name}{" "}
                      <span className="text-base font-normal opacity-90">
                        {card.info}
                      </span>
                    </h3>
                    <p className="text-sm opacity-90 mt-1 max-w-[280px] leading-snug">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </TinderCard>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center gap-5 absolute bottom-17 left-1/2 -translate-x-1/2 z-[1000]">
        <button
          onClick={() => swipe("left")}
          disabled={!canSwipe}
          className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src={images.dislike.src} alt="Dislike" className="w-5 h-5" />
        </button>
        <button className="bg-primary-500 rounded-full w-[68px] h-[68px] flex items-center justify-center shadow-md hover:scale-105 transition-transform">
          <img
            src={images.pawYellow.src}
            alt="Super like"
            className="h-[36px]"
          />
        </button>
        <button
          onClick={() => swipe("right")}
          disabled={!canSwipe}
          className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src={images.like.src} alt="Like" className="w-[33px] h-[33px]" />
        </button>
      </div>

      {!canSwipe && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <p className="text-xl font-semibold text-gray-800">
              No more dogs to view! 🐕
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Check back later for more matches
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
