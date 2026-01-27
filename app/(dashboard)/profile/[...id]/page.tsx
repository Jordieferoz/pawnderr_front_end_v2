"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Profile } from "@/ui_components/Profile";
import { IPetData } from "@/ui_components/Profile/types";
import { fetchMyPet, fetchPetProfile } from "@/utils/api";

export default function ProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const petIdParam = params.id;
  const petId = Array.isArray(petIdParam) ? petIdParam[0] : petIdParam;

  const action = searchParams.get("action");
  const isAction = action === "true";

  const [petData, setPetData] = useState<IPetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(false);
        let petDetails;

        if (isAction) {
          const resp = await fetchPetProfile(Number(petId));
          petDetails = resp?.data?.data;
        } else {
          const resp = await fetchMyPet(Number(petId));
          petDetails = resp?.data;
        }

        if (!petDetails) {
          setError(true);
        } else {
          setPetData(petDetails);
        }
      } catch (error) {
        console.error("Error fetching pet:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (petId) {
      fetchData();
    }
  }, [petId, isAction]);

  return <Profile petData={petData} loading={loading} error={error} />;
}
