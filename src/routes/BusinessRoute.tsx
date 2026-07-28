import { useApp } from "@/app/providers/AppProvider";
import { Navigate, Outlet } from "react-router-dom";

export default function BusinessRoute() {
  const { business, loading } = useApp();

  if (loading) {
    return null;
  }

  if (!business) {
    return <Navigate to="/onboarding/business" replace />;
  }

  return <Outlet />;
}
