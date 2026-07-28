import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export default function DashboardPage() {
  async function handleLogout() {
    await authService.signOut();
    toast.success("Logout successfully")
  }
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-3">
      Dashboard Page
      <Button onClick={handleLogout}> Logout </Button>
    </div>
  );
}
