import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext.jsx";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    else if (!loading && !user.isAdmin) router.replace("/dashboard");
  }, [loading, router, user]);

  if (loading || !user || !user.isAdmin) return null;

  return children;
};

export default AdminRoute;
