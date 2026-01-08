// utils/pets-storage.ts

export interface Pet {
  id: number;
  [key: string]: any; // Allow other pet properties
}

export interface PetsData {
  my_pets: Pet[];
  [key: string]: any; // Allow other response properties
}

export const petsStorage = {
  get: (): PetsData | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem("userPets");
    return data ? JSON.parse(data) : null;
  },

  set: (petsData: PetsData) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("userPets", JSON.stringify(petsData));
  },

  getFirstPetId: (): number | null => {
    const petsData = petsStorage.get();
    if (petsData?.my_pets && petsData.my_pets.length > 0) {
      return petsData.my_pets[0].id;
    }
    return null;
  },

  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("userPets");
  }
};
