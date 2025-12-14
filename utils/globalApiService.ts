import { AxiosResponse } from "axios";

import API_INSTANCES from "./httpInterceptor";
import { TResponse } from "./types";

export const globalGetService = <TParamType, U>(
  url: string,
  params: TParamType,
  instance: keyof typeof API_INSTANCES = "mainInstance",
): Promise<TResponse<U>> => {
  return new Promise(function (resolve, reject) {
    API_INSTANCES[instance]({
      method: "GET",
      url: url,
      params: params,
    })
      .then((response: AxiosResponse<U>) => {
        const _response: TResponse<U> = {
          data: response.data,
          statusCode: response.status,
          message: response.statusText,
        };
        resolve(_response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const globalPostService = <TDataType, U>(
  url: string,
  data: TDataType,
  instance: keyof typeof API_INSTANCES = "mainInstance",
): Promise<TResponse<U>> => {
  return new Promise(function (resolve, reject) {
    API_INSTANCES[instance]({
      method: "POST",
      url: url,
      data: data,
    })
      .then((response: AxiosResponse<U>) => {
        const _response: TResponse<U> = {
          data: response.data,
          statusCode: response.status,
          message: response.statusText,
        };
        resolve(_response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const globalDeleteService = <TParamType, U>(
  url: string,
  params: TParamType,
  instance: keyof typeof API_INSTANCES = "mainInstance",
): Promise<TResponse<U>> => {
  return new Promise(function (resolve, reject) {
    API_INSTANCES[instance]({
      method: "DELETE",
      url: url,
      params: params,
    })
      .then((response: AxiosResponse<U>) => {
        const _response: TResponse<U> = {
          data: response.data,
          statusCode: response.status,
          message: response.statusText,
        };
        resolve(_response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const globalApiService = <TDataType, TApiResponse>(
  url: string,
  data: TDataType,
  method: string,
  instance: keyof typeof API_INSTANCES = "mainInstance",
  userId?: string,
): Promise<TResponse<TApiResponse>> => {
  return new Promise(function (resolve, reject) {
    const config: any = {
      method: method,
      url: url,
      data: data,
      headers: {}, // Initialize headers object
    };

    API_INSTANCES[instance](config)
      .then((response: AxiosResponse<TApiResponse>) => {
        const _response: TResponse<TApiResponse> = {
          data: response.data,
          statusCode: response.status,
          message: response.statusText,
          ...(response.data &&
            typeof response.data === "object" &&
            "success" in response.data &&
            typeof response.data.success === "boolean" && {
              success: response.data.success as boolean,
            }),
        };
        resolve(_response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
