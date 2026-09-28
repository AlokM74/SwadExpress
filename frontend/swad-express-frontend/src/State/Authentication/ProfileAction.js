import { api } from "../../components/config/api";

export const getUserProfile = async (jwt) => {
  const { data } = await api.get("/api/users/profile", {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return data;
};

export const updateUserProfile = async ({ jwt, profile }) => {
  const { data } = await api.put("/api/users/profile", profile, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return data;
};

export const sendEmailVerification = async (jwt) => {
  const { data } = await api.post(
    "/api/users/profile/email-verification/send",
    {},
    { headers: { Authorization: `Bearer ${jwt}` } },
  );
  return data;
};

export const verifyEmail = async ({ jwt, otp }) => {
  const { data } = await api.post(
    "/api/users/profile/email-verification/verify",
    { otp },
    { headers: { Authorization: `Bearer ${jwt}` } },
  );
  return data;
};
