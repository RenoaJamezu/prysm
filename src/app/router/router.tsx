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
  ProductsPage,
  SalesPage,
  InventoryPage,
  QueuePage,
  ReportsPage,
  SettingsPage,
} from "./lazy";

import { PageLoader } from "@/components/LoadingPage";
import AppLayout from "@/layout/AppLayout";

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
            element: <AppLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/dashboard" replace />,
              },
              {
                path: "/dashboard",
                element: withSuspense(<DashboardPage />),
              },
              {
                path: "/products",
                element: withSuspense(<ProductsPage />),
              },
              {
                path: "/sales",
                element: withSuspense(<SalesPage />),
              },
              {
                path: "/inventory",
                element: withSuspense(<InventoryPage />),
              },
              {
                path: "/queue",
                element: withSuspense(<QueuePage />),
              },
              {
                path: "/reports",
                element: withSuspense(<ReportsPage />),
              },
              {
                path: "/settings",
                element: withSuspense(<SettingsPage />),
              },
            ],
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
