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