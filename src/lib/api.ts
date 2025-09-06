import axios, { AxiosRequestConfig } from "axios";

export const API_BASE_URL = "https://jj4zhtz8cg.execute-api.us-east-1.amazonaws.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Generic API request helper
export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST",
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await api.request<T>({
      url: endpoint,
      method,
      data: body,
      ...config,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data && (error.response.data as { message?: string }).message
          ? (error.response.data as { message: string }).message
          : "Something went wrong";
      throw new Error(message);
    }
    throw new Error("Unexpected error occurred");
  }
}

// Specific service calls
export async function getUserById(userId: string) {
  return apiRequest<{ user: unknown }>(`/user/${userId}`, "GET");
}

export async function getHealth() {
  return apiRequest<{ status: string }>(`/health`, "GET");
}

export default api;
