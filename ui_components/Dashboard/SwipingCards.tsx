"use client";
import { useRouter } from "next/navigation";
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

const CardImage: FC<{ src: string; alt: string; className: string }> = ({
  src,
  alt,
  className
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse rounded-[24px]" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${
          loaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        draggable="false"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.src !== images.doggo1.src) {
            target.src = images.doggo1.src;
          }
          setLoaded(true);
        }}
      />
    </>
  );
};

const SwipingCards: FC<ISwipingCardsProps> = ({
  petData,
  loading,
  isSubscribed,
  containerHeight
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [cards, setCards] = useState<ISwipingCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isFetchingPets, setIsFetchingPets] = useState(true);
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
      setCurrentIndex((prev) => prev - 1);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 500);
  };

  // Helper to calculate stack styles based on depth and interpolation ratio
  // depth: integer (0, 1, 2...)
  // ratio: 0 to 1 (0 = at current depth, 1 = at depth-1)
  // Helper to calculate stack styles based on depth and interpolation ratio
  const getStackStyle = (depth: number, ratio: number = 0) => {
    // Current state (at depth)
    const currentScale = 1 - depth * 0.2;
    const currentTranslateY = -depth * 14;
    let currentRotate = 0;
    if (depth === 1) currentRotate = -6;
    else if (depth === 2) currentRotate = 6;
    else if (depth === 3) currentRotate = -6;

    const currentOpacity = depth >= 3 ? 0 : 1;

    // Target state (at depth - 1)
    const nextDepth = Math.max(0, depth - 1);
    const nextScale = 1 - nextDepth * 0.2;
    const nextTranslateY = -nextDepth * 14;
    let nextRotate = 0;
    if (nextDepth === 1) nextRotate = -6;
    else if (nextDepth === 2) nextRotate = 6;
    else if (nextDepth === 3) nextRotate = -6;

    const nextOpacity = nextDepth >= 3 ? 0 : 1;

    // Interpolate
    const scale = currentScale + (nextScale - currentScale) * ratio;
    const translateY =
      currentTranslateY + (nextTranslateY - currentTranslateY) * ratio;
    const rotate = currentRotate + (nextRotate - currentRotate) * ratio;
    const opacity = currentOpacity + (nextOpacity - currentOpacity) * ratio;

    return {
      transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
      opacity
    };
  };

  const updateBackgroundCards = (ratio: number, withTransition: boolean) => {
    // Update next 3 cards (offsets 1, 2, 3)
    [1, 2, 3].forEach((offset) => {
      const idx = currentIndex - offset;
      const card = cardRefs[idx]?.current;
      if (card) {
        card.style.transition = withTransition
          ? "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          : "none";
        const style = getStackStyle(offset, ratio);
        card.style.transform = style.transform;
        card.style.opacity = String(style.opacity);
      }
    });
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
      const ratio = Math.min(Math.abs(mx) / (window.innerWidth / 1.5), 1); // 0 to 1 progress

      if (active) {
        // While dragging - show overlay based on direction
        const rotation = mx / 15;
        card.style.transform = `translateX(${mx}px) rotate(${rotation}deg)`;
        card.style.transition = "none";

        // Animate background cards
        updateBackgroundCards(ratio, false);

        if (Math.abs(mx) > 20) {
          setSwipeDirection(mx > 0 ? "right" : "left");
        } else {
          setSwipeDirection(null);
        }
      } else if (isSwipe) {
        const direction = xDir > 0 ? "right" : "left";
        setIsAnimating(true);
        // Animate background cards to full next state
        updateBackgroundCards(1, true);
        finishSwipe(direction, card);
      } else {
        // Reset top card
        card.style.transform = "translateX(0) rotate(0)";
        card.style.transition = "transform 0.3s ease-out";
        // Reset background cards
        updateBackgroundCards(0, true);
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

    // Animate background cards
    updateBackgroundCards(1, true);

    // Then complete the swipe
    setTimeout(() => {
      finishSwipe(dir, card);
    }, 200);
  };
  useEffect(() => {
    const initDiscovery = async () => {
      if (!petData?.id) {
        return;
      }
      setIsFetchingPets(true);

      setLocationError(null);

      const CACHE_KEY = "user_location_cache";
      const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 1 Day

      try {
        let latitude: number | null = null;
        let longitude: number | null = null;
        let shouldUpdateBackend = false;

        // 1. Check LocalStorage
        const cachedDataStr = localStorage.getItem(CACHE_KEY);
        if (cachedDataStr) {
          const cachedData = JSON.parse(cachedDataStr);
          const isExpired = Date.now() - cachedData.timestamp > EXPIRY_TIME;

          if (!isExpired && cachedData.latitude && cachedData.longitude) {
            latitude = cachedData.latitude;
            longitude = cachedData.longitude;
          }
        }

        // 2. If no valid cache, fetch precise location
        if (!latitude || !longitude) {
          setIsLocationLoading(true);
          const loc = await getUserLocation();
          latitude = loc.latitude;
          longitude = loc.longitude;
          shouldUpdateBackend = true;
          setIsLocationLoading(false);

          // Save to cache
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ latitude, longitude, timestamp: Date.now() })
          );
        }

        // 3. Only update backend if we fetched a fresh location
        if (shouldUpdateBackend && latitude !== null && longitude !== null) {
          await updateUserLocation({
            latitude,
            longitude
          });
        }

        const response = await discoverNearbyPets(petData.id);

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

              return {
                id: pet.id,
                name: pet.name || pet.nickname || "Unknown",
                info: `(${genderDisplay}, ${ageText})`,
                url: pet.primary_image?.image_url || "",
                desc: pet.bark_o_graphy || "",
                gender: pet.gender,
                isFoundingDog: pet.is_founding_dog,
                isVerified: pet.is_verified,
                isPremium: pet.is_premium_user
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
        setIsFetchingPets(false);
      }
    };

    initDiscovery();
  }, [petData?.id]);

  if (loading || isLocationLoading || isFetchingPets) {
    let loadingText = "Loading your pet details...";
    if (isLocationLoading) {
      loadingText =
        "Fetching your location. Please allow location access to discover nearby pets.";
    } else if (isFetchingPets) {
      loadingText = "Finding nearby pets...";
    }

    return (
      <div
        className="w-full max-w-[340px] relative mx-auto flex items-center justify-center"
        style={{ height: containerHeight ? `${containerHeight}px` : "520px" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-600 text-center px-4">
            {loadingText}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div
      className="w-full max-w-[340px] relative mx-auto"
      style={{ height: containerHeight ? `${containerHeight}px` : "520px" }}
    >
      <div className="relative h-full">
        {cards.map((card, idx) => {
          // const isActive = idx <= currentIndex;
          const isTop = idx === currentIndex;

          if (idx > currentIndex || idx < currentIndex - 3) return null;

          const depth = currentIndex - idx;
          const scale = 1 - depth * 0.2;
          const translateY = -depth * 14;

          let rotate = 0;
          if (depth === 1) rotate = -6;
          else if (depth === 2) rotate = 6;
          else if (depth === 3) rotate = -6;

          // Fade out the 4th card, others full opacity
          const opacity = depth >= 3 ? 0 : 1;

          return (
            <div
              key={card.id}
              ref={cardRefs[idx]}
              {...(isTop ? bind(idx) : {})}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full touch-none"
              style={{
                zIndex: idx,
                pointerEvents: isTop && !isAnimating ? "auto" : "none",
                opacity,
                transform: !isTop
                  ? `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`
                  : undefined,
                transition: !isTop
                  ? "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  : undefined,
                transformOrigin: "top center"
              }}
            >
              <div
                className="relative w-full max-w-[340px] rounded-[24px] border-[5px] border-white 
                  shadow-[0px_4px_10px_0px_rgba(0,0,0,0.1)] flex items-end justify-center overflow-hidden mx-auto"
                style={{
                  height: containerHeight
                    ? `${containerHeight - 100}px`
                    : "420px",
                  transition: isTop
                    ? "none"
                    : "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transformOrigin: "center top",
                  width: "100%",
                  boxShadow: "0px 4px 10px 0px rgba(0,0,0,0.1)"
                }}
              >
                <CardImage
                  src={card.url || images.doggo1.src}
                  alt={card.name}
                  className="w-full h-full absolute top-0 left-0 rounded-[24px] object-cover"
                />
                <img
                  src={images.profileOverlay.src}
                  alt="profileOverlay"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />

                {card?.isFoundingDog && !swipeDirection && (
                  <img
                    src={images.isFoundingDog.src}
                    alt="foundingDog"
                    className="absolute top-2.5 left-2.5"
                  />
                )}
                {card?.isPremium && !swipeDirection && (
                  <img
                    src={images.premiumBadge.src}
                    className="absolute top-2.5 left-2.5"
                    alt="premiumBadge"
                  />
                )}
                {isTop && swipeDirection && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className={`absolute top-6 text-2xl font-bold uppercase tracking-wider px-4 py-1.5 rounded-lg border-[3px] transition-opacity duration-200  ${
                        swipeDirection === "right"
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
                      {card?.isVerified && (
                        <img src={images.verified.src} alt="verified" />
                      )}
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
        <div className="flex justify-center items-center gap-5 absolute bottom-17 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => programmaticSwipe("left")}
            disabled={!canSwipe}
            className="bg-white rounded-full w-[55px] h-[55px] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src={images.dislike.src} alt="Dislike" className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              if (cards[currentIndex]?.id) {
                router.push(`/profile/${cards[currentIndex].id}?action=true`);
              }
            }}
            className="bg-primary-500 rounded-full w-[68px] h-[68px] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
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
            <img src={images.like.src} alt="Like" className="w-[28px]" />
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
