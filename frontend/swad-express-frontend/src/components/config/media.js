export const safeImageUrl = (value) => {
  if (!value || typeof value !== "string") return undefined;

  try {
    const url = new URL(value, window.location.origin);
    const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);

    if (window.location.protocol === "https:" && isLocalHost && url.protocol !== "https:") {
      return undefined;
    }

    return url.href;
  } catch {
    return undefined;
  }
};
