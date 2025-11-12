"use client";
import { images } from "@/utils/images";
import React, { useMemo, useRef } from "react";
import TinderCard from "react-tinder-card";

type Card = {
  name: string;
  url: string;
};

const cardsData: Card[] = [
  {
    name: "Ada Lovelace",
    url: images.doggo1.src,
  },
  {
    name: "Alan Turing",
    url: images.doggo2.src,
  },
  {
    name: "Grace Hopper",
    url: images.doggo3.src,
  },
  {
    name: "Linus Torvalds",
    url: images.doggo4.src,
  },
  {
    name: "Linus Torvalds",
    url: images.doggo5.src,
  },
];

export default function SwipingCards() {
  const childRefs = useMemo(
    () =>
      Array(cardsData.length)
        .fill(0)
        .map(() => React.createRef<any>()),
    []
  );

  // Keeps track of the current card index
  const currentIndexRef = useRef(cardsData.length - 1);

  // Imperatively trigger swipes
  const swipe = async (dir: "left" | "right") => {
    if (currentIndexRef.current >= 0) {
      await childRefs[currentIndexRef.current].current.swipe(dir); // swipe the card!
      currentIndexRef.current -= 1;
    }
  };

  // Example event handler
  const handleSwipe = (dir: string, name: string) => {
    // You can handle swipe logic here (API call, state update, etc.)
    // console.log(`${name} was swiped ${dir}`);
  };

  return (
    <div style={{ width: 340, margin: "0 auto" }}>
      <div style={{ height: 405, position: "relative" }}>
        {cardsData.map((card, idx) => (
          <TinderCard
            ref={childRefs[idx]}
            key={card.name}
            onSwipe={(dir) => handleSwipe(dir, card.name)}
            preventSwipe={["up", "down"]}
          >
            <div
              style={{
                backgroundImage: `url(${card.url})`,
                backgroundSize: "cover",
                width: 320,
                height: 400,
                borderRadius: 20,
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                color: "#fff",
                padding: 24,
                margin: "0 auto",
                position: "absolute",
              }}
            >
              <h3>{card.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <button
          type="button"
          onClick={() => swipe("left")}
          // style={{
          //   background: "#ec5e6f",
          //   color: "#fff",
          //   fontWeight: "bold",
          //   border: "none",
          //   fontSize: 24,
          //   padding: "12px 32px",
          //   borderRadius: 32,
          //   cursor: "pointer",
          //   boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          // }}
        >
          Nope
        </button>
        <button
          type="button"
          onClick={() => swipe("right")}
          // style={{
          //   background: "#76e2b3",
          //   color: "#222",
          //   fontWeight: "bold",
          //   border: "none",
          //   fontSize: 24,
          //   padding: "12px 32px",
          //   borderRadius: 32,
          //   cursor: "pointer",
          //   boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          // }}
        >
          Like
        </button>
      </div>
    </div>
  );
}
