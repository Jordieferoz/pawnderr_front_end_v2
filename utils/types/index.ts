// utils/types/index.ts

export type TApiResponse<T = unknown> = {
  data: T;
  status_code: number;
  message: string;
  success?: boolean;
};

export type TResponse<T> = {
  data: T;
  statusCode: number;
  message: string;
  success?: boolean;
  error?: {
    code: number;
    message: string;
  };
};
