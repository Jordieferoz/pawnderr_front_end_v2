import { updateUserLocation } from "./api";

export const getUserLocation = (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

export const getGenderColor = (gender: string): string => {
  return gender?.toLowerCase() === "male" ? "#3b82f6" : "#ec4899";
};

let locationUpdatePromise: Promise<{
  latitude: number;
  longitude: number;
} | null> | null = null;

export const ensureUserLocationAndUpdate = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  if (locationUpdatePromise) {
    return locationUpdatePromise;
  }

  locationUpdatePromise = (async () => {
    try {
      const CACHE_KEY = "user_location_cache";
      const EXPIRY_TIME = 24 * 60 * 60 * 1000;

      let latitude: number | null = null;
      let longitude: number | null = null;

      const cachedDataStr = localStorage.getItem(CACHE_KEY);
      if (cachedDataStr) {
        try {
          const cachedData = JSON.parse(cachedDataStr);
          const isExpired = Date.now() - cachedData.timestamp > EXPIRY_TIME;
          if (!isExpired && cachedData.latitude && cachedData.longitude) {
            latitude = cachedData.latitude;
            longitude = cachedData.longitude;
          }
        } catch (e) {
          console.error("Cache parsing error", e);
        }
      }

      if (!latitude || !longitude) {
        const loc = await getUserLocation();
        latitude = loc.latitude;
        longitude = loc.longitude;

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ latitude, longitude, timestamp: Date.now() })
        );
      }

      if (latitude !== null && longitude !== null) {
        // Always sync location with backend once per session/load
        await updateUserLocation({ latitude, longitude });
      }
      return { latitude, longitude };
    } catch (error) {
      locationUpdatePromise = null;
      throw error;
    }
  })();

  return locationUpdatePromise;
};

export const calculateAge = (birthDateInput?: string | Date) => {
  if (!birthDateInput) return null;
  const birthDate = new Date(birthDateInput);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (today.getDate() < birthDate.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months };
};

export const getAgeDisplay = (ageInYears: number, birthDate?: string | Date): string => {
  const ageObj = calculateAge(birthDate);
  if (ageObj) {
    const { years, months } = ageObj;
    const parts: string[] = [];
    if (years > 0) {
      parts.push(`${years} ${years === 1 ? "Year" : "Years"}`);
    }
    if (months > 0) {
      parts.push(`${months} ${months === 1 ? "Month" : "Months"}`);
    }
    if (parts.length === 0) {
      return "Less than 1 Month";
    }
    return parts.join(", ");
  }

  if (ageInYears === 0) {
    return "Less than 1 Year";
  }
  return `${ageInYears} ${ageInYears === 1 ? "Year" : "Years"}`;
};

export const formatAgeText = (gender: string, age: number, birthDate?: string | Date) => {
  const ageStr = getAgeDisplay(age, birthDate);
  return gender ? `${gender}, ${ageStr}` : ageStr;
};

