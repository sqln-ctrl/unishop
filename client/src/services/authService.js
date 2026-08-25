import api from "./api.js";

export const register = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const switchAccountType = async (accountType) => {
  const res = await api.patch("/auth/account-type", { accountType });
  return res.data;
};
