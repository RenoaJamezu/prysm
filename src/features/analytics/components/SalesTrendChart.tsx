import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SalesTrendPoint } from "../types";

import { Card } from "@/components/ui/card";

type Props = {
  loading: boolean;
  data: SalesTrendPoint[];
};

export default function SalesTrendChart({ loading, data }: Props) {
  return (
    <Card className="rounded-2xl border bg-card p-6 shadow-xs">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Sales Trend</h2>

        <p className="text-sm text-muted-foreground">
          Completed sales over the selected period.
        </p>
      </div>

      <div className="h-80">
        {loading ? (
          <div className="h-full animate-pulse rounded-xl bg-muted" />
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed">
            <p className="text-sm text-muted-foreground">No sales available.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />

                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.25}
              />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                }}
              />

              <YAxis
                tickFormatter={(value) => `₱${Number(value).toLocaleString()}`}
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                }}
              />

              <Tooltip
                formatter={(value) => {
                  const amount = Number(value ?? 0);

                  return [
                    `₱${amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`,
                    "Sales",
                  ];
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />

              <Area
                type="monotone"
                dataKey="sales"
                stroke="#22c55e"
                strokeWidth={3}
                fill="url(#salesGradient)"
                activeDot={{
                  r: 6,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
