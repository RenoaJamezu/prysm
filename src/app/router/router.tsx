import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import GuestRoute from "@/routes/GuestRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import BusinessRoute from "@/routes/BusinessRoute";

import {
  LoginPage,
  RegisterPage,
  CreateBusinessPage,
  DashboardPage,
} from "./lazy";

import { PageLoader } from "@/components/LoadingPage";

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: withSuspense(<LoginPage />),
      },
      {
        path: "/register",
        element: withSuspense(<RegisterPage />),
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/onboarding/business",
        element: withSuspense(<CreateBusinessPage />),
      },

      {
        element: <BusinessRoute />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },

          {
            path: "dashboard",
            element: withSuspense(<DashboardPage />),
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
]);
