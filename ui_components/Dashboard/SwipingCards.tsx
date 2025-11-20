"use client";
import { images } from "@/utils/images";
import { useDrag } from "@use-gesture/react";
import React, { useMemo, useState } from "react";

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
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const cardRefs = useMemo(
    () =>
      Array(cardsData.length)
        .fill(0)
        .map(() => React.createRef<HTMLDivElement>()),
    []
  );

  const canSwipe = currentIndex >= 0;

  const finishSwipe = (direction: "left" | "right", element: HTMLElement) => {
    const moveOutWidth = window.innerWidth * 1.5;
    const translateX = direction === "right" ? moveOutWidth : -moveOutWidth;
    const rotation = direction === "right" ? 30 : -30;

    element.style.transform = `translateX(${translateX}px) rotate(${rotation}deg)`;
    element.style.transition = "transform 0.5s ease-out";
    element.style.opacity = "0";

    setTimeout(() => {
      // console.log(`Swiped ${direction} on ${cards[currentIndex].name}`);
      setCurrentIndex((prev) => prev - 1);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 500);
  };

  const bind = useDrag(
    ({
      args: [index],
      active,
      movement: [mx],
      direction: [xDir],
      velocity: [vx],
    }) => {
      if (index !== currentIndex || isAnimating) return;

      const card = cardRefs[index]?.current;
      if (!card) return;

      const threshold = 100;
      const isSwipe = !active && (Math.abs(mx) > threshold || vx > 0.5);

      if (active) {
        // While dragging - show overlay based on direction
        const rotation = mx / 15;
        card.style.transform = `translateX(${mx}px) rotate(${rotation}deg)`;
        card.style.transition = "none";

        if (Math.abs(mx) > 20) {
          setSwipeDirection(mx > 0 ? "right" : "left");
        } else {
          setSwipeDirection(null);
        }
      } else if (isSwipe) {
        const direction = xDir > 0 ? "right" : "left";
        setIsAnimating(true);
        finishSwipe(direction, card);
      } else {
        card.style.transform = "translateX(0) rotate(0)";
        card.style.transition = "transform 0.3s ease-out";
        setSwipeDirection(null);
      }
    },
    {
      axis: "x",
      filterTaps: true,
    }
  );

  const programmaticSwipe = (dir: "left" | "right") => {
    if (!canSwipe || !cardRefs[currentIndex]?.current) return;

    const card = cardRefs[currentIndex].current;
    setIsAnimating(true);
    setSwipeDirection(dir);

    // Animate the card moving in the swipe direction first
    const initialMove = dir === "right" ? 150 : -150;
    const initialRotation = dir === "right" ? 10 : -10;

    card.style.transform = `translateX(${initialMove}px) rotate(${initialRotation}deg)`;
    card.style.transition = "transform 0.2s ease-out";

    // Then complete the swipe
    setTimeout(() => {
      finishSwipe(dir, card);
    }, 200);
  };

  return (
    <div className="w-full max-w-[340px] h-[520px] relative mx-auto">
      <div className="relative h-full">
        {cards.map((card, idx) => {
          const isActive = idx <= currentIndex;
          const isTop = idx === currentIndex;

          if (!isActive) return null;

          return (
            <div
              key={card.name}
              ref={cardRefs[idx]}
              {...(isTop ? bind(idx) : {})}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full touch-none"
              style={{
                zIndex: idx,
                pointerEvents: isTop && !isAnimating ? "auto" : "none",
              }}
            >
              <div
                className="relative w-full max-w-[340px] h-[420px] rounded-[24px] border-[5px] border-white 
                  shadow-[0px_4px_10px_0px_rgba(0,0,0,0.1)] flex items-end justify-center overflow-hidden mx-auto"
                style={{
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

                {isTop && swipeDirection && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className={`absolute top-6 text-2xl font-bold uppercase tracking-wider px-4 py-1.5 rounded-lg border-[3px] transition-opacity duration-200  ${
                        swipeDirection === "right"
                          ? "left-6 text-green-500 border-green-500 rotate-[-20deg]"
                          : "right-6 text-red-500 border-red-500 rotate-[20deg]"
                      }`}
                      style={{
                        textShadow: "0 0 10px rgba(0,0,0,0.3)",
                      }}
                    >
                      {swipeDirection === "right" ? "LIKE" : "NOPE"}
                    </div>
                  </div>
                )}

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
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center gap-5 absolute bottom-17 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={() => programmaticSwipe("left")}
          disabled={!canSwipe}
          className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src={images.dislike.src} alt="Dislike" className="w-5 h-5" />
        </button>
        <button className="bg-primary-500 rounded-full w-[68px] h-[68px] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform">
          <img
            src={images.pawYellow.src}
            alt="Super like"
            className="h-[36px]"
          />
        </button>
        <button
          onClick={() => programmaticSwipe("right")}
          disabled={!canSwipe}
          className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src={images.like.src} alt="Like" className="w-[33px] h-[33px]" />
        </button>
      </div>

      {!canSwipe && !isAnimating && (
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
