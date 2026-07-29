import { Outlet } from "react-router-dom";

import AppHeader from "@/components/header/AppHeader";
import AppSidebar from "@/components/sidebar/AppSidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <AppHeader />

      <div className="flex min-h-0 flex-1">
        <AppSidebar />

        <main className="min-w-0 flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
