import type { OrderStatus } from "@/features/orders/types";

export type AnalyticsFilter =
  | "today"
  | "yesterday"
  | "week"
  | "month"
  | "custom";

export interface AnalyticsOverview {
  totalSales: number;

  totalOrders: number;

  averageOrder: number;

  cancelledOrders: number;
}

export interface AnalyticsOrder {
  id: string;

  ticket_code: string;

  order_status: OrderStatus;

  total: number;

  created_at: string;

  notes: string | null;
}

export type SalesTrendPoint = {
  label: string;
  sales: number;
};
