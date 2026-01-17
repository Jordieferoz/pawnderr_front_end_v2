// utils/api/index.ts

import {
  globalDeleteService,
  globalGetService,
  globalPostService,
  globalPutService
} from "../globalApiService";
import { TResponse } from "../types";
import { PhotoUploadResponse } from "./types";

export const registerAuth = (payload: {
  email: string;
  password: string;
  name: string;
  phone: string;
  gender: string;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`auth/register`, payload)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const verifyOTP = (payload: {
  phone: string;
  otp: string;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`auth/verify-registration`, payload)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const loginWithPhone = (payload: {
  phone: string;
  password: string;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`auth/login`, payload)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const resendOTP = (payload: {
  phone: string;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`auth/resend-otp`, payload)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchSubscriptionPlans = (): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`subscription/plans`, {})
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.data);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchSubscriptionFeatures = (): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`subscription/features`, {})
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.data);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchPetRegistrationData = (): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`pet/registration-data`, {})
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchUserProfile = (): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`user/profile`, {})
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateUserProfile = (payload: {
  name: string;
  email: string;
  phone: string;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPutService<any, any>(`user/profile`, payload)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updatePetInfo = (
  id: number,
  payload: any
): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPutService<any, any>(`pet/${id}`, payload)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchSubscriptionStatus = (): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`subscription/status`, {})
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.data);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchSubscriptionHistory = (): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`subscription/history`, {})
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.data);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const cancelSubscription = (payload: {
  cancellation_reason?: string;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`subscription/cancel`, payload)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response.data);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const petRegisterInfo = (payload: any): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`pet/register`, payload)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const uploadPetPhoto = (
  file: File | Blob
): Promise<TResponse<PhotoUploadResponse>> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("photo", file);

    globalPostService<FormData, PhotoUploadResponse>(
      `pet/photo/upload`,
      formData
    )
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const petPreferencesInfo = (payload: any): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`pet/register-preferences`, payload)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createSubscriptionOrder = (
  planId: number
): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`subscription/create-order`, {
      plan_id: planId
    })
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response.data);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const verifySubscriptionPayment = (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan_id: number;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`subscription/verify-payment`, paymentData)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response.data);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchMyPetsCollection = (): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`pet/fetch-pets`, {})
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.data);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const fetchMyPet = (id: number): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`pet/${id}`, {})
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.data);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchPetProfile = (petId: number): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`pet/${petId}/profile`, {})
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updatePetPreferences = (
  id: number,
  payload: any
): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPutService<any, any>(`pet/${id}/preferences`, payload)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addPetPhoto = (
  petId: number,
  file: File | Blob
): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("photo", file);

    globalPostService<any, any>(`pet/${petId}/photo`, formData)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deletePetPhoto = (
  petId: number,
  imageId: any
): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalDeleteService<any, any>(`pet/${petId}/photo/${imageId}`, null)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const reorderPetPhotos = (
  petId: number,
  payload: any
): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPutService<any, any>(`pet/${petId}/photos/reorder`, payload)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const checkCanChat = (payload: {
  from_pet_id: number;
  to_pet_id: number;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`chat/can-chat`, payload)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const messageInitiated = (payload: {
  chat_id: string;
  from_pet_id: number;
  to_pet_id: number;
  match_id: number;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`chat/message-initiated`, payload)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchActiveMatches = (params: {
  page: number;
  limit: number;
  state: "active";
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`match/matches`, params)
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const discoverNearbyPets = (petId: number): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`discovery/nearby/${petId}`, {})
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.data);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateUserLocation = (payload: {
  latitude: number;
  longitude: number;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`discovery/location`, payload)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const swipePetAction = (payload: {
  pet_id: number;
  action: "like" | "pass";
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`match/like`, payload)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchFirebaseToken = (): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`auth/firebase-token`, {})
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected status code: ${response.statusCode}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchWhomILiked = (params: {
  page: number;
  limit: number;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`match/whom-i-liked`, params)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchWhoLikesMe = (params: {
  page: number;
  limit: number;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`match/who-likes-me`, params)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchWhomIDisliked = (params: {
  page: number;
  limit: number;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`match/whom-i-disliked`, params)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const undoMatch = (payload: {
  pet_id: number;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`match/undo`, payload)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
