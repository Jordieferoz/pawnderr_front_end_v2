"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Profile } from "@/ui_components/Profile";
import { IPetData } from "@/ui_components/Profile/types";
import { fetchPetProfile } from "@/utils/api";

export default function ProfilePage() {
  const params = useParams();
  const petIdParam = params.id;
  const petId = Array.isArray(petIdParam) ? petIdParam[0] : petIdParam;
  const [petData, setPetData] = useState<IPetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(false);
        const resp = await fetchPetProfile(Number(petId));
        const petDetails = resp?.data?.data;

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
  }, [petId]);

  return <Profile petData={petData} loading={loading} error={error} />;
}
