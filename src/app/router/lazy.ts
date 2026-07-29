import { lazy } from "react";

export const LoginPage = lazy(
  () => import("@/features/auth/pages/LoginPage"),
);

export const RegisterPage = lazy(
  () => import("@/features/auth/pages/RegisterPage"),
);

export const CreateBusinessPage = lazy(
  () => import("@/features/onboarding/pages/CreateBusinessPage"),
);

export const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage"),
);

export const ProductsPage = lazy(
  () => import("@/features/products/pages/ProductsPage"),
);

export const SalesPage = lazy(
  () => import("@/features/sales/pages/SalesPage"),
);

export const InventoryPage = lazy(
  () => import("@/features/inventory/pages/InventoryPage"),
);

export const QueuePage = lazy(
  () => import("@/features/queue/pages/QueuePage"),
);

export const ReportsPage = lazy(
  () => import("@/features/reports/pages/ReportsPage"),
);

export const SettingsPage = lazy(
  () => import("@/features/settings/pages/SettingsPage"),
);