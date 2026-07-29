import { navigation } from "@/config/navigation";

import NavItem from "./NavItem";

export default function SidebarNav() {
  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <NavItem key={item.href} item={item} />
      ))}
    </nav>
  );
}
