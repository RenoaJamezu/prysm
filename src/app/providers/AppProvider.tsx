import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/providers/AuthProvider";

import { businessService } from "@/features/onboarding/services/business.service";
import type { Business } from "@/features/onboarding/types";
import { Toaster } from "sonner";
import { SidebarProvider } from "@/providers/SidebarProvider";

type AppContextValue = {
  business: Business | null;
  loading: boolean;

  refreshBusiness: () => Promise<void>;
  clearBusiness: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const { user, loading: authLoading } = useAuth();

  const [business, setBusiness] = useState<Business | null>(null);

  const [loading, setLoading] = useState(true);

  const refreshBusiness = useCallback(async () => {
    if (!user) {
      setBusiness(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await businessService.getMine();
      
      if (!result) {
        setBusiness(null);
        return;
      }

      setBusiness({
        ...result,
        logo_url: businessService.getLogoUrl(result.logo_url),
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const clearBusiness = useCallback(() => {
    setBusiness(null);
  }, []);

  useEffect(() => {
    if (authLoading) return;

    refreshBusiness();
  }, [authLoading, refreshBusiness]);

  const value = useMemo(
    () => ({
      business,
      loading,
      refreshBusiness,
      clearBusiness,
    }),
    [business, loading, refreshBusiness, clearBusiness],
  );

  return (
    <AppContext.Provider value={value}>
      <SidebarProvider>
        {children}
        <Toaster position="top-right" closeButton />{" "}
      </SidebarProvider>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider.");
  }

  return context;
}
