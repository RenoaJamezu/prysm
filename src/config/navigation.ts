import {
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Package,
  ShoppingCart,
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
    label: "Sales",
    href: "/sales",
    icon: ShoppingCart,
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Boxes,
  },
  {
    label: "Queue",
    href: "/queue",
    icon: ClipboardList,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  // {
  //   label: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  // },
] as const;
