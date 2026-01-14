"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Profile } from "@/ui_components/Profile";
import { IPetData } from "@/ui_components/Profile/types";
import { fetchMyPet } from "@/utils/api";

export default function ProfilePage() {
  const params = useParams();
  const petId = params.id as string;

  const [petData, setPetData] = useState<IPetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(false);
        const resp = await fetchMyPet(Number(petId));

        const petDetails = resp?.data;

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
