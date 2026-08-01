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

// ── Token refresh coordination ──────────────────────────────────────────────
// A single in-flight refresh is shared across all requests that fail with 401
// at the same time. Concurrent 401s are queued and replayed once the refresh
// resolves (or all rejected if it fails).
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((pending) => {
    if (token) {
      pending.resolve(token);
    } else {
      pending.reject(error);
    }
  });
  failedQueue = [];
};

const redirectToSignIn = () => {
  tokenStorage.clearTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/sign-in";
  }
};

// Calls the refresh endpoint with a bare axios client (no interceptors) to
// avoid recursion, stores the new tokens, and returns the new access token.
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(
    `${BASE_URL}auth/refresh-token`,
    { refreshToken },
    { headers: { "access-token": "key" } }
  );

  const body = response.data;
  const newAccessToken: string | undefined =
    body?.data?.accessToken ?? body?.accessToken;
  const newFirebaseToken: string | undefined =
    body?.data?.firebaseToken ?? body?.firebaseToken;

  if (!newAccessToken) {
    throw new Error("Refresh response did not include an access token");
  }

  tokenStorage.setAccessToken(newAccessToken);
  if (newFirebaseToken) {
    tokenStorage.setFirebaseToken(newFirebaseToken);
  }

  return newAccessToken;
};

function axiosInstanceCreator(baseURL: string | undefined, accessKey?: string) {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    validateStatus: (status) => {
      // ✅ Allow 2xx and 4xx responses
      return status >= 200 && status <= 500;
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
    async (response: AxiosResponse<TApiResponse>) => {
      // ✅ 2xx & 4xx both land here (validateStatus allows up to 500), so a 401
      // due to an expired access token resolves here rather than in the error
      // handler. Attempt a transparent token refresh + retry before giving up.
      if (response.status !== 401) {
        return response;
      }

      const originalRequest = response.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      const isRefreshCall = originalRequest.url?.includes("auth/refresh-token");

      // Never try to refresh the refresh call itself, and never retry twice.
      if (isRefreshCall || originalRequest._retry) {
        redirectToSignIn();
        return response;
      }

      if (!tokenStorage.getRefreshToken()) {
        redirectToSignIn();
        return response;
      }

      originalRequest._retry = true;

      // A refresh is already underway: queue this request and replay it once
      // the new token is available.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: unknown) => reject(err)
          });
        });
      }

      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        redirectToSignIn();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
    (error: AxiosError) => {
      // 🚨 Only real failures (5xx > 500, network, timeout) land here.
      console.error("❌ API Error:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data || error.message
      });

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
