import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import { useApp } from "@/app/providers/AppProvider";

export default function GuestRoute() {
  const { loading, isAuthenticated } = useAuth();
  const { business, loading: appLoading } = useApp();

  if (loading || appLoading) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <Navigate to={business ? "/onboarding/business" : "/dashboard"} replace />
    );
  }

  return <Outlet />;
}
