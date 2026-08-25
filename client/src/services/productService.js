import api from "./api.js";

export const getProducts = async (params = {}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await api.post("/products", data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const markAsSold = async (id) => {
  const res = await api.patch(`/products/${id}/sold`);
  return res.data;
};

export const getUserListings = async (userId) => {
  const res = await api.get(`/users/${userId}/listings`);
  return res.data;
};
