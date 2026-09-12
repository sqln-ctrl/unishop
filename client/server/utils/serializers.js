import { getRole } from "./roles.js";

// Preserve the REST contract (_id and populated relations) for the React client.
export const sellerSelect = {
  id: true, name: true, university: true, profileImage: true,
};

export const userSelect = {
  ...sellerSelect,
  email: true, accountType: true, isAdmin: true, isVerified: true,
  createdAt: true, updatedAt: true, tokenVersion: true,
};

export const serializeUser = (user) => {
  if (!user) return null;
  const { id, password, tokenVersion, wishlist, ...fields } = user;
  return {
    _id: id,
    ...fields,
    ...(user.accountType !== undefined ? { role: getRole(user) } : {}),
    ...(wishlist ? { wishlist: wishlist.map((item) => item.productId) } : {}),
  };
};

export const serializeProduct = (product) => {
  if (!product) return null;
  const { id, sellerId, seller, ...fields } = product;
  return {
    _id: id,
    ...fields,
    seller: seller ? serializeUser(seller) : sellerId,
  };
};

export const serializeReport = (report) => {
  const { id, reporterId, productId, reporter, product, ...fields } = report;
  return {
    _id: id,
    ...fields,
    reporter: reporter ? serializeUser(reporter) : reporterId,
    product: product ? serializeProduct(product) : productId,
  };
};
