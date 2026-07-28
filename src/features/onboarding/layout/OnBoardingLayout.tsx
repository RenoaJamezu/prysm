import { Pyramid } from "lucide-react";
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
    <main className="grid min-h-screen items-center justify-center bg-muted/30 p-6">
      <header className="flex items-center gap-3 col">
        <span className="rounded-full p-2 bg-prysm text-white">
          <Pyramid />
        </span>
        <h3 className="font-semibold">PRYSM</h3>
      </header>

      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="rounded-3xl border bg-background p-10 shadow-sm">
        {children}
      </div>
    </main>
  );
}
