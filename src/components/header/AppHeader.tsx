import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

import SearchBar from "./SearchBar";
import BusinessMenu from "./BusinessMenu";

import { useSidebar } from "@/providers/SidebarProvider";

export default function AppHeader() {
  const { collapsed, toggle } = useSidebar();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-5">
      <div className="flex items-center gap-5">
        <Button variant="ghost" size="icon" onClick={toggle}>
          {collapsed ? (
            <PanelLeftOpen size={20}/>
          ) : (
            <PanelLeftClose size={20}/>
          )}
        </Button>

        <SearchBar />
      </div>

      <BusinessMenu />
    </header>
  );
}
