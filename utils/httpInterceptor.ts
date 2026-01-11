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
  const axiosInstance: AxiosInstance = axios.create();
  axiosInstance.defaults.baseURL = baseURL;

  axiosInstance.interceptors.request.use(
    async function (config: InternalAxiosRequestConfig) {
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }

      // Add static access-token for API key
      if (accessKey) {
        if (baseURL === BASE_URL) {
          config.headers["access-token"] = accessKey;
        } else {
          config.headers["AccessKey"] = accessKey;
        }
      }

      // List of public endpoints that don't require Authorization header
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

      // Only add Authorization header for protected endpoints
      if (!isPublicEndpoint) {
        // First priority: Check for token in sessionStorage (from OTP verification)
        const sessionToken = tokenStorage.getAccessToken();
        if (sessionToken) {
          config.headers["Authorization"] = `Bearer ${sessionToken}`;
        } else {
          // Fallback: Try to get token from NextAuth session
          try {
            const session = await getSession();
            if (session && (session as any).accessToken) {
              config.headers["Authorization"] =
                `Bearer ${(session as any).accessToken}`;
            }
          } catch (error) {
            console.error("❌ Error getting session:", error);
          }
        }
      }

      return config;
    },
    function (error: AxiosError) {
      console.error("❌ Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    function (response: AxiosResponse<TApiResponse>) {
      if (response.status >= 200 && response.status <= 299) {
        return response;
      } else {
        console.error("⚠️ Non-2xx response:", response.status);
        return Promise.reject(response);
      }
    },
    function (error: AxiosError) {
      console.error("❌ API Error:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data || error.message
      });

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        console.warn("🔒 Unauthorized - Clearing tokens and redirecting");
        // Clear tokens from sessionStorage
        tokenStorage.clearTokens();
        // Optional: Redirect to sign-in
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
