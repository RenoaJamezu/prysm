import { Building2, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useApp } from "@/app/providers/AppProvider";

import { authService } from "@/services/auth.service";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";

export default function BusinessMenu() {
  const { business } = useApp();
  const { user } = useAuth();

  async function handleLogout() {
    await authService.signOut();
    toast.success("Logout Successfully");
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 py-1.5 px-4 bg-secondary rounded-full border border-secondary-foreground">
        <Building2 size={20} />
        
        <p className="truncate font-medium text-sm sm:text-lg">{business?.name}</p>
      </div>

      <div className="mt-1">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-12 w-12">
              <AvatarImage src={business?.logo_url ?? ""} />

              <AvatarFallback>
                {business?.name?.charAt(0).toUpperCase() ?? "P"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2"
          >
            <span tabIndex={0} className="sr-only" />
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="space-y-1">
                  <p className="truncate font-medium text-xl">
                    {business?.name}
                  </p>

                  <p className="text-sm font-normal text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link
                to="/settings"
                className="flex cursor-pointer items-center gap-2 text-[16px] font-semibold py-1 w-full"
              >
                <Settings size={16} />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout} variant="destructive">
              <span className="flex cursor-pointer items-center gap-2 text-[16px] font-semibold py-1">
                <LogOut size={16} />
                Logout
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
