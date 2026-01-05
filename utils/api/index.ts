// utils/api/index.ts

import { globalGetService, globalPostService } from "../globalApiService";
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

export const fetchPets = (): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalGetService<any, any>(`pet/fetch-pets`, {})
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

export const petRegisterInfo = (payload: any): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`pet/register`, payload)
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
