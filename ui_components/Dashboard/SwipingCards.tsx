"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { openHangTightModal, openOutOfSwipesModal } from "@/store/modalSlice";
import { getUserLocation } from "@/utils";
import {
  discoverNearbyPets,
  swipePetAction,
  updateUserLocation
} from "@/utils/api";
import { images } from "@/utils/images";
import { useDrag } from "@use-gesture/react";
import { HangTightModal, OutOfSwipesModal } from "../Modals";
import { ISwipingCard, ISwipingCardsProps, NearbyPet } from "./types";

const SwipingCards: FC<ISwipingCardsProps> = ({ petData, loading, isSubscribed }) => {
  const dispatch = useDispatch();
  const [cards, setCards] = useState<ISwipingCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const cardRefs = useMemo(
    () =>
      Array(cards.length)
        .fill(0)
        .map(() => React.createRef<HTMLDivElement>()),
    [cards.length]
  );

  const canSwipe = currentIndex >= 0;

  const finishSwipe = (direction: "left" | "right", element: HTMLElement) => {
    const moveOutWidth = window.innerWidth * 1.5;
    const translateX = direction === "right" ? moveOutWidth : -moveOutWidth;
    const rotation = direction === "right" ? 30 : -30;

    element.style.transform = `translateX(${translateX}px) rotate(${rotation}deg)`;
    element.style.transition = "transform 0.5s ease-out";
    element.style.opacity = "0";

    const swipedCard = cards[currentIndex];
    if (swipedCard) {
      swipePetAction({
        pet_id: swipedCard.id,
        action: direction === "right" ? "like" : "pass"
      })
        .then((resp) => {
          const statusCode = resp && resp.statusCode;
          const apiMessage = resp?.data?.message;

          if (statusCode === 403 && apiMessage === "DAILY_LIKE_LIMIT_REACHED") {
            dispatch(openOutOfSwipesModal());
          } else if (
            !isSubscribed &&
            direction === "right" &&
            resp?.data?.is_match === false
          ) {
            dispatch(
              openHangTightModal({
                userImage: petData?.images?.[0]?.image_url || "",
                matchImage: swipedCard.url,
                userGender: petData?.gender || "male",
                matchGender: swipedCard.gender
              })
            );
          }
        })
        .catch((error) => {
          console.error("❌ swipePetAction failed:", error);
        });
    }

    setTimeout(() => {
      console.log(cards[currentIndex], "cards[currentIndex].");
      console.log(`Swiped ${direction} on ${cards[currentIndex].name}`);
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
      velocity: [vx]
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
      filterTaps: true
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
  useEffect(() => {
    const initDiscovery = async () => {
      if (!petData?.id) return;

      setLocationError(null);
      setIsLocationLoading(true);

      try {
        const { latitude, longitude } = await getUserLocation();

        await updateUserLocation({
          latitude,
          longitude
        });

        const response = await discoverNearbyPets(petData.id);
        console.log(response, "nearby pets response");

        // Transform API response to cards format
        if (response?.data?.pets && Array.isArray(response.data.pets)) {
          const transformedCards: ISwipingCard[] = response.data.pets.map(
            (pet: NearbyPet) => {
              let genderDisplay = pet.gender;
              if (pet.gender === "male") {
                genderDisplay = "Male";
              } else if (pet.gender === "female") {
                genderDisplay = "Female";
              }

              let ageText = `${pet.age} Years`;
              if (pet.age === 0) {
                ageText = "Less than 1 Year";
              } else if (pet.age === 1) {
                ageText = "1 Year";
              }
              console.log(pet, 'pet')
              return {
                id: pet.id,
                name: pet.name || pet.nickname || "Unknown",
                info: `(${genderDisplay}, ${ageText})`,
                url: pet.primary_image?.image_url || "",
                desc: pet.bark_o_graphy || "",
                gender: pet.gender,
                isFoundingDog: pet.is_founding_dog,
                isVerified: pet.is_verified
              };
            }
          );

          setCards(transformedCards);
          setCurrentIndex(transformedCards.length - 1);
        } else {
          setCards([]);
          setCurrentIndex(-1);
        }
      } catch (error: any) {
        console.error("Error initializing discovery:", error);

        const message =
          error?.message === "User denied Geolocation"
            ? "We need your location to show nearby pets. Please allow location access in your browser/app and try again."
            : "Unable to fetch your location. Please check your location settings and try again.";

        setLocationError(message);
        setCards([]);
        setCurrentIndex(-1);
      } finally {
        setIsLocationLoading(false);
      }
    };

    initDiscovery();
  }, [petData?.id]);

  if (loading || isLocationLoading) {
    return (
      <div className="w-full max-w-[340px] h-[520px] relative mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-600 text-center px-4">
            {loading
              ? "Loading your pet details..."
              : "Fetching your location. Please allow location access to discover nearby pets."}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full max-w-[340px] h-[520px] relative mx-auto">
      <div className="relative h-full">
        {cards.map((card, idx) => {
          const isActive = idx <= currentIndex;
          const isTop = idx === currentIndex;

          if (!isActive) return null;

          return (
            <div
              key={card.id}
              ref={cardRefs[idx]}
              {...(isTop ? bind(idx) : {})}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full touch-none"
              style={{
                zIndex: idx,
                pointerEvents: isTop && !isAnimating ? "auto" : "none"
              }}
            >
              <div
                className="relative w-full max-w-[340px] h-[420px] rounded-[24px] border-[5px] border-white 
                  shadow-[0px_4px_10px_0px_rgba(0,0,0,0.1)] flex items-end justify-center overflow-hidden mx-auto"
                style={{
                  transition: isTop
                    ? "none"
                    : "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transformOrigin: "center bottom"
                }}
              >
                <img
                  src={card.url || images.doggo1.src}
                  alt={card.name}
                  className="w-full h-full absolute top-0 left-0 rounded-[24px] object-cover"
                  draggable="false"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== images.doggo1.src) {
                      target.src = images.doggo1.src;
                    }
                  }}
                />

                <div className="absolute inset-0 card_gradient rounded-[24px]" />

                {card?.isFoundingDog && !swipeDirection && (
                  <img src={images.isFoundingDog.src} alt="isFoundingDog" className="absolute top-2.5 left-2.5" />
                )}
                {isTop && swipeDirection && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className={`absolute top-6 text-2xl font-bold uppercase tracking-wider px-4 py-1.5 rounded-lg border-[3px] transition-opacity duration-200  ${swipeDirection === "right"
                        ? "left-6 text-secondary-700 border-secondary-700 rotate-[-20deg]"
                        : "right-6 text-secondary-600 border-secondary-600 rotate-[20deg]"
                        }`}
                      style={{
                        textShadow: "0 0 10px rgba(0,0,0,0.3)"
                      }}
                    >
                      {swipeDirection === "right" ? "WOOF!" : "GRRR"}
                    </div>
                  </div>
                )}

                <div className="absolute bottom-17 left-6 right-6 z-10 text-white">
                  <h3 className="text-2xl font-semibold leading-tight">
                    {card.name}{" "}
                    <span className="text-base font-normal opacity-90 inline-flex items-center gap-1">
                      {card.info}
                      {card?.isVerified && <img src={images.verified.src} alt="verified" />}
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

      {/* Show action buttons whenever we have any cards and no location error */}
      {cards.length > 0 && !locationError && (
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
            <img
              src={images.like.src}
              alt="Like"
              className="w-[33px] h-[33px]"
            />
          </button>
        </div>
      )}

      {locationError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-xs text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Location needed
            </h3>
            <p className="text-sm text-gray-600 mb-3">{locationError}</p>
            <p className="text-xs text-gray-500">
              Enable location permission in your browser/app settings and reload
              this page.
            </p>
          </div>
        </div>
      )}

      {!canSwipe && !isAnimating && !locationError && cards.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <p className="text-xl font-semibold text-gray-800">
              No pets found nearby! 🐕
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Check back later for more matches
            </p>
          </div>
        </div>
      )}

      {!canSwipe && !isAnimating && !locationError && cards.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <p className="text-xl font-semibold text-gray-800">
              No more pets to view...
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Check back later for more matches
            </p>
          </div>
        </div>
      )}
      <HangTightModal />
      <OutOfSwipesModal />
    </div>
  );
};

export default SwipingCards;
