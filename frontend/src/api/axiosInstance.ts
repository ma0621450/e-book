import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getCsrfToken } from "./utils";

const csrfToken = getCsrfToken() || "";

const axiosInstance = axios.create({
  baseURL: "",
  headers: {
    "X-CSRF-Token": csrfToken,
  },
});

// helper function to handle errors
const handleError = (
  error: unknown,
  defaultMessage: string = "An unexpected error occurred."
): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      if (error.response.status === 422) {
        const validationErrors = error.response.data.errors;

        if (validationErrors && typeof validationErrors === "object") {
          const errorMessages = Object.values(
            validationErrors
          ).flat() as string[];
          return errorMessages.join("\n");
        } else {
          return "Validation failed but errors format is unexpected.";
        }
      } else if (error.response.status >= 500) {
        return "Server error, please try again later.";
      } else {
        return error.response.data.message || defaultMessage;
      }
    } else {
      return error.message || defaultMessage;
    }
  } else if (error instanceof Error) {
    return error.message || defaultMessage;
  } else {
    return defaultMessage;
  }
};

export const apiRequest = async <T>(
  endpoint: string,
  method: "get" | "post" | "put" | "patch" | "delete",
  data?: any,
  config?: AxiosRequestConfig
): Promise<{ data?: T; error?: string }> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url: endpoint,
      method,
      data,
      ...config,
    });
    return { data: response.data };
  } catch (error: unknown) {
    return { error: handleError(error) };
  }
};
