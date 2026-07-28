import type { PropsWithChildren } from "react";
import AuthHero from "../components/AuthHero";
import AuthSwitcher from "../components/AuthSwitcher";

interface AuthLayoutProps extends PropsWithChildren {
  title: string;
  description: string;
}

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen lg:grid-cols-12">
      <section className="flex items-center justify-center p-12 lg:col-span-6 lg:flex bg-linear-[135deg] from-primary/10 to-primary-foreground">
        <AuthHero />
      </section>

      <section className="col-span-12 flex items-center justify-center p-12 lg:col-span-6 bg-gray-100">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{title}</h1>

            <p className="text-muted-foreground">{description}</p>
          </div>

          <AuthSwitcher />

          {children}
        </div>
      </section>
    </main>
  );
}
