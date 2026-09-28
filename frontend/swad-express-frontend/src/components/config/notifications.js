export const APP_NOTIFICATION_EVENT = "swad:notification";

export const notify = (message, severity = "info") => {
  if (typeof window === "undefined" || !message) return;

  window.dispatchEvent(
    new CustomEvent(APP_NOTIFICATION_EVENT, {
      detail: { message: String(message), severity },
    }),
  );
};

export const getApiErrorMessage = (error) => {
  const response = error?.response;
  const responseData = response?.data;
  const serverMessage =
    responseData?.message ??
    (typeof responseData === "string" && responseData.length < 300
      ? responseData
      : "");

  if (serverMessage && !serverMessage.trimStart().startsWith("<")) {
    return serverMessage;
  }

  if (response?.status === 400) return "Please check your information and try again.";
  if (response?.status === 401) return "Please sign in to continue.";
  if (response?.status === 403) return "You don't have permission to perform this action.";
  if (response?.status === 404) return "The requested information was not found.";
  if (response?.status >= 500) return "The server encountered an error. Please try again.";
  if (!response) return "Unable to connect to the server. Please try again.";

  return error?.message || "Something went wrong. Please try again.";
};
