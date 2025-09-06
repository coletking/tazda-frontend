import { AxiosRequestConfig } from "axios";
import api from "./api";

/**
 * Handles all GET requests
 */
export async function getService<T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.get<T>(endpoint, config);
  return response.data;
}

/**
 * Handles all POST requests
 */
export async function postService<T>(
  endpoint: string,
  body: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.post<T>(endpoint, body, config);
  return response.data;
}
