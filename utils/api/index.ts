//utils/api/index.ts

import { globalGetService, globalPostService } from "../globalApiService";
import { TResponse } from "../types";

// Registration (no auth required)
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

// Verify OTP (auth required - token from sessionStorage)
export const verifyOTP = (payload: {
  phone: string;
  otp: string;
}): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`auth/verify-otp`, payload)
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

// Resend OTP (auth required)
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

// Fetch pets (auth required)
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
