"use client";

import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import {
  fetchActiveMatches,
  fetchWhoLikesMe,
  fetchWhomIDisliked,
  fetchWhomILiked
} from "@/utils/api";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IYourStatsProps } from "./types";

const YourStats: FC<IYourStatsProps> = ({ borderColor }) => {
  const router = useRouter();
  const isSubscribed = useSelector(
    (state: RootState) => state.subscription.isSubscribed
  );

  const [stats, setStats] = useState({
    matches: 0,
    likesMe: 0,
    youLiked: 0,
    youDisliked: 0
  });

  const getTotalFromPagination = (response: any, fallback: number) => {
    const pagination =
      response?.data?.data?.pagination || response?.data?.pagination || {};
    const total = pagination?.total ?? pagination?.total_count;
    return typeof total === "number" ? total : fallback;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [likesMeResp, youLikeResp, dislikedResp, matchesResp] =
          await Promise.all([
            isSubscribed
              ? fetchWhoLikesMe({ page: 1, limit: 1 })
              : Promise.resolve(null),
            fetchWhomILiked({ page: 1, limit: 1 }),
            fetchWhomIDisliked({ page: 1, limit: 1 }),
            fetchActiveMatches({ page: 1, limit: 1, state: "active" })
          ]);

        setStats({
          likesMe: isSubscribed ? getTotalFromPagination(likesMeResp, 0) : 0, // Should be unseenMatchesResp?.data?.who_likes_me but let's just show 0 or keep hidden if needed. For now 0.
          youLiked: getTotalFromPagination(youLikeResp, 0),
          youDisliked: getTotalFromPagination(dislikedResp, 0),
          matches: getTotalFromPagination(matchesResp, 0)
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [isSubscribed]);

  return (
    <div
      className="bg-white hidden min-h-[589px] lg:flex w-[320px] shrink-0 rounded-xl border-2 shadow-[0px_4px_19.1px_7px_#0000000A] p-4 flex-col h-[520px] md:h-[560px]"
      style={{ borderColor }}
    >
      <div className="bg-secondary-400 rounded py-2 px-4 mb-6">
        <h3 className="text-secondary-800 text-base font_fredoka">
          Your Stats
        </h3>
      </div>

      <div className="flex-1 flex flex-col gap-5 font_fredoka">
        <div className="flex justify-between items-center text-dark-grey text-2xl font-medium px-2">
          <span>Matches</span>
          <span>{stats.matches}</span>
        </div>
        <div className="border-b border-dashed border-gray-200"></div>

        <div className="flex justify-between items-center text-dark-grey text-2xl font-medium px-2">
          <span>Likes You</span>
          <span>{stats.likesMe}</span>
        </div>
        <div className="border-b border-dashed border-gray-200"></div>

        <div className="flex justify-between items-center text-dark-grey text-2xl font-medium px-2">
          <span>You Liked</span>
          <span>{stats.youLiked}</span>
        </div>
        <div className="border-b border-dashed border-gray-200"></div>

        <div className="flex justify-between items-center text-dark-grey text-2xl font-medium px-2">
          <span>You Disliked</span>
          <span>{stats.youDisliked}</span>
        </div>
      </div>

      <div className="mt-auto pt-6 pb-3">
        <Button
          className="font_fredoka font-medium w-full"
          onClick={() => router.push("/activities")}
        >
          View Activities
        </Button>
      </div>
    </div>
  );
};

export default YourStats;
