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
