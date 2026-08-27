import api from "./api.js";

// Accepts an array of File objects, returns an array of hosted image URLs.
export const uploadImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await api.post("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.urls;
};