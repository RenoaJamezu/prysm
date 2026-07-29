import { Building2 } from "lucide-react";

import { useSidebar } from "@/providers/SidebarProvider";
import { useApp } from "@/app/providers/AppProvider";

export default function SidebarFooter() {
  const { collapsed } = useSidebar();
  const { business } = useApp();

  return (
    <div className="border-t p-3">
      <div
        className={[
          "flex items-center",
          collapsed ? "justify-center" : "gap-3",
        ].join(" ")}
      >
        <Building2 size={20} />

        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground">Powered by:</p>

            <p className="truncate text-sm font-medium">{business?.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
