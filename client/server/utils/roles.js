// Keep the existing account fields as the source of truth for permissions.
export const roles = ["regular", "seller", "admin"];

export const getRole = (user) => {
  if (!user) return null;
  if (user.isAdmin === true) return "admin";
  return ["regular", "seller"].includes(user.accountType) ? user.accountType : null;
};

export const roleData = (role) => ({
  isAdmin: role === "admin",
  accountType: role === "seller" ? "seller" : "regular",
});
