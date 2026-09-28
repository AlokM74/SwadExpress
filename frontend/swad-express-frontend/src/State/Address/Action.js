import { api } from "../../components/config/api";

const authHeaders = (jwt) => ({
  Authorization: `Bearer ${jwt}`,
});

export const getAddresses = async (jwt) => {
  const { data } = await api.get("/api/users/addresses", {
    headers: authHeaders(jwt),
  });
  return data;
};

export const createAddress = async ({ jwt, address }) => {
  const { data } = await api.post("/api/users/addresses", address, {
    headers: authHeaders(jwt),
  });
  return data;
};

export const deleteAddress = async ({ jwt, addressId }) => {
  await api.delete(`/api/users/addresses/${addressId}`, {
    headers: authHeaders(jwt),
  });
};

export const setDefaultAddress = async ({ jwt, addressId }) => {
  const { data } = await api.put(
    `/api/users/addresses/${addressId}/default`,
    null,
    {
      headers: authHeaders(jwt),
    },
  );
  return data;
};
