import {
  ShoppingBag,
  PhilippinePeso,
  ReceiptText,
  CircleX,
} from "lucide-react";

import type { AnalyticsOverview } from "../types";

import { Card } from "@/components/ui/card";

type OverviewCardsProps = {
  loading: boolean;

  overview: AnalyticsOverview | null;
};

type OverviewCardProps = {
  title: string;

  value: string | number;

  icon: React.ReactNode;
};

function OverviewCard({ title, value, icon }: OverviewCardProps) {
  return (
    <Card className="flex items-center rounded-2xl border bg-card p-6 shadow-xs transition-all duration-200 hover:shadow-md">
      <div className="w-full flex justify-between">
        <p className="truncate text-lg font-semibold text-muted-foreground">
          {title}
        </p>
        <div className="flex p-2 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <span className="scale-75">{icon}</span>
        </div>
      </div>
      <h2 className="mt-1 font-bold w-full text-lg sm:text-4xl">
        {value}
      </h2>
    </Card>
  );
}

export default function OverviewCards({
  loading,
  overview,
}: OverviewCardsProps) {
  if (loading || !overview) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-32 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <OverviewCard
        title="Total Sales"
        value={`₱${overview.totalSales.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        icon={<PhilippinePeso />}
      />

      <OverviewCard
        title="Orders"
        value={overview.totalOrders}
        icon={<ShoppingBag />}
      />

      <OverviewCard
        title="Average Order"
        value={`₱${overview.averageOrder.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        icon={<ReceiptText />}
      />

      <OverviewCard
        title="Cancelled Orders"
        value={overview.cancelledOrders}
        icon={<CircleX />}
      />
    </div>
  );
}
