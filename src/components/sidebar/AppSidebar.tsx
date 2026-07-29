import SidebarFooter from "./SidebarFooter";
import SidebarNav from "./SidebarNav";
import { useSidebar } from "@/providers/SidebarProvider";

export default function AppSidebar() {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={[
        "flex shrink-0 flex-col border-r bg-card transition-[width] duration-300",
        collapsed ? "w-18" : "w-64",
      ].join(" ")}
    >
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav />
      </div>

      <SidebarFooter />
    </aside>
  );
}