"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Profile } from "@/ui_components/Profile";
import { IPetData } from "@/ui_components/Profile/types";
import { fetchMyPet, fetchPetProfile } from "@/utils/api";

export default function ProfilePage() {
  const params = useParams();
  const petIdParam = params.id;
  const petId = Array.isArray(petIdParam) ? petIdParam[0] : petIdParam;
  const [petData, setPetData] = useState<IPetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!petId) {
        setLoading(false);
        return;
      }

      try {
        setError(false);
        const id = Number(petId);
        let petDetails: IPetData | null = null;

        // Own pet → GET /pet/:id (full details + badges)
        try {
          const ownResp = await fetchMyPet(id);
          if (ownResp?.data?.id) {
            petDetails = ownResp.data;
          }
        } catch {
          // Not owned by current user
        }

        // Other pet (or own fetch failed) → GET /pet/:id/profile
        if (!petDetails) {
          const profileResp = await fetchPetProfile(id);
          petDetails = profileResp?.data?.data ?? null;
        }

        if (!petDetails) {
          setError(true);
        } else {
          setPetData(petDetails);
        }
      } catch (err) {
        console.error("Error fetching pet:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [petId]);

  return <Profile petData={petData} loading={loading} error={error} />;
}
