import axios from 'axios';
import type { ApiResponse } from '../types';

export const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bloodbridge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const apiHelper = {
  get: <T>(url: string) => axiosClient.get<unknown, ApiResponse<T>>(url),
  post: <T>(url: string, data?: unknown) => axiosClient.post<unknown, ApiResponse<T>>(url, data),
  put: <T>(url: string, data?: unknown) => axiosClient.put<unknown, ApiResponse<T>>(url, data),
  patch: <T>(url: string, data?: unknown) => axiosClient.patch<unknown, ApiResponse<T>>(url, data),
};
