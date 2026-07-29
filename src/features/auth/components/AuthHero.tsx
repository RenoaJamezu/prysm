import AppLogo from "@/components/logo/AppLogo";
import { ChartColumn, ChartLine, ShieldCheck } from "lucide-react";

export default function AuthHero() {
  return (
    <div className="h-full flex flex-col gap-8">
      <header className="flex items-center gap-3 mb-auto">
        <AppLogo />
      </header>

      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">
          The sales layer your <br />
          business was missing.
        </h1>

        <p className="text-muted-foreground">
          PRYSM turns every order into clear number — revenue trends, top
          products and daily performance, all in one calm dashboard.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="bg-primary/20 text-primary p-3 rounded-full">
          <ChartLine />
        </span>
        <div>
          <h6 className="font-semibold">Revenue at a glance</h6>
          <p className="text-muted-foreground">
            Daily, weekly and monthly trends without a spreadsheet.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="bg-primary/20 text-primary p-3 rounded-full">
          <ChartColumn />
        </span>
        <div>
          <h6 className="font-semibold">Know your best seller</h6>
          <p className="text-muted-foreground">
            See which kind of drinks or dishes actually carry the shop.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="bg-primary/20 text-primary p-3 rounded-full">
          <ShieldCheck />
        </span>
        <div>
          <h6 className="font-semibold">Built for small teams</h6>
          <p className="text-muted-foreground">
            Log a sale in seconds — no POS training required.
          </p>
        </div>
      </div>

      <footer className="mt-auto text-muted-foreground">
        <p>Trusted by independent or small business in the neighbourhood.</p>
      </footer>
    </div>
  );
}
