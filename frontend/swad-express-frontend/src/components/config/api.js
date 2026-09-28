import axios from "axios"
import { getApiErrorMessage, notify } from "./notifications";

const API_URL=import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const expectedMissingRestaurant =
      error.response?.status === 404 &&
      error.config?.url?.includes("/api/admin/restaurants/user");
    if (
      !axios.isCancel(error) &&
      !error.config?.skipGlobalErrorNotification &&
      !expectedMissingRestaurant
    ) {
      notify(getApiErrorMessage(error), "error");
    }
    return Promise.reject(error);
  },
);