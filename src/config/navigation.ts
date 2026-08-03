import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Package,
} from "lucide-react";

export const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
  },
  {
    label: "Queue",
    href: "/queue",
    icon: ClipboardList,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
] as const;
