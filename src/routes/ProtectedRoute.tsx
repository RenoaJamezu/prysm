import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";

export default function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
