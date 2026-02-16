"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

import { fetchActiveMatches } from "@/utils/api";

import { images } from "@/utils/images";

import { MatchedCard } from ".";
import { Loader } from "../Shared";

const Matches: FC = () => {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(matches, "matches");
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
        setMatches(matchesData ?? []);
      } catch (error) {
        console.error("Failed to fetch matches data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

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
        <MatchedCard matches={matches} indicators={indicators} />
      )}
    </div>
  );
};

export default Matches;
