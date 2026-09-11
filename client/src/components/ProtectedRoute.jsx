import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [loading, router, user]);

  if (loading || !user) return null;

  return children;
};

export const SellerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const allowed = user && (user.accountType === "seller" || user.isAdmin);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    else if (!loading && !allowed) router.replace("/dashboard");
  }, [allowed, loading, router, user]);

  if (loading || !allowed) return null;

  return children;
};

export default ProtectedRoute;
