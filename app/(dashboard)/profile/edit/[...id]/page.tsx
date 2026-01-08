"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { EditProfile } from "@/ui_components/Profile";
import { IPetData } from "@/ui_components/Profile/types";
import { fetchPetProfile } from "@/utils/api";

export default function ProfileEditPage() {
  const params = useParams();
  const petId = params.id as string;

  const [petData, setPetData] = useState<IPetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!petId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchPetProfile(Number(petId));
        // API response structure: { data: { data: {...pet data...}, message, status }, statusCode, message }
        const petProfileData = response.data?.data || response.data;
        console.log(petProfileData, "petProfileData");
        if (petProfileData) {
          setPetData(petProfileData);
        }
      } catch (error) {
        console.error("Error fetching pet profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [petId]);

  return <EditProfile petData={petData} loading={loading} />;
}
