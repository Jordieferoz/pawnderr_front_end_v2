// utils/pets-storage.ts

export interface Pet {
  id: number;
  [key: string]: any; // Allow other pet properties
}

export interface PetsData {
  my_pets: Pet[];
  [key: string]: any; // Allow other response properties
}

// Custom event name used to notify when the stored pets data changes.
export const PETS_STORAGE_EVENT = "userPetsStorageChanged";

const dispatchPetsEvent = () => {
  if (typeof window === "undefined") return;

  try {
    window.dispatchEvent(new Event(PETS_STORAGE_EVENT));
  } catch {
    // Ignore event dispatch errors in non-browser-like environments
  }
};

export const petsStorage = {
  get: (): PetsData | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem("userPets");
    return data ? JSON.parse(data) : null;
  },

  set: (petsData: PetsData) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("userPets", JSON.stringify(petsData));
    dispatchPetsEvent();
  },

  getFirstPetId: (): number | null => {
    const petsData = petsStorage.get();
    if (petsData?.my_pets && petsData.my_pets.length > 0) {
      return petsData.my_pets[0].id;
    }
    return null;
  },

  getFirstPet: (): Pet | null => {
    const petsData = petsStorage.get();
    if (petsData?.my_pets && petsData.my_pets.length > 0) {
      return petsData.my_pets[0];
    }
    return null;
  },

  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("userPets");
    dispatchPetsEvent();
  }
};
