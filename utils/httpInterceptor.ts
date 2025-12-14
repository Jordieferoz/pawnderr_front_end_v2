// httpInterceptor.ts

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { TApiResponse } from "./types";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function axiosInstanceCreator(baseURL: string | undefined, accessKey?: string) {
  const axiosInstance: AxiosInstance = axios.create();
  axiosInstance.defaults.baseURL = baseURL;

  axiosInstance.interceptors.request.use(
    function (config: InternalAxiosRequestConfig) {
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

      // Add Bearer token if available (for authenticated requests)
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    function (error: AxiosError) {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    function (response: AxiosResponse<TApiResponse>) {
      if (response.status >= 200 && response.status <= 299) {
        return response;
      } else {
        return Promise.reject(response);
      }
    },
    function (error: AxiosError) {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

const mainInstance = axiosInstanceCreator(BASE_URL, "key");

export const API_INSTANCES = {
  mainInstance: mainInstance,
};
export default API_INSTANCES;
