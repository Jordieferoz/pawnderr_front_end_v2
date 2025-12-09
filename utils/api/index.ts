//utils/api/index.ts

import { globalPostService } from "../globalApiService";
import { TResponse } from "../types";

export const userLogin = (payload: any): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`auth/login`, payload)
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

export const registerAuth = (payload: any): Promise<TResponse<any>> => {
  return new Promise((resolve, reject) => {
    globalPostService<any, any>(`auth/register`, payload)
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
