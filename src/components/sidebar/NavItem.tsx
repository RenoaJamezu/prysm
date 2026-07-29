import { NavLink } from "react-router-dom";
import { useSidebar } from "@/providers/SidebarProvider";

type NavItemProps = {
  item: {
    label: string;
    href: string;
    icon: React.ElementType;
  };
};

export default function NavItem({ item }: NavItemProps) {
  const { collapsed } = useSidebar();

  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        [
          "flex h-11 items-center rounded-lg transition-colors",

          collapsed
            ? "justify-center"
            : "gap-3 px-3",

          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        ].join(" ")
      }
    >
      <Icon size={20} />

      <span
        className={[
          "overflow-hidden whitespace-nowrap transition-all duration-300",

          collapsed
            ? "w-0 opacity-0"
            : "w-auto opacity-100",
        ].join(" ")}
      >
        {item.label}
      </span>
    </NavLink>
  );
}