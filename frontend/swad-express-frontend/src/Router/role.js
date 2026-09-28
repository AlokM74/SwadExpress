export const getRoleFromToken = () => {
  const token = localStorage.getItem("jwt");

  if (!token) return null;

  try {
    const payloadPart = token.split(".")[1];

    if (!payloadPart) return null;

    const encodedPayload = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = JSON.parse(atob(encodedPayload));

    const authorities = Array.isArray(payload.authorities)
      ? payload.authorities
      : String(payload.authorities || "").split(",");

    return (
      authorities
        .map((authority) => String(authority).trim())
        .find((authority) => authority.startsWith("ROLE_")) || null
    );
  } catch {
    return null;
  }
};