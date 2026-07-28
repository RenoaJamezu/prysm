import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function AuthSwitcher() {
  const { pathname } = useLocation();

  const activeTab = pathname === "/register" ? "signup" : "signin";

  return (
    <div className="relative flex w-full overflow-hidden rounded-xl bg-gray-200 p-1 isolation-auto">
      <div
        className={cn(
          "absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-300 ease-in-out",
          activeTab === "signup" ? "translate-x-full" : "translate-x-0",
        )}
      />

      <Link
        to="/login"
        className={cn(
          "z-10 flex w-1/2 items-center justify-center rounded-lg py-2 text-sm transition-colors duration-200",
          activeTab === "signin"
            ? "font-medium text-gray-900"
            : "text-muted-foreground hover:text-gray-900",
        )}
      >
        Sign in
      </Link>

      <Link
        to="/register"
        className={cn(
          "z-10 flex w-1/2 items-center justify-center rounded-lg py-2 text-sm transition-colors duration-200",
          activeTab === "signup"
            ? "font-medium text-gray-900"
            : "text-muted-foreground hover:text-gray-900",
        )}
      >
        Create account
      </Link>
    </div>
  );
}
