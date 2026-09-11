import api from "./api.js";

export const createReport = async ({
  productId,
  reason,
  description,
}) => {
  const res = await api.post("/reports", {
    productId,
    reason,
    description,
  });

  return res.data;
};
