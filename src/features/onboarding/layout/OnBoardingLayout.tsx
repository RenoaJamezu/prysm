import AppLogo from "@/components/logo/AppLogo";
import type { ReactNode } from "react";

interface OnboardingLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function OnboardingLayout({
  title,
  description,
  children,
}: OnboardingLayoutProps) {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-muted/30 p-6 gap-5">
      <header className="flex items-center gap-3 col">
        <AppLogo />
      </header>

      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold">{title}</h1>
        <p className="text-sm sm:text-md text-muted-foreground">{description}</p>
      </div>

      <div className="rounded-3xl border bg-background p-4 sm:p-6 shadow-sm">
        {children}
      </div>
    </main>
  );
}
