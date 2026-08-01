"use client";

import { useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { decrementUnseenMatchCount } from "@/store/matchSlice";
import { fetchActiveMatches, markMatchAsSeen } from "@/utils/api";

import { images } from "@/utils/images";

import { MatchedCard } from ".";
import { Loader } from "../Shared";

const Matches: FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const [matches, setMatches] = useState<any[]>([]);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const [matchesResponse] = await Promise.all([
          fetchActiveMatches({
            page: 1,
            limit: 20,
            state: "active"
          })
        ]);

        // Assuming response.data contains the array or a paginated object
        const matchesData = matchesResponse.data?.data.matches || [];
        // Matches are no longer marked as seen simply by opening this page.
        // The `is_unseen` flags are preserved so each card can render the
        // "New" badge until the user actually interacts with that match.
        setMatches(matchesData ?? []);
      } catch (error) {
        console.error("Failed to fetch matches data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  // Marks a single match as seen when the user interacts with it (opening the
  // chat, viewing the profile, or flipping the card). Updates local card state
  // and decrements the global unseen indicator.
  const handleMarkSeen = useCallback(
    async (matchId: number | string) => {
      const numericMatchId = Number(matchId);
      if (!Number.isFinite(numericMatchId)) return;

      const target = matches.find(
        (match) =>
          Number(match.match_id ?? match.id) === numericMatchId &&
          match.is_unseen
      );
      if (!target) return;

      setMatches((current) =>
        current.map((match) =>
          Number(match.match_id ?? match.id) === numericMatchId
            ? { ...match, is_unseen: false }
            : match
        )
      );
      dispatch(decrementUnseenMatchCount(1));

      try {
        await markMatchAsSeen(numericMatchId);
      } catch (error) {
        console.error("Failed to mark match as seen:", error);
      }
    },
    [matches, dispatch]
  );

  return (
    <div className="matches_wrapper common_container pb-35 md:pb-10">
      <div className="flex items-start my-4 justify-between mb-7">
        <div className="flex items-center gap-3">
          <img
            onClick={() => router.back()}
            className="w-10 h-10 cursor-pointer"
            src={images.backBtn.src}
            alt="back"
          />
          <h4 className="display4_medium text-accent-900">Matches</h4>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size={40} text="Loading matches..." />
        </div>
      ) : (
        <MatchedCard
          matches={matches}
          indicators={indicators}
          onMarkSeen={handleMarkSeen}
        />
      )}
    </div>
  );
};

export default Matches;
