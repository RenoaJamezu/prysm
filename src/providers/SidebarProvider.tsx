import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SidebarContextValue = {
  collapsed: boolean;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar") === "collapsed";
  });

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;

      localStorage.setItem("sidebar", next ? "collapsed" : "expanded");

      return next;
    });
  }

  const value = useMemo(
    () => ({
      collapsed,
      toggle,
    }),
    [collapsed],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }

  return context;
}
