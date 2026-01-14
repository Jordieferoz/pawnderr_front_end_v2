// utils/httpInterceptor.ts

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";
import { getSession } from "next-auth/react";

import { tokenStorage } from "./token-storage";
import { TApiResponse } from "./types";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function axiosInstanceCreator(baseURL: string | undefined, accessKey?: string) {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    validateStatus: (status) => {
      // ✅ Allow 2xx and 4xx responses
      return status >= 200 && status < 500;
    }
  });

  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }

      if (accessKey) {
        if (baseURL === BASE_URL) {
          config.headers["access-token"] = accessKey;
        } else {
          config.headers["AccessKey"] = accessKey;
        }
      }

      const publicEndpoints = [
        "auth/login",
        "auth/register",
        "auth/verify-registration",
        "auth/resend-otp",
        "auth/send-otp"
      ];

      const isPublicEndpoint = publicEndpoints.some((endpoint) =>
        config.url?.includes(endpoint)
      );

      if (!isPublicEndpoint) {
        const sessionToken = tokenStorage.getAccessToken();
        if (sessionToken) {
          config.headers.Authorization = `Bearer ${sessionToken}`;
        } else {
          try {
            const session = await getSession();
            if (session && (session as any).accessToken) {
              config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
            }
          } catch (error) {
            console.error("❌ Error getting session:", error);
          }
        }
      }

      return config;
    }
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse<TApiResponse>) => {
      // ✅ 2xx & 4xx both land here
      return response;
    },
    (error: AxiosError) => {
      // 🚨 Only real failures (5xx, network, timeout)
      console.error("❌ API Error:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data || error.message
      });

      if (error.response?.status === 401) {
        tokenStorage.clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/sign-in";
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

const mainInstance = axiosInstanceCreator(BASE_URL, "key");

export const API_INSTANCES = {
  mainInstance: mainInstance
};
export default API_INSTANCES;
