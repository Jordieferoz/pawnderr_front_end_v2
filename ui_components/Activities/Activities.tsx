"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import Loader from "@/ui_components/Shared/Loader";
import { showToast } from "@/ui_components/Shared/ToastMessage";
import {
  fetchSubscriptionStatus,
  fetchWhoLikesMe,
  fetchWhomIDisliked,
  fetchWhomILiked,
  swipePetAction,
  undoMatch
} from "@/utils/api";
import { images } from "@/utils/images";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { clearWhoLikesMeCount } from "@/store/matchSlice";

import ActivityCard from "./ActivityCard";
import { ICard } from "./types";

const Activities: FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("likes-me");
  const [cards, setCards] = useState<ICard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
  const [tabCounts, setTabCounts] = useState({
    likesMe: 0,
    youLike: 0,
    viewedProfile: 0
  });

  const whoLikesMeCount = useSelector(
    (state: RootState) => state.match.whoLikesMeCount
  );

  useEffect(() => {
    // Clear badge when component mounts (user enters the route)
    dispatch(clearWhoLikesMeCount());
  }, [dispatch]);

  const handleUndo = async (card: ICard) => {
    if (activeTab !== "you-like" && activeTab !== "viewed-profile") return;

    try {
      await undoMatch({ pet_id: card.id });
      setCards((prev) => prev.filter((item) => item.id !== card.id));
      setTabCounts((prev) => ({
        ...prev,
        youLike:
          activeTab === "you-like"
            ? Math.max(prev.youLike - 1, 0)
            : prev.youLike,
        viewedProfile:
          activeTab === "viewed-profile"
            ? Math.max(prev.viewedProfile - 1, 0)
            : prev.viewedProfile
      }));
    } catch (error: any) {
      showToast({
        type: "error",
        message:
          error?.message || "Unable to undo this activity. Please try again."
      });
    }
  };

  const handleSwipeAction = async (card: ICard, action: "like" | "pass") => {
    try {
      await swipePetAction({ pet_id: card.id, action });
      setCards((prev) => prev.filter((item) => item.id !== card.id));
      setTabCounts((prev) => {
        if (activeTab === "likes-me") {
          return { ...prev, likesMe: Math.max(prev.likesMe - 1, 0) };
        }
        if (activeTab === "viewed-profile") {
          return {
            ...prev,
            viewedProfile: Math.max(prev.viewedProfile - 1, 0)
          };
        }
        return prev;
      });
    } catch (error: any) {
      showToast({
        type: "error",
        message:
          error?.message || "Unable to update this activity. Please try again."
      });
    }
  };

  const tabs = useMemo(
    () => [
      {
        id: "likes-me",
        label: "Who Likes Me",
        count: tabCounts.likesMe,
        hasBadge: whoLikesMeCount > 0
      },
      { id: "you-like", label: "You Like Them", count: tabCounts.youLike },
      {
        id: "viewed-profile",
        label: "You Disliked",
        count: tabCounts.viewedProfile
      }
    ],
    [
      tabCounts.likesMe,
      tabCounts.youLike,
      tabCounts.viewedProfile,
      whoLikesMeCount
    ]
  );

  const mapPetsToCards = (items: any[]): ICard[] => {
    if (!Array.isArray(items)) return [];

    return items.map((item, index) => {
      const pet = item?.pet ?? item?.pet_profile ?? item;
      const gender =
        pet?.gender === "male"
          ? "Male"
          : pet?.gender === "female"
            ? "Female"
            : pet?.gender;
      const ageValue = pet?.age ?? pet?.age_in_years;
      const hasAge = ageValue !== undefined && ageValue !== null;
      const ageText = hasAge
        ? ageValue === 0
          ? "Less than 1 Year"
          : ageValue === 1
            ? "1 Year"
            : `${ageValue} Years`
        : "";
      const infoParts = [gender, ageText].filter(Boolean);

      return {
        id: pet?.id ?? pet?.pet_id ?? item?.id ?? index,
        name: pet?.name || pet?.pet_name || pet?.nickname || "Unknown",
        info: infoParts.length ? `(${infoParts.join(", ")})` : "",
        url:
          pet?.primary_image?.image_url ||
          pet?.image_url ||
          pet?.images?.[0]?.image_url ||
          pet?.photos?.[0]?.image_url ||
          "",
        desc: pet?.bark_o_graphy || pet?.bio || pet?.description || "",
        details: pet?.details || ""
      };
    });
  };

  const getTotalFromPagination = (response: any, fallback: number) => {
    const pagination =
      response?.data?.data?.pagination || response?.data?.pagination || {};
    const total = pagination?.total ?? pagination?.total_count;
    return typeof total === "number" ? total : fallback;
  };

  const fetchActivities = async (targetPage: number, append: boolean) => {
    if (activeTab === "likes-me" && !isSubscribed) {
      setCards([]);
      setHasMore(false);
      return;
    }
    setIsLoading(true);

    try {
      let response: any;
      if (activeTab === "likes-me") {
        response = await fetchWhoLikesMe({ page: targetPage, limit: 20 });
      } else if (activeTab === "you-like") {
        response = await fetchWhomILiked({ page: targetPage, limit: 20 });
      } else {
        response = await fetchWhomIDisliked({ page: targetPage, limit: 20 });
      }

      const items =
        response?.data?.data?.profiles ||
        response?.data?.profiles ||
        response?.profiles ||
        response?.data?.data?.pets ||
        response?.data?.data?.results ||
        response?.data?.pets ||
        response?.data?.results ||
        response?.data ||
        [];
      const mappedCards = mapPetsToCards(items);
      const pagination =
        response?.data?.data?.pagination || response?.data?.pagination || null;
      const totalPages = pagination?.total_pages ?? pagination?.totalPages ?? 1;
      const nextHasMore = targetPage < totalPages;
      const fallbackCount = append
        ? cards.length + mappedCards.length
        : mappedCards.length;
      const tabTotal = getTotalFromPagination(response, fallbackCount);

      setCards((prev) => (append ? [...prev, ...mappedCards] : mappedCards));
      setHasMore(nextHasMore);
      setTabCounts((prev) => ({
        ...prev,
        likesMe: activeTab === "likes-me" ? tabTotal : prev.likesMe,
        youLike: activeTab === "you-like" ? tabTotal : prev.youLike,
        viewedProfile:
          activeTab === "viewed-profile" ? tabTotal : prev.viewedProfile
      }));
    } catch (error: any) {
      setCards((prev) => (append ? prev : []));
      showToast({
        type: "error",
        message:
          error?.message || "Unable to load activities. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      try {
        setIsSubscriptionLoading(true);
        const resp = await fetchSubscriptionStatus();
        setIsSubscribed(Boolean(resp?.data?.is_premium));
      } catch (error: any) {
        setIsSubscribed(false);
        showToast({
          type: "error",
          message:
            error?.message ||
            "Unable to load subscription status. Please try again."
        });
      } finally {
        setIsSubscriptionLoading(false);
      }
    };

    loadSubscriptionStatus();
  }, []);

  useEffect(() => {
    if (isSubscriptionLoading) {
      return;
    }

    const fetchInitialCounts = async () => {
      try {
        const [likesMeResp, youLikeResp, dislikedResp] = await Promise.all([
          isSubscribed
            ? fetchWhoLikesMe({ page: 1, limit: 1 })
            : Promise.resolve(null),
          fetchWhomILiked({ page: 1, limit: 1 }),
          fetchWhomIDisliked({ page: 1, limit: 1 })
        ]);

        setTabCounts({
          likesMe: isSubscribed ? getTotalFromPagination(likesMeResp, 0) : 0,
          youLike: getTotalFromPagination(youLikeResp, 0),
          viewedProfile: getTotalFromPagination(dislikedResp, 0)
        });
      } catch (error: any) {
        showToast({
          type: "error",
          message:
            error?.message ||
            "Unable to load activity counts. Please try again."
        });
      }
    };

    fetchInitialCounts();
  }, [isSubscribed, isSubscriptionLoading]);

  useEffect(() => {
    setCards([]);
    setPage(1);
    setHasMore(true);
    if (!isSubscriptionLoading) {
      fetchActivities(1, false);
    }
  }, [activeTab, isSubscribed, isSubscriptionLoading]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 200;

      if (scrollPosition >= threshold) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchActivities(nextPage, true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, hasMore, isLoading, activeTab]);

  return (
    <div className="activities_wrapper">
      <div className="common_container">
        <div className="flex items-center my-4 justify-between mb-7">
          <div className="flex items-center gap-3">
            <img
              onClick={() => router.back()}
              className="w-9 h-9"
              src={images.backBtn.src}
              alt=""
            />
            <h4 className="display4_medium text-accent-900 flex gap-2 items-center">
              Activities
              <img src={images.pawnderrPlus.src} className="w-8 h-8" alt="" />
            </h4>
          </div>
        </div>
      </div>

      <div className="my-3 flex items-center gap-4.5">
        <ul className="flex pl-8  items-center hide-scrollbar gap-2 flex-nowrap overflow-x-auto snap-x snap-mandatory pr-[var(--container-padding,1rem)]">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex gap-2 shrink-0 items-center rounded-full body_regular py-2 px-3 cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? "bg-blue text-white"
                  : "border border-neutral-white text-light-grey2"
              }`}
            >
              {tab.label}
              <div className="relative">
                <span
                  className={`h-6 w-6 rounded-full flex items-center justify-center ${
                    activeTab === tab.id
                      ? "bg-white text-blue"
                      : "bg-grey-100 text-grey2-700"
                  }`}
                >
                  {tab.count}
                </span>
                {/* @ts-ignore */}
                {tab.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary-600 rounded-full border border-white"></span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative">
        {isLoading && cards.length === 0 ? (
          <div className="flex items-center justify-center h-[480px] text-dark-grey">
            <Loader />
          </div>
        ) : cards.length === 0 ? (
          <div className="flex items-center justify-center h-[480px] text-dark-grey">
            No activities found.
          </div>
        ) : (
          <ActivityCard
            cards={
              !isSubscribed && activeTab === "likes-me"
                ? [cards?.[0] ?? ({} as ICard)]
                : cards
            }
            className={`${!isSubscribed ? "" : ""}`}
            activeTab={activeTab as "likes-me" | "you-like" | "viewed-profile"}
            onPass={
              activeTab === "likes-me"
                ? (card) => handleSwipeAction(card, "pass")
                : undefined
            }
            onLike={
              activeTab === "likes-me" || activeTab === "viewed-profile"
                ? (card) => handleSwipeAction(card, "like")
                : undefined
            }
            onUndo={
              activeTab === "you-like" || activeTab === "viewed-profile"
                ? handleUndo
                : undefined
            }
          />
        )}
        {isLoading && cards.length > 0 && (
          <div className="flex items-center justify-center py-6 text-dark-grey">
            <Loader size={24} />
          </div>
        )}
        {!isSubscribed && activeTab === "likes-me" && (
          <div className="absolute top-0 backdrop-blur-lg w-full bg-white/80 h-[550px] flex items-center justify-center">
            <div className="text-center">
              <h4 className="display2_medium text-accent-900">
                Unlock the Fun
              </h4>
              <p className="heading1_medium text-accent-900 mb-5">
                See Your Profile viewers
              </p>
              <p className="heading4 text-dark-grey mb-12">
                With Premium, your pet doesn’t just <br /> match… they mingle!
                Gain full access to <br /> the Activities Page
              </p>
              <Button className="w-[calc(100%-72px)]">Try PAWNderr+</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
