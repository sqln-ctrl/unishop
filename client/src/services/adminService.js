import api from "./api.js";

export const getAdminStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

export const getAdminUsers = async (search = "") => {
  const res = await api.get("/admin/users", {
    params: search ? { search } : {},
  });

  return res.data;
};

export const deleteAdminUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

export const getAdminProducts = async (status = "") => {
  const res = await api.get("/admin/products", {
    params: status ? { status } : {},
  });

  return res.data;
};

export const deleteAdminProduct = async (id) => {
  const res = await api.delete(`/admin/products/${id}`);
  return res.data;
};

export const getAdminReports = async (status = "") => {
  const res = await api.get("/admin/reports", {
    params: status ? { status } : {},
  });

  return res.data;
};

export const updateAdminReport = async (id, status) => {
  const res = await api.patch(`/admin/reports/${id}`, {
    status,
  });

  return res.data;
};

export const createAdmin = async (data) => {
  const res = await api.post("/admin/admins", data);
  return res.data;
};

export const changeAdminPassword = async (data) => {
  const res = await api.patch("/admin/password", data);
  return res.data;
};

export const updateAdminCredentials = async (data) => {
  const res = await api.patch("/admin/account", data);
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await api.patch(`/admin/users/${id}/role`, { role });
  return res.data;
};
