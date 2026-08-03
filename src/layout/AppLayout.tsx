import { Outlet } from "react-router-dom";

import AppHeader from "@/components/header/AppHeader";
import AppSidebar from "@/components/sidebar/AppSidebar";
import { useEffect } from "react";
import { sound } from "@/lib/sound";

export default function AppLayout() {
  useEffect(() => {
    const unlock = () => {
      sound.unlock();
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

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
