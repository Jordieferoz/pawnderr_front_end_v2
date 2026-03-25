"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { EditProfile } from "@/ui_components/Profile";
import { IPetData } from "@/ui_components/Profile/types";
import { fetchPetProfile } from "@/utils/api";

export default function ProfileEditPage() {
  const params = useParams();
  const petId = params.id as string;

  const [petData, setPetData] = useState<IPetData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!petId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchPetProfile(Number(petId));
      // API response structure: { data: { data: {...pet data...}, message, status }, statusCode, message }
      const petProfileData = response.data?.data || response.data;

      if (petProfileData) {
        setPetData(petProfileData);
      }
    } catch (error) {
      console.error("Error fetching pet profile:", error);
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <EditProfile
      petData={petData}
      loading={loading}
      refetchPetData={fetchData}
    />
  );
}
