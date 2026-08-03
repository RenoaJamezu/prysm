import { eachDayOfInterval, format } from "date-fns";

import { supabase } from "@/lib/supabase";

import type { OrderItem } from "@/features/orders/types";

import type {
  AnalyticsFilter,
  AnalyticsOrder,
  AnalyticsOverview,
  SalesTrendPoint,
} from "../types";

const TABLE = "orders";

export const analyticsService = {
  getOverview,
  getOrders,
  getOrderItems,
  getSalesTrend,
};

async function getOverview(
  businessId: string,
  from: string,
  to: string,
): Promise<AnalyticsOverview> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("total,order_status")
    .eq("business_id", businessId)
    .gte("created_at", from)
    .lte("created_at", to);

  if (error) throw error;

  const completed = data.filter((order) => order.order_status === "completed");

  const cancelled = data.filter((order) => order.order_status === "cancelled");

  const totalSales = completed.reduce(
    (sum, order) => sum + Number(order.total),
    0,
  );

  return {
    totalSales,

    totalOrders: completed.length,

    averageOrder: completed.length === 0 ? 0 : totalSales / completed.length,

    cancelledOrders: cancelled.length,
  };
}

async function getOrders(
  businessId: string,
  from: string,
  to: string,
): Promise<AnalyticsOrder[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("business_id", businessId)
    .gte("created_at", from)
    .lte("created_at", to)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data as AnalyticsOrder[];
}

async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at");

  if (error) throw error;

  return data as OrderItem[];
}

async function getSalesTrend(
  businessId: string,
  from: string,
  to: string,
  filter: AnalyticsFilter,
): Promise<SalesTrendPoint[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("created_at,total")
    .eq("business_id", businessId)
    .eq("order_status", "completed")
    .gte("created_at", from)
    .lte("created_at", to)
    .order("created_at");

  if (error) throw error;

  if (filter === "today" || filter === "yesterday") {
    const hours = Array.from({ length: 24 }, (_, index) => ({
      label: `${index.toString().padStart(2, "0")}:00`,
      sales: 0,
    }));

    data.forEach((order) => {
      const hour = new Date(order.created_at).getHours();

      hours[hour].sales += Number(order.total);
    });

    return hours;
  }

  // WEEK / MONTH
  const days = eachDayOfInterval({
    start: new Date(from),
    end: new Date(to),
  }).map((date) => ({
    label: format(date, "MMM d"),
    sales: 0,
    key: format(date, "yyyy-MM-dd"),
  }));

  const map = new Map(days.map((day) => [day.key, day]));

  data.forEach((order) => {
    const key = format(new Date(order.created_at), "yyyy-MM-dd");

    const point = map.get(key);

    if (point) {
      point.sales += Number(order.total);
    }
  });

  return days.map(({ label, sales }) => ({
    label,
    sales,
  }));
}
